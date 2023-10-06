# pond
## Setup

1. Install bun or npm
2. Run `$ bun install` or `$ bpm install`
3. Instal psql and set up your database
4. Fill in .env variables in /pond-web and /pond-service
5. Run migrations on database

## Pond-Service
### Development
`$ npm run dev`
`$ npm test`
### Migrations
Make sure you have a psql db setup. Fill in .env
To migrate to the latest:
`$ npm run migrate:latest`

To rollback:
`$ npm run migrate:rollback`

To create migrations:
`$ knex migrate:make -x ts`

## Pond-web
`$ npm run dev`

### Other useful commands
