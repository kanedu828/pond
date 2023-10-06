# pond
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

### Other useful commands
