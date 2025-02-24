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
- Discovered and fixed undocumented errors in the seed file syntax using Drizzle Studio
- Implemented domain name functionality, focusing on local setup first
- Set up remote deployment on Vercel

Environment variables are fully configurable with an updated example file provided for reference.