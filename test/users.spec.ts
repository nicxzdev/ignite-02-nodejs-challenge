import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'child_process'
import { knex } from '../src/database'

describe('Users Tests', () => {
    beforeAll(async () => {
        await app.ready()
    })

    beforeEach(async () => {
        await knex.raw('DELETE FROM knex_migrations_lock;')
        execSync("npm run knex -- migrate:rollback --all")
        execSync("npm run knex -- migrate:latest")
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to register an user', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(201)
    })

    it('should not be able to register an user if another user with the same e-mail is already registered', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(201)

        await request(app.server)
            .post('/users')
            .send({
                name: "testName",
                email: "emailTest@mail.com"
            })
            .expect(409)
    })
})