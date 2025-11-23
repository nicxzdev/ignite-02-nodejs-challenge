import { Knex } from 'knex'

declare module 'knex/types/tables' {
    interface Tables {
        users: {
            id: string
            sessionId: string
            name: string
            email: string
            createdAt: string
        },
        meals: {
            id: string
            userId: string
            name: string
            description: string
            onDiet: boolean
            date: Date
            createdAt: string
        }
    }
}