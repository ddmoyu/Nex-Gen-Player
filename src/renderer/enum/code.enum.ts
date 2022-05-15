export const enum Code {
  SUCCESS = 0,
  /** 用户或密码不正确 */
  USER_OR_PASSWORD_ERR = -1001,
  /** 用户不合法 */
  USER_ERROR = -1002,
  /** token失效 */
  TOKEN_EXP = -1003,
  /** token不合法 */
  TOKEN_ERROR = -1004,
  /** 值重复 */
  SAME_VALUE = -1024,
  /** 值不存在 */
  VALUE_NOT_EXITS = -1025,
  /** 验证码未过期 */
  V_CODE_IS_EXISTS = -1026,
  /** 邮件发送失败 */
  EMAIL_SEND_ERROR = -1027,
  /** 暂无权限 */
  UN_JURISDICTION = -9998,
  /** 参数不合法 */
  PARAM_ERROR = -9999,
}

export const codeMsg = {
  [-1001]: '用户或密码不正确',
  [-1002]: '用户不合法',
  [-1003]: '登录以失效,请重新登录',
  [-1004]: 'token不合法',
  [-1024]: '存在相同的值,请更改',
  [-1025]: '值不存在',
  [-1026]: '验证码未过期',
  [-1027]: '邮件发送失败',
  [-1030]: '请选择工序',
  [-9998]: '暂无操作权限',
  [-9999]: '参数不合法,请检查参数'
}
