<template>
  <n-layout class="siteManager">
    <div class="header">
      <n-button @click="handleAddIptv">
        <template #icon><n-icon size="20"><Add /></n-icon></template>Add
      </n-button>
      <n-button @click="handleCheckAll">
        <template #icon><n-icon size="20"><ShieldCheckmarkOutline /></n-icon></template>Check
      </n-button>
    </div>
    <div class="list">
      <n-data-table
      ref="table"
      size="small"
      :columns="columns"
      :data="iptvList"
      flex-height
      style="height: 100%;"
    />
    </div>
    <n-modal v-model:show="addEdit">
      <n-card style="width: 500px" role="dialog" aria-modal="true">
        <template #header>
          {{ iptv.type === 'add' ? 'Add' : 'Edit' }}
        </template>
        <n-spin :show="checking">
          <n-form ref="formRef" :model="iptv" label-placement="left" label-width="auto" :rules="rules">
            <n-form-item label="Name" path="name">
              <n-input v-model:value="iptv.name" placeholder="Name" />
            </n-form-item>
            <n-form-item label="Url" path="url">
              <n-input v-model:value="iptv.url" placeholder="Url" />
            </n-form-item>
            <n-form-item label="Note" path="note">
              <n-input v-model:value="iptv.note" placeholder="Note" type="textarea" />
            </n-form-item>
            <n-form-item label="Active" path="isActive">
              <n-switch v-model:value="iptv.active" />
            </n-form-item>
          </n-form>
        </n-spin>
        <template #footer>
          <div class="btns" style="display: flex; justify-content: flex-end;">
            <n-button @click="handleFormCancel">cancel</n-button>
            <n-button @click="handleFormConfirm" style="margin-left: 10px">confirm</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </n-layout>
</template>
<script lang="ts" setup>
import { db } from '@/renderer/utils/database/controller/DBTools'
import { Add, ShieldCheckmarkOutline } from '@vicons/ionicons5'
import bus from '../../plugins/mitt'
import { IpTv } from '@/renderer/utils/database/models/IpTv'
import { NButton, NSwitch, useMessage } from 'naive-ui'
import { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface'
import { checkM3uUrl } from '@/renderer/utils/iptv'
import { cloneDeep, sortBy } from 'lodash'

const message = useMessage()
const iptvList = ref([])
const columns: TableBaseColumn<IpTv>[] = [
  {
    title: 'Name',
    key: 'name',
    width: 200
  },
  {
    title: 'Note',
    key: 'note',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Number',
    key: 'list.length',
    width: 140,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Active',
    key: 'active',
    width: 140,
    render (row: IpTv) {
      return h(NSwitch, { defaultValue: row.active, onClick: () => handleActive(row) })
    }
  },
  {
    title: 'Operator',
    key: 'key',
    width: 300,
    render (row: IpTv) {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleTop(row) }, { default: () => 'Top' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleEdit(row) }, { default: () => 'Edit' }),
        h(NButton, { loading: handleBtnLoading(row.loading), style: { marginRight: '6px' }, size: 'small', onClick: () => handleCheck(row) }, { default: () => 'Check' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleDelete(row) }, { default: () => 'Delete' })
      ])
    }
  }
]

const iptv = reactive({
  type: 'add',
  id: 0,
  name: '',
  url: '',
  active: true,
  note: '',
  state: true,
  loading: false,
  list: []
})
const rules = ref({
  name: { required: true },
  url: { required: true }
})
const checkAll = ref(false)
const addEdit = ref(false)
const formRef = ref()
const checking = ref(false)

onMounted(() => {
  getIptvList()
})

async function getIptvList () {
  const res = await db.all('iptv')
  const list = sortBy(res, 'id')
  list.forEach(item => { item.loading = false })
  iptvList.value = list
}

async function handleAddIptv () {
  if (checkAll.value) return false
  addEdit.value = true
  checking.value = false
  iptv.type = 'add'
  iptv.name = ''
  iptv.url = ''
  iptv.active = true
  iptv.note = ''
  iptv.list = []
}
function handleEdit (item: IpTv) {
  if (checkAll.value) return false
  addEdit.value = true
  iptv.type = 'edit'
  iptv.id = item.id
  iptv.name = item.name
  iptv.url = item.url
  iptv.note = item.note
  iptv.active = item.active
  iptv.state = item.state
  iptv.list = item.list
}
function handleFormCancel () {
  addEdit.value = false
}
function handleFormConfirm () {
  checking.value = false
  if (checkRepeat(iptv.url)) return message.warning('链接已存在，请检查后输入')
  formRef.value.validate(async (err: Promise<any>) => {
    if (!err) {
      checking.value = true
      const { flag, list } = await checkM3uUrl(iptv.url)
      if (flag) {
        addEdit.value = false
        checking.value = false
        const doc = {
          name: iptv.name,
          url: iptv.url,
          active: iptv.active,
          note: iptv.note,
          state: true,
          list: list
        }
        if (iptv.type === 'add') {
          await db.put<IpTv>('iptv', doc)
          message.success('添加成功')
        } else {
          await db.update('iptv', iptv.id, doc)
          message.success('编辑成功')
        }
        await getIptvList()
        bus.emit('bus.iptv.change')
      } else {
        checking.value = false
        message.success('接口验证不通过')
      }
    }
  })
}

function handleBtnLoading (flag: boolean) {
  if (flag) return true
  return false
}
async function handleActive (item: IpTv) {
  item.active = !item.active
  await db.update('iptv', item.id, item)
  bus.emit('bus.iptv.change')
}
async function handleTop (item: IpTv) {
  if (checkAll.value) return false
  const id = item.id
  const list = cloneDeep(iptvList.value)
  list.map(li => {
    if (li.id === 0) li.id = id
    if (li.name === item.name) li.id = 0
  })
  const newList = sortBy(cloneDeep(list), 'id')
  iptvList.value = newList
  db.clear('iptv').then(async () => {
    await db.bulkAdd('iptv', newList)
    bus.emit('bus.iptv.change')
  })
}
async function handleCheck (item: IpTv) {
  if (checkAll.value) return false
  item.loading = true
  const { flag } = await checkM3uUrl(item.url)
  if (flag) {
    item.state = true
    message.success('接口可用')
  } else {
    item.state = false
    item.active = false
  }
  item.loading = false
  await db.update<IpTv>('iptv', item.id, { state: item.state, active: item.active })
  getIptvList()
}
async function handleDelete (item: IpTv) {
  if (checkAll.value) return false
  await db.delete('iptv', item.id)
  await getIptvList()
  message.success('删除成功')
}

function checkRepeat (url: string) {
  const list = cloneDeep(iptvList.value)
  for (const i of list) {
    if (i.url === url) {
      return true
    }
  }
  return false
}

async function handleCheckAll () {
  checkAll.value = true
  await Promise.all(iptvList.value.map(async tv => {
    tv.loading = true
    const { flag } = await checkM3uUrl(tv.api)
    tv.state = flag
    await db.update('sites', tv.id, tv)
    tv.loading = false
  }))
  checkAll.value = false
  message.info('检测完毕')
}

</script>
<style lang="scss" scoped>
.siteManager{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .header{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;
    button{
      margin-left: 10px;
    }
  }
  .list{
    height: 100%;
    padding: 0 10px 10px;
  }
}
</style>
