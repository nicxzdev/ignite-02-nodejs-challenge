import { FastifyInstance, FastifyRequest } from "fastify"
import z from "zod"
import { knex } from "../database"
import { randomUUID } from "node:crypto"

export async function usersRoute(app: FastifyInstance) {
    app.post('/', async (request: FastifyRequest, reply) => {
        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string().email()
        })

        const { name, email } = createUserBodySchema.parse(request.body)

        const userWithThisEmailAlreadyExists = await knex('users').where('email', email).first()

        if (userWithThisEmailAlreadyExists) {
            return reply.status(409).send({
                error: 'Conflict',
                message: 'User with this e-mail is already registered.'
            })
        }

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()
            reply.setCookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            sessionId
        })

        return reply.status(201).send()
    })
}

