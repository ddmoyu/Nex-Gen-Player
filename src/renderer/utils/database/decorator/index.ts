
import 'reflect-metadata'
type Constructor<T = any> = new (...args: any[]) => T;
const PARAM_METADATA = 'param'
export function Init<T = any> (val: T) {
  return (target: any, key: string) => {
    const data = Reflect.getMetadata(PARAM_METADATA, target.constructor) || []
    data.push([key, val])
    Reflect.defineMetadata(PARAM_METADATA, data, target.constructor)
  }
}
export function InitAble (constructor:Constructor) {
  const data = Reflect.getMetadata(PARAM_METADATA, constructor) as [string, any][]
  data.forEach((item: [string, any]) => {
    constructor.prototype[item[0]] = item[1]
  })
}
