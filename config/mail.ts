import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',

  /**
   * A static address for the "from" property. It will be
   * used unless an explicit from address is set on the
   * Email
   */
  from: {
    address: env.get('USER_EMAIL'), // Replace with your from email
    name: env.get('USER_NAME'), // Replace with your from name
  },

  /**
   * A static address for the "reply-to" property. It will be
   * used unless an explicit replyTo address is set on the
   * Email
   */
  replyTo: {
    address: '', // Optional: Replace with your reply-to email
    name: '', // Optional: Replace with your reply-to name
  },

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or the same transport with a different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST'), // e.g., smtp.gmail.com
      port: env.get('SMTP_PORT'), // e.g., 587 for TLS
      auth: {
        type: 'login',
        user: env.get('USER_EMAIL'), // Your email address
        pass: env.get('PASSWORD'), // Your email password or App Password
      },
      secure: true, // Set to true if using port 465
    }),
  },
})

export default mailConfig
