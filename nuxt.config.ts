import { defineNuxtConfig } from "nuxt/config"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', "@uploadthing/nuxt"],
  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false
  },
  uploadthing: {
    /**
     * Path to your router definition file
     * @default `~/server/uploadthing.ts`
     */
    routerPath: "",
  },
  runtimeConfig: {
    public: {
      adminPassword: process.env.ADMIN_PASSWORD || 'admin123'
    }
  }
})
