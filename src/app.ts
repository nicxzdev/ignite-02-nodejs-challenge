import fastify from "fastify"
import fastifyCookie from "@fastify/cookie"
import { usersRoute } from "./routes/users"
import { mealsRoute } from "./routes/meals"

export const app = fastify({
    logger: false
})

app.register(fastifyCookie)
app.register(usersRoute, {
    prefix: '/users'
})
app.register(mealsRoute, {
    prefix: '/meals'
})