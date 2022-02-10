import { $fetch } from 'ohmyfetch'
import type { FetchOptions } from 'ohmyfetch'
const myFetch = $fetch.create({
  retry: 2,
  // do something before request
  async onRequest (e) {
    console.log(e)
  },
  // do something when request fails
  async onRequestError ({ error }) {
    console.log('[fetch error]', error)
    // TODO:add error tips
  },
  // do something after response
  async onResponse (e) {
    console.log(e)
  },
  async onResponseError ({ error }) {
    console.log(error)
  }
})
export function apiFetch (url:string, opts?:FetchOptions<'json'>) {
  if (!url) return Promise.resolve()
  // default return response._data
  return myFetch(url, opts)
}
