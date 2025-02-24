# Project Overview
This repo demonstrates migrating Payload CMS's template from MongoDB to Postgres and implementing multi-tenancy features. The project was completed as a technical assessment to showcase taking the templates/website from the official Payload CMS repository, migrating it to Postgres, and adapting the template to utilize multi-tenancy based on their documentation examples.

## Key Changes
- Created Docker Compose setup for local Postgres development with host file configuration
- Migrated from npm to pnpm, updated and pinned all dependencies
- Deployed to Vercel.com using Vercel Postgres
- Fixed bugs in the example seed file and corrected typing issues
- Added comprehensive environment variable examples
- Integrated Zod for improved validation
- Created seed file functionality
- Implemented Drizzle Studio for database management

## Implementation Process
- Created Docker Compose file for running Postgres locally
- Switched from mongooseAdapter to Drizzle Postgres adapter
- Installed and configured the multi-tenancy plugin
- Discovered and fixed undocumented errors in the seed file syntax using Drizzle Studio (if you want to try it use pnpm run drizzle:studio whilst postgres is running)
  - I have to use the payload cli to generate the schema for setting this up also. 
- Implemented domain name functionality, focusing on local setup first
- Set up remote deployment on Vercel

Environment variables are fully configurable with an updated example file provided for reference.

## Running the project locally
- Copy the .example.env -> .env
- pnpm run pg:up to start the postgres server
- Run pnpm run seed to seed the database
- Choose your fighter
- sudo nano /etc/hosts
  - sudo vim /etc/hosts
- Update your /etc/hosts with the following values at the bottom of the file, and save it
127.0.0.1 gold.test
127.0.0.1 silver.test
127.0.0.1 bronze.test
- Once you've saved it start the dev server and navigate to any of the domains e.g. http://gold.test:4321
- Login as the respective user
- If you login on the respective tenant domain, it will set a cookie labelled payload-tenant. You can verify this by choosing the correct domain/tenant and using chrome inspector

### Credentials
I'll create a clear table of credentials that would be useful in a README:

# Default Credentials for Testing

## Users
| Email | Password | Role(s) | Tenant Access |
|-------|----------|---------|---------------|
| demo@payloadcms.com | demo | super-admin | All |
| tenant1@payloadcms.com | demo | user, tenant-admin | Gold |
| tenant2@payloadcms.com | demo | tenant-admin | Silver |
| tenant3@payloadcms.com | demo | tenant-admin | Bronze |
| multi-admin@payloadcms.com | demo | tenant-admin | Gold, Silver, Bronze |

## Tenants
| Name | Slug | Domain |
|------|------|--------|
| Tenant 1 | gold | gold.test |
| Tenant 2 | silver | silver.test |
| Tenant 3 | bronze | bronze.test |

These credentials are created by default when running the seed script. You can use them to test different permission levels and tenant access scenarios.

## Future to-do's
For the purposes of this activity, I want to complete the project within a timely fashion. 
- I would add some end to end tests with Playwright or some unit and integration tests with Vitest.
- I would add some additional access controls on a per tenant basis, and produce unique content for each tenant