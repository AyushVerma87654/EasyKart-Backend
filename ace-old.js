/*
|--------------------------------------------------------------------------
| JavaScript entrypoint for running ace commands
|--------------------------------------------------------------------------
|
| DO NOT MODIFY THIS FILE AS IT WILL BE OVERRIDDEN DURING THE BUILD
| PROCESS.
|
| See docs.adonisjs.com/guides/typescript-build-process#creating-production-build
|
| Since, we cannot run TypeScript source code using "node" binary, we need
| a JavaScript entrypoint to run ace commands.
|
| This file registers the "ts-node/esm" hook with the Node.js module system
| and then imports the "bin/console.ts" file.
|
*/

/**
 * Register hook to process TypeScript files using ts-node
 */
import 'reflect-metadata'
import { Ignitor } from '@adonisjs/core'

console.log('Starting Ace CLI...')

const run = async () => {
  try {
    await new Ignitor(import.meta.url).ace()
    console.log('Ace CLI finished successfully.')
  } catch (error) {
    console.error('Ace CLI failed:', error)
    process.exit(1)
  }
}

run()
