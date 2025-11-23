# Introdução 📖

Aplicação desenvolvida para o desafio do módulo 2 da trilha de NodeJS da Rocketseat. Esta aplicação tem como objetivo hospedar uma API que gerencia um aplicativo de dieta, onde o usuário pode registrar suas refeições, visualizar suas métricas e o quanto ele está evoluindo na sua dieta, ver o seu histórico de refeições, etc.

## Tecnologias 🚀

- Javascript (ES6)
- NodeJS
- Fastify
- Zod (Validation Library)
- Knex (Query Builder)
- SQlite/Postgres (Database)
- Vitest (Test/Mocking)

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env / .env.test

`NODE_ENV`

`DATABASE_CLIENT`

`DATABASE_URL`

`PORT`

## Regras da aplicação

- [X] Deve ser possível criar um usuário
- [X] Deve ser possível identificar o usuário entre as requisições
- [X] Deve ser possível registrar uma refeição feita, com as seguintes informações:
  > *As refeições devem ser relacionadas a um usuário.*
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [X] Deve ser possível listar todas as refeições de um usuário
- [X] Deve ser possível visualizar uma única refeição
- [X] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [X] Deve ser possível apagar uma refeição
- [X] Deve ser possível recuperar as métricas de um usuário
  - [X] Quantidade total de refeições registradas
  - [X] Quantidade total de refeições dentro da dieta
  - [X] Quantidade total de refeições fora da dieta
  - [X] Melhor sequência de refeições dentro da dieta
- [X] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou