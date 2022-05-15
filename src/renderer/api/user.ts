import { $http } from './request'
import { LoginType, RegisterType } from './types/user.type'

enum UserApi {
  LOGIN = 'login',
  GET_V_CODE = 'validateEmail'
}

export function getVCode (email:string) {
  return $http(UserApi.GET_V_CODE, { params: { email } })
}

export function registerAPi (params:RegisterType) {
//
}
export function loginApi (params:LoginType) {
//
}
