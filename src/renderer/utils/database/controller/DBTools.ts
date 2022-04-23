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

  async all<T = any> (tableName: TableSetKey) {
    return await this.db.table<T>(tableName).toArray()
  }

  async find<T> (tableName: TableSetKey, uniCheck: Partial<T>) {
    const res = await this.db.table(tableName).where(uniCheck).first()
    if (res) return res
    return false
  }

  @CatchError('添加失败')
  async put<T> (tableName:TableSetKey, model:Omit<T, 'id'>, uniCheck?:Partial<T>) {
    if (uniCheck) {
      const res = await this.db.table(tableName).where(uniCheck).first()
      if (res) return false
    }
    return await this.db.table(tableName).put(model)
  }

  async bulkAdd<T> (tableName: TableSetKey, model: T[]) {
    return await this.db.table(tableName).bulkAdd(model)
  }

  async update<T> (tableName: TableSetKey, id: number, params: Partial<T>) {
    return await this.db.table(tableName).update(id, params)
  }

  async delete (tableName: TableSetKey, id: number) {
    return await this.db.table(tableName).delete(id)
  }

  async reset () {
    return await this.db.delete()
  }
}

export const db = new DBTools()
