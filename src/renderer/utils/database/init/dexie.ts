import Dexie from 'dexie'
import type { Favorites, History } from '@/typings/database'

export class Database extends Dexie {
  favorits: Dexie.Table<Favorites, number>
  history: Dexie.Table<History, number>

  constructor () {
    super('Database')

    this.version(1).stores({
      favorits: 'id++, site, ids, name, index, hasUpdate, detail',
      history: 'id++, site, ids, name, type, year, index, time, detail'
    })

    this.favorits = this.table('favorits')
    this.history = this.table('history')
  }
}

const db = new Database()
db.open()

// db.on('populate', () => {})

export default db
