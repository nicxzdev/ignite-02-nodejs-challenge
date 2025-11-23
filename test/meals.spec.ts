import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'
import { knex } from '../src/database'
import request from 'supertest'

describe('Meals Tests', () => {
    beforeAll(async () => {
        await app.ready()
    })

    beforeEach(() => {
        execSync("npm run knex -- migrate:latest")
    })

    afterAll(async () => {
        await app.close()
    })

    afterEach(() => {
        execSync("npm run knex -- migrate:rollback --all")
    })

    it('should not be able to access meal routes without a sessionId', async () => {
        await request(app.server)
            .get('/meals')
            .expect(401)
    })

    it('should be able to register a meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(201)

        const cookies = createUserResponse.get('Set-Cookie')!

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Jantar",
                description: "Food description",
                onDiet: false,
                date: "2025-10-10 12:00:00"
            })
            .expect(201)
    })

    it('should be able to list user meals', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(201)

        const cookies = createUserResponse.get('Set-Cookie')!

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Jantar",
                description: "Food description",
                onDiet: false,
                date: "2025-10-10 12:00:00"
            })

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Almoço",
                description: "Food description",
                onDiet: false,
                date: "2025-10-10 12:00:00"
            })

        const listResponse = await request(app.server)
            .get('/meals')
            .set('Cookie', cookies)

        expect(listResponse.body).toEqual([
            expect.objectContaining({
                name: "Jantar"
            }),
            expect.objectContaining({
                name: "Almoço"
            })
        ])
        expect(listResponse.body).toHaveLength(2)
    })

    it('should be able to get a specific user meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(201)

        const cookies = createUserResponse.get('Set-Cookie')!

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Almoço",
                description: "Food description",
                onDiet: false,
                date: "2025-10-10 12:00:00"
            })

        const mealId = await knex('meals').select('id').first()

        const getMealResponse = await request(app.server)
            .get(`/meals/${mealId?.id}`)
            .set('Cookie', cookies)

        expect(getMealResponse.body).toEqual(expect.objectContaining({
            name: "Almoço"
        }))
    })

    it('should be able to edit a meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(201)

        const cookies = createUserResponse.get('Set-Cookie')!

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Meal",
                description: "Food description",
                onDiet: false,
                date: "2025-10-10 12:00:00"
            })

        const mealId = await knex('meals').select('id').first()

        await request(app.server)
            .patch('/meals')
            .set('Cookie', cookies)
            .send({
                id: mealId?.id,
                name: "New name",
                description: "New description",
                onDiet: true,
                date: "2025-10-10 12:00:00"
            })

        const meal = await knex('meals').select('*').first()

        expect(meal?.name).toEqual("New name")
        expect(meal?.description).toEqual("New description")
        expect(meal?.onDiet).toEqual(1)
    })

    it('should be able to delete a meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(201)

        const cookies = createUserResponse.get('Set-Cookie')!

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Almoço",
                description: "Food description",
                onDiet: false,
                date: "2025-10-10 12:00:00"
            })

        const mealId = await knex('meals').select('id').first()

        await request(app.server)
            .delete(`/meals/${mealId?.id}`)
            .set('Cookie', cookies)

        const meals = await knex('meals').select('*')

        expect(meals).toHaveLength(0)
    })

    it('should be able to get user metrics', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(201)

        const cookies = createUserResponse.get('Set-Cookie')!

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Meal",
                description: "Food description",
                onDiet: true,
                date: "2025-10-10 12:00:00"
            })
        
        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Meal",
                description: "Food description",
                onDiet: true,
                date: "2025-10-10 12:00:00"
            })

        await request(app.server)
            .post('/meals')
            .set('Cookie', cookies)
            .send({
                name: "Meal",
                description: "Food description",
                onDiet: false,
                date: "2025-10-10 12:00:00"
            })

        const metricsResponse = await request(app.server)
            .get('/meals/metrics')
            .set('Cookie', cookies)

        expect(metricsResponse.body).toEqual({
            recordedMeals: 3,
            recordedMealsOnDiet: 2,
            recordedMealsOutOffDiet: 1,
            bestSequence: 2
        })
    })
})