
import 'reflect-metadata'
type Constructor<T = any> = new (...args: any[]) => T;
const STORES_METADATA = 'stores'
// export function Init<T = any> (val: T) {
//   return (target: any, key: string) => {
//     const data = Reflect.getMetadata(PARAM_METADATA, target.constructor) || []
//     data.push([key, val])
//     Reflect.defineMetadata(PARAM_METADATA, data, target.constructor)
//   }
// }
export function SetStores (stores:string) {
  return (constructor:Constructor) => {
    Reflect.defineMetadata(STORES_METADATA, stores, constructor)
  }
}

export function getStores (constructor:Constructor) {
  return Reflect.getMetadata(STORES_METADATA, constructor)
}
