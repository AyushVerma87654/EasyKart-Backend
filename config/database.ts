import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname } from 'node:path'

const currentFileUrl = import.meta.url // ✅ This is a `file://` URL
const __dirname = dirname(fileURLToPath(currentFileUrl)) // Local file path
const __dirurl = pathToFileURL(__dirname + '/') // ✅ Convert back to URL for safe usage

const dbConfig = defineConfig({
  connection: 'postgres',
  connections: {
    postgres: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),
        ssl: {
          rejectUnauthorized: false,
        },
      },
      migrations: {
        naturalSort: true,
        // ✅ Use `new URL(...)` to pass a proper file URL
        paths: [new URL('../database/migrations', __dirurl).pathname],
      },
    },
  },
})

export default dbConfig
