import { Database, tableSet } from '../init/Database'
type TableSetKey = typeof tableSet[number]
export class DBTools {
  private db:Database
  constructor () {
    this.db = Database.getDB()
  }

  put<T> (tableName:TableSetKey, model:T) {
    this.db.table(tableName).put(model)
  }
}

export const db = new DBTools()
