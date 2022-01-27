import { Database, tableSet } from '../init/Database'

export class DBTools {
  private db:Database
  constructor () {
    this.db = Database.getDB()
  }

  put<T> (tableName:typeof tableSet[number], model:T) {
    this.db.table(tableName).put(model)
  }
}

export const db = new DBTools()
