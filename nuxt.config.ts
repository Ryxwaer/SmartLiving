import { randomBytes } from 'crypto';

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", 'nuxt-auth-utils'],

  css: [
    '@/assets/css/global.css',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/input.css'
  },

  plugins: ['~/plugins/jquery.client.js'],
  compatibilityDate: '2024-08-27',
  runtimeConfig: {
    session: {
      name: "nuxt-session",
      password: process.env.NUXT_SESSION_PASSWORD || randomBytes(32).toString('hex'),
      maxAge: 60 * 60 * 24 * 30, // 1 month in seconds
    }
  },
})