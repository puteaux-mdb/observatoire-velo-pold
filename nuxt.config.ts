import config from './config.json';

const TITLE = `${config.siteName} - Suivi des ${config.revName.plural}`;
const DESCRIPTION = `Plateforme citoyenne et associative${config.assoName ? `, par ${config.assoName}` : ''}. État d'avancement, cartes interactives des itinéraires, détails, travaux : suivez le développement du réseau cyclable ${config.territory.adjective}.`;
const BASE_URL = config.baseUrl;
const COVER_IMAGE_URL = config.coverImageUrl;

export default defineNuxtConfig({
  srcDir: '.',
  css: ['~/assets/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: TITLE,
      // favicon : logo du Collectif Vélo POLD dans un rond
      link: [
        { rel: 'icon', href: `${process.env.NUXT_APP_BASE_URL ?? '/'}favicon.ico`, sizes: 'any' },
        { rel: 'icon', type: 'image/png', href: `${process.env.NUXT_APP_BASE_URL ?? '/'}favicon-32.png`, sizes: '32x32' },
        { rel: 'apple-touch-icon', href: `${process.env.NUXT_APP_BASE_URL ?? '/'}apple-touch-icon.png` },
      ],
      meta: [
        { hid: 'description', name: 'description', content: DESCRIPTION },
        // facebook
        { property: 'og:site_name', content: TITLE },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:url', property: 'og:url', content: BASE_URL },
        { hid: 'og:title', property: 'og:title', content: TITLE },
        {
          hid: 'og:description',
          property: 'og:description',
          content: DESCRIPTION,
        },
        { hid: 'og:image', property: 'og:image', content: COVER_IMAGE_URL },
        { property: 'og:image:width', content: '640' },
        { property: 'og:image:height', content: '476' },
        // twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { hid: 'twitter:url', name: 'twitter:url', content: BASE_URL },
        { hid: 'twitter:title', name: 'twitter:title', content: TITLE },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: DESCRIPTION,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: COVER_IMAGE_URL },
      ],
    },
  },

  runtimeConfig: {
    public: {
      maptilerKey: process.env.MAPTILER_KEY,
      counterStatsApiUrl: '',
    },
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@nuxt/icon', '@nuxt/eslint', 'nuxt-umami'],

  content: {
    markdown: {
      tags: { h1: 'h1', h5: 'h5', h6: 'h6' },
    },
  },

  icon: {
    customCollections: [
      {
        prefix: 'cyclopolis',
        dir: './assets/icons',
      },
    ],
  },

  tailwindcss: { viewer: false },

  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/data/map-counters.json'],
      ignore: ['/carte-interactive?'],
    },
  },

  build: {
    transpile: ['@headlessui/vue'],
  },

  vite: {
    optimizeDeps: {
      include: ['highcharts-vue', '@vueuse/core'],
      exclude: ['@panoramax/web-viewer'],
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.includes('pnx-'),
    },
  },

  compatibilityDate: '2024-08-11',

  // Statistiques de visite : renseigner l'id et l'hôte de votre instance Umami, puis passer enabled à true
  umami: {
    id: process.env.UMAMI_ID ?? '',
    host: process.env.UMAMI_HOST ?? '',
    autoTrack: true,
    ignoreLocalhost: true,
    excludeQueryParams: true,
    enabled: Boolean(process.env.UMAMI_ID),
    logErrors: true,
  },
});
