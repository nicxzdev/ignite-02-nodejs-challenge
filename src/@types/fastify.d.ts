import 'fastify'

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            id: string
            sessionId: string
            name: string
            email: string
            createdAt: string
        } | undefined
    }
}