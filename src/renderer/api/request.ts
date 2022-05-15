import { $fetch } from 'ohmyfetch'
import type { FetchOptions } from 'ohmyfetch'

const request = $fetch.create({
  retry: 1,
  baseURL: import.meta.env.VITE_BASEURL,
  async onRequestError (err) {
    console.log(err)
  },
  async onResponseError (response) {
    console.log(response)
  }
})

export function $http (url:string, options:FetchOptions) {
  return request(url, options)
}
