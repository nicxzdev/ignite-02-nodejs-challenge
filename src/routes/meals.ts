import { FastifyInstance } from "fastify"
import { knex } from "../database"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"
import z from "zod"

export async function mealsRoute(app: FastifyInstance) {
    app.post('/', {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        const registerMealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            onDiet: z.boolean(),
            date: z.coerce.date()
        })

        const { name, description, onDiet, date } = registerMealBodySchema.parse(request.body)

        await knex('meals').insert({
            id: randomUUID(),
            userId: request.user?.id,
            name,
            description,
            onDiet,
            date,
        })

        return reply.status(201).send()
    })

    app.get('/', {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        const meals = await knex('meals').where('userId', request.user?.id)

        return reply.status(200).send(meals)
    })

    app.get('/:id', {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        const getMealParamSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getMealParamSchema.parse(request.params)

        const meal = await knex('meals')
            .where('userId', request.user?.id)
            .andWhere('id', id)
            .first()

        if (!meal) {
            return reply.status(404).send({
                error: "Not found."
            })
        }

        return reply.status(200).send(meal)
    })

    app.patch('/', {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        const editMealBodySchema = z.object({
            id: z.string().uuid(),
            name: z.string(),
            description: z.string(),
            onDiet: z.boolean(),
            date: z.coerce.date()
        })

        const { id, name, description, onDiet, date } = editMealBodySchema.parse(request.body)

        const meal = await knex('meals')
            .where('userId', request.user?.id)
            .andWhere('id', id)
            .first()

        if (!meal) {
            return reply.status(404).send({
                error: "Not found."
            })
        }

        await knex('meals')
            .update({
                name,
                description,
                onDiet,
                date
            })
            .where('id', id)

        return reply.status(200).send()
    })

    app.delete('/:id', {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        const getMealParamSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getMealParamSchema.parse(request.params)

        const meal = await knex('meals')
            .where('userId', request.user?.id)
            .andWhere('id', id)
            .first()

        if (!meal) {
            return reply.status(404).send({
                error: "Not found."
            })
        }

        await knex('meals')
            .delete()
            .where('id', id)

        return reply.status(200).send()
    })

    app.get('/metrics', {
        preHandler: [checkSessionIdExists]
    }, async (request, reply) => {
        const recordedMeals = await knex('meals')
            .where('userId', request.user?.id)
            .count({ count: '*' })
            .first()

        const recordedMealsOnDiet = await knex('meals')
            .where('onDiet', true)
            .andWhere('userId', request.user?.id)
            .count({ count: '*' })
            .first()

        const recordedMealsOutOffDiet = await knex('meals')
            .where('onDiet', false)
            .andWhere('userId', request.user?.id)
            .count({ count: '*' })
            .first()

        const meals = await knex('meals')
            .andWhere('userId', request.user?.id)
            .orderBy('date', 'asc')

        let bestSequence = 0
        let currentSequence = 0

        meals.map((meal) => {
            if (meal.onDiet) {
                currentSequence++
                if (currentSequence > bestSequence) {
                    bestSequence = currentSequence
                }
            } else {
                currentSequence = 0
            }
        })

        return reply.status(200).send({
            recordedMeals: recordedMeals?.count,
            recordedMealsOnDiet: recordedMealsOnDiet?.count,
            recordedMealsOutOffDiet: recordedMealsOutOffDiet?.count,
            bestSequence,
        })
    })
}