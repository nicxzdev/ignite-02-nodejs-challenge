import { z } from 'zod'
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
    config({
        path: '.env.test'
    })
} else {
    config()
}


const envSchema = z.object({
    NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
    console.log(`Error => `, _env.error.format())
    throw new Error('Invalid environment variable.')
}

export const env = _env.data