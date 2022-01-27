import Dexie from 'dexie'
import type {
  Favorites,
  Iptv,
  Movies,
  Settings
} from '@/typings/database'
import { initSettings } from './default'
import { History, HistoryStores } from '../models/History'

export const tableSet = ['favorits', 'history', 'movies', 'iptv', 'settings'] as const
export class Database extends Dexie {
  static db:Database
  constructor () {
    super('Database')

    this.version(1).stores({
      favorits: 'id++, site, ids, name, index, update, detail',
      history: HistoryStores,
      movies: 'id++, key, logo, name, api, description, download, active, group',
      iptv: 'id++, name, url, active, group',
      settings: 'id, view, windows, play, theme, language, shortcut, search, player, downlaoder, exclude, proxy, password'
    })
  }

  static getDB () {
    if (Database.db) {
      return Database.db
    } else {
      const db = Database.db = new Database()
      db.open()
      db.on('populate', () => {
        db.table('settings').bulkAdd(initSettings)
      })
      return db
    }
  }
}
