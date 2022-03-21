import Dexie from 'dexie'
import { initSettings } from './default'
import { Favorite } from '../models/Favorite'
import { getStores } from '../../decorator'
import { History } from '../models/History'
import { Movie } from '../models/Movie'
import { IpTv } from '../models/IpTv'
import { Site } from '../models/Site'
import { Setting } from '../models/Setting'
const dbStores = {
  favorites: getStores(Favorite),
  history: getStores(History),
  movies: getStores(Movie),
  iptv: getStores(IpTv),
  sites: getStores(Site),
  settings: getStores(Setting)
}
export type TableSetKey = keyof typeof dbStores
export class Database extends Dexie {
  static db:Database
  constructor () {
    super('Database')
    this.version(1).stores(dbStores)
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
