import { $fetch } from 'ohmyfetch'
import type { FetchOptions } from 'ohmyfetch'
import { BaseType } from './types/base.type'
const request = $fetch.create({
  retry: 1,
  baseURL: process.env.VUE_APP_BASEURL,
  // async onRequestError (err) {},
  onResponseError (res) {
    const { message } = res.response._data
    window.$message.error(message)
    return Promise.resolve(res.response._data)
  }
})

export function $http<T> (url:string, options:FetchOptions) {
  return new Promise<BaseType<T>>((resolve) => {
    request(url, options).then(res => {
      resolve(res)
    }).catch(err => {
      resolve(err.response._data)
    })
  })
}
