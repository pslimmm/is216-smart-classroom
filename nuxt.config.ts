// https://nuxt.com/docs/api/configuration/nuxt-config
import type { NuxtPage } from 'nuxt/schema';
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    ssr: false,
    css: ['~/assets/css/main.css'],

    //241025 added section start
    runtimeConfig: {

        groqApiKey: process.env.GROQ_API_KEY,
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

        public: {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_KEY
        }
    },
    //241025 added section end

    app: {
        head: {
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            ],
            link: [
                { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css' },
            ],
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
    },
    nitro: {
        routeRules: {
            '/api/**': {
                cors: true,
                headers: {
                    'Access-Control-Allow-Origin': 'https://localhost:3000',
                    'Access-Control-Allow-Methods': 'GET,POST',
                    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
                }
            }
        }
    }
})
