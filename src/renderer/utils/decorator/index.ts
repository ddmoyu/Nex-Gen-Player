
import 'reflect-metadata'
type Constructor<T = any> = new (...args: any[]) => T;
const STORES_METADATA = 'stores'
// is not Decorator just use getStores metaData
export function getStores (constructor:Constructor) {
  return Reflect.getMetadata(STORES_METADATA, constructor)
}

export function SetStores (stores:string) {
  return (constructor:Constructor) => {
    Reflect.defineMetadata(STORES_METADATA, stores, constructor)
  }
}
// catch fn Error
export function CatchError (msg:string) {
  return function (target:any, key:string, descriptor: PropertyDescriptor) {
    console.log(descriptor)
    console.log(target)
    const fn = descriptor.value
    descriptor.value = async function (...args:any[]) {
      try {
        return await fn.apply(this, args)
      } catch (error) {
        // window.$message.error(msg)
        console.log(error)
      }
    }
  }
}
