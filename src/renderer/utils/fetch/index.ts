import { $fetch } from 'ohmyfetch'
import type { FetchOptions } from 'ohmyfetch'
const apiFetch = $fetch.create({
  retry: 2,
  async onRequest (e) {
    console.log(e)
  }
})
export function api (url:string, opts?:FetchOptions<'json'>) {
  return apiFetch(url, opts)
}
