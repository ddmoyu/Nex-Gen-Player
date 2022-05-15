<template>
  <n-card
    style="width: 400px"
    title="注册"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
      <n-form-item label="用户名" path="user.name">
        <n-input v-model:value="formValue.username" placeholder="输入用户名" />
      </n-form-item>
      <n-form-item label="密码" path="user.age">
        <n-input
          v-model:value="formValue.password"
          type="password"
          show-password-on="click"
          placeholder="输入密码"
          :maxlength="8"
        >
          <template #password-visible-icon>
            <n-icon :size="16" :component="GlassesOutline" />
          </template>
          <template #password-invisible-icon>
            <n-icon :size="16" :component="Glasses" />
          </template>
        </n-input>
      </n-form-item>
      <n-form-item label="邮箱" path="phone">
        <n-input v-model:value="formValue.email" placeholder="输入邮箱" />
        <n-button
          class="v-btn"
          type="primary"
          :loading="isLoading"
          :disabled="isSend"
          @click="validateEmail"
        >
          {{ isSend ? countDown : '验证' }}
        </n-button>
      </n-form-item>
      <div :class="['v-code',{'v-code-active':isSend}]">
        <n-form-item label="验证码" path="phone">
          <n-input v-model:value="formValue.vCode" placeholder="输入验证码" />
        </n-form-item>
      </div>
      <n-form-item>
        <n-button attr-type="button" @click="handleValidateClick">
          验证
        </n-button>
      </n-form-item>
    </n-form>
  </n-card>
</template>
<script lang="ts" setup>
import { NForm, useMessage } from 'naive-ui'
import { GlassesOutline, Glasses } from '@vicons/ionicons5'
import { getVCodeApi } from '../api/user'
import { Code } from '../enum/code.enum'
import type { RegisterType } from '../api/types/user.type'

const message = useMessage()
const formRef = ref<InstanceType<typeof NForm>>()
const rules = reactive({
  username: {
    required: true,
    message: '请输入用户名',
    trigger: ['input']
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input']
  },
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: ['input']
  },
  vCode: {
    required: true,
    message: '请输入验证码',
    trigger: ['input']
  }
})
const formValue = reactive<RegisterType>({
  username: '',
  password: '',
  email: '',
  vCode: ''
})

const isSend = ref(false)
const isLoading = ref(false)
const countDown = ref(300)
const startCountDown = () => {
  if (countDown.value === 0) {
    isSend.value = false
    countDown.value = 300
    return
  }
  setTimeout(() => {
    countDown.value -= 1
    startCountDown()
  }, 1000)
}
async function validateEmail () {
  isLoading.value = true
  const res = await getVCodeApi(formValue.email)
  isLoading.value = false
  if (res.code === Code.SUCCESS) {
    message.success('发送成功')
    isSend.value = true
    startCountDown()
  }
}

function handleValidateClick () {
  formRef.value.validate((err) => {
    if (!err) {

    } else {
      console.log(err)
    }
  })
  //
}
</script>

<style lang="scss" scoped>
.v-btn {
  margin-left: 5px;
}
.v-code{
  height: 0px;
  overflow: hidden;
  transition: all 0.7s ease;
}
.v-code-active{
  height: 100%;
}
</style>
