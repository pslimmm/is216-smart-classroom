// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema';
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    ssr: false,
    css: ['~/assets/css/main.css'],
    app: {
        head: {
            link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' }],
        },
    },
    hooks: {
        'pages:extend'(pages) {
            function setMiddleware(pages: NuxtPage[]) {
                for (const page of pages) {
                    page.meta ||= {}
                    page.meta.middleware = ['role']
                    if (page.children) {
                        setMiddleware(page.children)
                    }
                }
            }
            setMiddleware(pages)
        },
    }
})
