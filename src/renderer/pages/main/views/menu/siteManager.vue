<template>
  <n-layout class="siteManager">
    <div class="header">
      <div class="left">
        <n-switch :round="false" v-model:value="toggle" @update:value="handleToggle" />
      </div>
      <div class="right">
        <n-button @click="handleUpdateSiteUrls" v-show="toggle">
          <template #icon><n-icon size="20"><CloudDownloadOutline /></n-icon></template>Update
        </n-button>
        <n-button @click="handleAddSiteUrl" v-show="toggle">
          <template #icon><n-icon size="20"><Add /></n-icon></template>Add
        </n-button>
        <n-button @click="handleAddSite" v-show="!toggle">
          <template #icon><n-icon size="20"><Add /></n-icon></template>Add
        </n-button>
        <n-dropdown :options="importOptions" placement="bottom-end" @select="handleImportSelect">
          <n-button v-show="!toggle">
            <n-icon size="20"><ArrowDown /></n-icon>Import
          </n-button>
        </n-dropdown>
        <n-button @click="handleExport" v-show="!toggle">
          <template #icon><n-icon size="20"><ArrowUp /></n-icon></template>Export
        </n-button>
        <n-button @click="handleCheckAll">
          <template #icon><n-icon size="20"><ShieldCheckmarkOutline /></n-icon></template>Check
        </n-button>
      </div>
    </div>
    <div class="list">
      <n-data-table
        v-if="!toggle"
        ref="table"
        size="small"
        :columns="columns"
        :data="siteList"
        flex-height
        style="height: 100%;"
      />
      <n-data-table
        v-if="toggle"
        ref="table"
        size="small"
        :columns="siteUrlsCol"
        :data="siteUrls"
        flex-height
        style="height: 100%;"
      />
    </div>
    <n-modal v-model:show="addEdit">
      <n-card style="width: 500px" role="dialog" aria-modal="true">
        <template #header>
          {{ site.type === 'add' ? 'Add' : 'Edit' }}
        </template>
        <n-spin :show="checking">
          <n-form ref="formRef" :model="site" label-placement="left" label-width="auto" :rules="rules">
            <n-form-item label="Name" path="name">
              <n-input v-model:value="site.name" placeholder="Name" />
            </n-form-item>
            <n-form-item label="Key" path="key">
              <n-input v-model:value="site.key" placeholder="Key" />
            </n-form-item>
            <n-form-item label="Api" path="api">
              <n-input v-model:value="site.api" placeholder="Api" />
            </n-form-item>
            <n-form-item label="Jiexi" path="jiexi">
              <n-input v-model:value="site.jiexi" placeholder="Jiexi" />
            </n-form-item>
            <n-form-item label="Group" path="group">
              <n-select v-model:value="site.group" :options="groupOptions" filterable tag />
            </n-form-item>
            <n-form-item label="Active" path="isActive">
              <n-switch v-model:value="site.isActive" />
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
    <n-modal v-model:show="onlineShow">
      <n-card style="width: 500px" role="dialog" aria-modal="true">
        <template #header>
          Import from online json url
        </template>
        <n-spin :show="checking">
          <n-form ref="formRef" :model="site" label-placement="left" label-width="auto">
            <n-form-item label="Url">
              <n-input v-model:value="jsonUrl" placeholder="URL" />
            </n-form-item>
          </n-form>
        </n-spin>
        <template #footer>
          <div class="btns" style="display: flex; justify-content: flex-end;">
            <n-button @click="handleJsonCancel">cancel</n-button>
            <n-button @click="handleJsonConfirm" style="margin-left: 10px">confirm</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
    <n-modal v-model:show="addEditSiteUrl">
      <n-card style="width: 500px" role="dialog" aria-modal="true">
        <template #header>
          Online json url
        </template>
        <n-spin :show="checking">
          <n-form ref="formRef" label-placement="left" label-width="auto">
            <n-form-item label="Url">
              <n-input v-model:value="siteUrl" placeholder="URL" />
            </n-form-item>
          </n-form>
        </n-spin>
        <template #footer>
          <div class="btns" style="display: flex; justify-content: flex-end;">
            <n-button @click="handleSiteUrlCancel">cancel</n-button>
            <n-button @click="handleSiteUrlConfirm" style="margin-left: 10px">confirm</n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </n-layout>
</template>
<script lang="ts" setup>
import { db } from '@/renderer/utils/database/controller/DBTools'
import { ArrowUp, ArrowDown, Add, ShieldCheckmarkOutline, CloudDownloadOutline } from '@vicons/ionicons5'
import { IpcDirective } from '@/main/ipcEnum'
import bus from '../../plugins/mitt'
import { Site } from '@/renderer/utils/database/models/Site'
import { NButton, NSwitch, useMessage } from 'naive-ui'
import { TableBaseColumn } from 'naive-ui/lib/data-table/src/interface'
import { cloneDeep, sortBy, uniqBy } from 'lodash'
import { checkApi, getOnlineJSON } from '@/renderer/utils/movie'
import { settingsDB } from '@/renderer/utils/database/controller/settingsDB'
import { SiteUrlsType } from '@/typings/video'

const message = useMessage()
const toggle = ref(false)
const checking = ref(false)

onMounted(() => {
  getSites()
})

const siteUrls = ref([])
const addEditSiteUrl = ref(false)
const siteUrl = ref('')
const siteUrlType = ref('add')
const siteItem = ref()
const siteUrlsCol: TableBaseColumn<SiteUrlsType>[] = [
  {
    title: 'Url',
    key: 'url',
    ellipsis: {
      tooltip: true
    },
    render (row: SiteUrlsType) {
      const url = row.url
      const arr = url.split('/')
      const name = arr[arr.length - 1].replace('.json', '')
      return name
    }
  },
  {
    title: 'State',
    key: 'state',
    width: 100,
    render (row: SiteUrlsType) {
      return row.state ? '可用' : '失效'
    }
  },
  {
    title: 'Active',
    key: 'active',
    width: 100,
    render (row: SiteUrlsType) {
      return h(NSwitch, { defaultValue: row.active, onClick: () => handleSiteUrlsActive(row) })
    }
  },
  {
    title: 'Operator',
    key: 'url',
    width: 240,
    render (row: SiteUrlsType) {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        row.url !== 'https://nfm-blu-ray.naifeimi.com/upload/jsonapi/naifeimiapi.json'
          ? h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleSiteUrlsEdit(row) }, { default: () => 'Edit' })
          : h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleUpdateSiteUrls() }, { default: () => 'Update' }),
        h(NButton, { loading: handleBtnLoading(row.loading), style: { marginRight: '6px' }, size: 'small', onClick: () => handleSiteUrlsCheck(row) }, { default: () => 'Check' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleSiteUrlsDelete(row) }, { default: () => 'Delete' })
      ])
    }
  }
]
async function handleUpdateSiteUrls () {
  try {
    await Promise.all(siteUrls.value.map(async item => {
      if (item.active) {
        const res = await getOnlineJSON(item.url)
        if (res) {
          const json = JSON.parse(res)
          await mergeSites(json)
        }
      }
    }))
  } catch (ignore) {}
}
async function handleToggle () {
  const list = await settingsDB.getSetting('siteUrls')
  siteUrls.value = list
}
function handleAddSiteUrl () {
  addEditSiteUrl.value = true
  siteUrlType.value = 'add'
}
async function handleSiteUrlCancel () {
  addEditSiteUrl.value = false
  siteUrlType.value = ''
  siteItem.value = null
  checking.value = false
}
async function handleSiteUrlConfirm () {
  if (!siteUrl.value.trim()) {
    return message.warning('请输入链接')
  }
  checking.value = true
  const res = await getOnlineJSON(siteUrl.value)
  if (res) {
    addEditSiteUrl.value = false
    if (siteUrlType.value === 'add') {
      const d = {
        id: new Date().getTime(),
        url: siteUrl.value,
        active: true,
        state: true,
        loading: false
      }
      siteUrls.value.push(d)
    }
    if (siteUrlType.value === 'edit') {
      for (const i of siteUrls.value) {
        if (i.id === siteItem.value.id) {
          i.url = siteUrl.value
          break
        }
      }
    }
    await settingsDB.updateSetting({ siteUrls: cloneDeep(siteUrls.value) })
  } else {
    message.warning('链接失效')
  }
  checking.value = false
}
async function handleSiteUrlsActive (item: SiteUrlsType) {
  item.active = !item.active
  await settingsDB.updateSetting({ siteUrls: cloneDeep(siteUrls.value) })
}
async function handleSiteUrlsEdit (item: SiteUrlsType) {
  siteItem.value = item
  siteUrlType.value = 'edit'
  siteUrl.value = item.url
  addEditSiteUrl.value = true
}
async function handleSiteUrlsCheck (item: SiteUrlsType) {
  if (checkAll.value) return false
  item.loading = true
  const flag = await checkApi(item.url)
  if (flag) {
    item.state = true
    message.success('链接可用')
  } else {
    item.state = false
    item.active = false
  }
  await settingsDB.updateSetting({ siteUrls: cloneDeep(siteUrls.value) })
  item.loading = false
}
async function handleSiteUrlsDelete (item: SiteUrlsType) {
  if (checkAll.value) return false
  for (let i = 0; i < siteUrls.value.length; i++) {
    if (siteUrls.value[i].url === item.url) {
      siteUrls.value.splice(i, 1)
      break
    }
  }
  await settingsDB.updateSetting({ siteUrls: cloneDeep(siteUrls.value) })
}

const siteList = ref([])
const columns: TableBaseColumn<Site>[] = [
  {
    title: 'Name',
    key: 'name',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'Group',
    key: 'group',
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: 'jiexi',
    key: 'jiexi',
    width: 60,
    render (row: Site) {
      return row.jiexi ? '有' : '无'
    }
  },
  {
    title: 'State',
    key: 'state',
    width: 100,
    render (row: Site) {
      return row.state ? '可用' : '失效'
    }
  },
  {
    title: 'Active',
    key: 'isActive',
    width: 100,
    render (row: Site) {
      return h(NSwitch, { defaultValue: row.isActive, onClick: () => handleActive(row) })
    }
  },
  {
    title: 'Operator',
    key: 'key',
    width: 300,
    render (row: Site) {
      return h('div', { style: { display: 'flex', alignItems: 'center' } }, [
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleTop(row) }, { default: () => 'Top' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleEdit(row) }, { default: () => 'Edit' }),
        h(NButton, { loading: handleBtnLoading(row.loading), style: { marginRight: '6px' }, size: 'small', onClick: () => handleCheck(row) }, { default: () => 'Check' }),
        h(NButton, { style: { marginRight: '6px' }, size: 'small', onClick: () => handleDelete(row) }, { default: () => 'Delete' })
      ])
    }
  }
]
const importOptions = ref([
  {
    label: 'Online JSON',
    key: 'online'
  },
  {
    label: 'Local JSON',
    key: 'local'
  }
])
const addEdit = ref(false)
const formRef = ref()
const site = reactive({
  type: 'add',
  id: 0,
  key: '',
  name: '',
  api: '',
  jiexi: '',
  jsonApi: '',
  isActive: false,
  group: '',
  state: true
})
const groupOptions = ref([])
const rules = ref({
  name: { required: true },
  key: { required: true },
  api: { required: true }
})
const checkAll = ref(false)
const onlineShow = ref(false)
const jsonUrl = ref('')
function getSitesGroup () {
  const list = cloneDeep(siteList.value)
  const groups = []
  const arr = uniqBy(list, 'group')
  for (const i of arr) {
    groups.push(i.group)
  }
  if (!groups.length) return false
  groupOptions.value = groups.map(item => ({
    label: item,
    value: item
  }))
}
async function handleAddSite () {
  if (checkAll.value) return false
  getSitesGroup()
  addEdit.value = true
  checking.value = false
  site.type = 'add'
  site.key = ''
  site.name = ''
  site.api = ''
  site.jiexi = ''
  site.jsonApi = ''
  site.isActive = true
  site.group = ''
}
function getId () {
  const list = sortBy(cloneDeep(siteList.value), 'id')
  const id = list[list.length - 1].id
  return id + 1
}
function handleEdit (item: Site) {
  if (checkAll.value) return false
  getSitesGroup()
  addEdit.value = true
  site.type = 'edit'
  site.id = item.id
  site.key = item.key
  site.name = item.name
  site.api = item.api
  site.jiexi = item.jiexi
  site.jsonApi = item.jsonApi
  site.isActive = item.isActive
  site.group = item.group
  site.state = item.state
}
function handleFormCancel () {
  addEdit.value = false
}
function handleFormConfirm () {
  checking.value = false
  formRef.value.validate(async (err: Promise<any>) => {
    if (!err) {
      checking.value = true
      const flag = await checkApi(site.api)
      if (flag) {
        addEdit.value = false
        checking.value = false
        const doc = {
          id: site.type === 'add' ? getId() : site.id,
          key: site.key,
          name: site.name,
          api: site.api,
          jiexi: site.jiexi,
          jsonApi: site.jsonApi,
          isActive: site.isActive,
          group: site.group,
          state: true
        }
        if (site.type === 'add') {
          await db.put<Site>('sites', doc)
          message.success('添加成功')
        } else {
          await db.update('sites', site.id, doc)
          message.success('编辑成功')
        }
        await getSites()
      } else {
        checking.value = false
        message.success('接口验证不通过')
      }
    }
  })
}
async function handleActive (item: Site) {
  item.isActive = !item.isActive
  await db.update('sites', item.id, item)
  bus.emit('bus.sites.change')
}
function handleTop (item: Site) {
  if (checkAll.value) return false
  const id = item.id
  const list = cloneDeep(siteList.value)
  list.map(li => {
    if (li.id === 0) li.id = id
    if (li.name === item.name) li.id = 0
  })
  const newList = sortBy(cloneDeep(list), 'id')
  siteList.value = newList
  db.clear('sites').then(async () => {
    await db.bulkAdd('sites', newList)
    bus.emit('bus.sites.change')
  })
}
function handleBtnLoading (flag: boolean) {
  if (flag) return true
  return false
}
async function handleCheck (item: Site) {
  if (checkAll.value) return false
  item.loading = true
  const flag = await checkApi(item.api)
  if (flag) {
    item.state = true
    message.success('接口可用')
  } else {
    item.state = false
    item.isActive = false
  }
  await db.update('sites', item.id, item)
  item.loading = false
  getSites()
}
async function handleDelete (item: Site) {
  if (checkAll.value) return false
  await db.delete('sites', item.id)
  await getSites()
  message.success('删除成功')
}
async function getSites () {
  const res = await db.all('sites')
  const list = sortBy(res, 'id')
  list.forEach(item => { item.loading = false })
  siteList.value = list
}
async function handleExport () {
  if (checkAll.value) return false
  window.ipc.invoke(IpcDirective.WIN_SAVE_DIALOG, { data: JSON.stringify(siteList.value, null, 4) })
  window.ipc.once(IpcDirective.WIN_DIALOG_REPLAY, (e, args) => {
    if (args) {
      message.success('导出成功')
    } else {
      message.warning('导出失败，请重试')
    }
  })
}
async function handleImportSelect (key: string | number) {
  if (key === 'local') {
    window.ipc.invoke(IpcDirective.IMPORT_JSON)
    window.ipc.once(IpcDirective.IMPORT_JSON_REPLAY, async (e, args) => {
      await mergeSites(args)
    })
  } else if (key === 'online') {
    onlineShow.value = true
    checking.value = false
  }
}
async function handleJsonCancel () {
  onlineShow.value = false
  checking.value = false
}
async function handleJsonConfirm () {
  if (!jsonUrl.value.trim()) {
    return message.warning('请输入链接')
  }
  checking.value = true
  const res = await getOnlineJSON(jsonUrl.value)
  if (res) {
    try {
      const json = JSON.parse(res)
      await mergeSites(json)
      onlineShow.value = false
    } catch (_) {
      message.warning('导入失败')
    }
  } else {
    message.warning('导入失败')
  }
  checking.value = false
}
async function mergeSites (list: Site[]) {
  if (!list.length) return message.warning('数据为空，导入失败')
  const oList = siteList.value
  for (const i of list) {
    const flag = oList.findIndex(item => item.api === i.api)
    if (flag < 0) {
      const d = { key: i.key, name: i.name, api: i.api, jiexi: i.jiexi, jsonApi: i.jsonApi, isActive: i.isActive, group: i.group, state: i.state }
      await db.put<Site>('sites', d)
    }
  }
  await getSites()
  message.success('导入完毕')
  bus.emit('bus.sites.change')
}

async function handleCheckAll () {
  checkAll.value = true
  if (toggle.value) {
    await Promise.all(siteUrls.value.map(async item => {
      item.loading = true
      const flag = await checkApi(item.url)
      item.state = flag
      item.loading = false
      await settingsDB.updateSetting({ siteUrls: cloneDeep(siteUrls.value) })
    }))
  } else {
    await Promise.all(siteList.value.map(async site => {
      site.loading = true
      const flag = await checkApi(site.api)
      site.state = flag
      await db.update('sites', site.id, site)
      site.loading = false
    }))
  }
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
    justify-content: space-between;
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
