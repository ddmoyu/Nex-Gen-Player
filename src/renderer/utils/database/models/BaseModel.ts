import { tableSet } from '../init/Database'

export class BaseModel {
  static stores:string
  constructor (public tableName: typeof tableSet[number]) {
    this.tableName = tableName
  }
}
