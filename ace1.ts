import 'reflect-metadata'
import { Ignitor } from '@adonisjs/core'

async function run() {
  console.log('Starting Ace CLI...')
  await new Ignitor(new URL(import.meta.url)).ace()
  console.log('Ace CLI finished.')
}

run().catch(console.error)
