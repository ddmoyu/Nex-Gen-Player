import { CatchError } from '../../decorator'
import { Database, TableSetKey } from '../init/Database'
export class DBTools {
  protected db:Database
  constructor () {
    this.db = Database.getDB()
  }

  async get<T> (tableName: TableSetKey, model: T) {
    return await this.db.table(tableName).get(model)
  }

  async all (tableName: TableSetKey) {
    return await this.db.table(tableName).toArray()
  }

  @CatchError('添加失败')
  async put<T> (tableName:TableSetKey, model:Omit<T, 'id'>) {
    return await this.db.table(tableName).put(model)
  }

  async bulkAdd<T> (tableName: TableSetKey, model: T[]) {
    return await this.db.table(tableName).bulkAdd(model)
  }

  async update<T> (tableName: TableSetKey, id: string, params: Partial<T>) {
    return await this.db.table(tableName).update(id, params)
  }

  async delete (tableName: TableSetKey, id: string) {
    return await this.db.table(tableName).delete(id)
  }
}

export const db = new DBTools()
