import Dexie from 'dexie'
import { Setting } from '../models/Setting'
import { DBTools } from './DBTools'

class SettingsDB extends DBTools {
  table:Dexie.Table<Setting, number>
  constructor () {
    super()
    this.table = this.db.table('settings')
  }

  init () {
    this.table.put(new Setting())
  }

  async getSetting (key?:keyof Setting) {
    const s = await this.table.get({ id: 0 }) || {} as Setting
    return key ? s[key] : s
  }

  updateSetting (params:Partial<Setting>) {
    console.log(params)
    return this.table.update(0, params)
  }
}
export const settingsDB = new SettingsDB()
