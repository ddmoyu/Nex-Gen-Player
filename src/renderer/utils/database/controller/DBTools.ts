import { Database, tableSet } from '../init/Database'
type TableSetKey = typeof tableSet[number]
export class DBTools {
  protected db:Database
  constructor () {
    this.db = Database.getDB()
  }

  put<T> (tableName:TableSetKey, model:T) {
    this.db.table(tableName).put(model)
  }

  update<T> (tableName:TableSetKey, id:string, params:Partial<T>) {
    this.db.table(tableName).update(id, params)
  }
}

export const db = new DBTools()
