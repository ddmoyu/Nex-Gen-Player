<template>
  <n-card
    style="width: 400px"
    title="注册"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <n-form
      ref="formRef"
      :label-width="80"
      :model="formValue"
      :rules="rules"
    >
      <n-form-item label="姓名" path="username">
        <n-input v-model:value="formValue.username" placeholder="输入用户名" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input
          v-model:value="formValue.password"
          type="password"
          show-password-on="click"
          placeholder="自定义密码图标"
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
      <n-form-item label="邮箱" path="email">
        <n-input v-model:value="formValue.email" placeholder="邮箱" />
      </n-form-item>
      <n-form-item label="验证码" path="vCode">
        <n-input v-model:value="formValue.vCode" placeholder="验证码" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="handleValidateClick">
          验证
        </n-button>
      </n-form-item>
    </n-form>
  </n-card>
</template>
<script lang="ts" setup>
import type { NForm } from 'naive-ui'
import { GlassesOutline, Glasses } from '@vicons/ionicons5'
import { RegisterType } from '../api/types/user.type'
const formRef = ref<InstanceType<typeof NForm>>()
const rules = reactive({
  username: {
    required: true,
    message: '请输入用户名',
    trigger: ['input']
  },
  password: {
    required: true,
    message: '请输入用户名',
    trigger: ['input']
  },
  email: {
    required: true,
    message: '请输入用户名',
    trigger: ['input']
  },
  vCode: {
    required: true,
    message: '请输入用户名',
    trigger: ['input']
  }
})
const formValue = reactive<RegisterType>({
  username: '',
  password: '',
  email: '',
  vCode: ''
})
function handleValidateClick () {
  //
}
</script>

<style lang="scss" scoped></style>
