// https://nuxt.com/docs/api/configuration/nuxt-config

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
})