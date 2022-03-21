import Dexie from 'dexie'
import { Setting } from '../models/Setting'
import { DBTools } from './DBTools'

class SettingsDB extends DBTools {
  table: Dexie.Table<Setting, number>
  constructor () {
    super()
    this.table = this.db.table('settings')
  }

  init () {
    this.table.put(new Setting())
  }

  getSetting<T extends keyof Setting>(key: T):Promise<Setting[T]>
  getSetting():Promise<Setting>
  async getSetting (key?: string) {
    const setting = await this.table.get({ id: 0 }) || {} as Setting
    return key ? setting[key] : setting
  }

  updateSetting (params: Partial<Setting>) {
    return this.table.update(0, params)
  }
}
export const settingsDB = new SettingsDB()
