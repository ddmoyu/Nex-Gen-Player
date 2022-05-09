import { $fetch } from 'ohmyfetch'
import type { FetchOptions } from 'ohmyfetch'
const apiFetch = $fetch.create({
  retry: 1
})
export function api (url:string, opts?:FetchOptions<'json'>) {
  return apiFetch(url, opts)
}
