import type { MigrateUpArgs } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const client = payload as Payload

  const tenant1 = await client.create({
    collection: 'tenants',
    data: {
      name: 'Tenant 1',
      slug: 'gold',
      domain: 'gold.test',
    },
  })

  const tenant2 = await client.create({
    collection: 'tenants',
    data: {
      name: 'Tenant 2',
      slug: 'silver',
      domain: 'silver.test',
    },
  })

  const tenant3 = await client.create({
    collection: 'tenants',
    data: {
      name: 'Tenant 3',
      slug: 'bronze',
      domain: 'bronze.test',
    },
  })

  await client.create({
    collection: 'users',
    data: {
      email: 'demo@payloadcms.com',
      password: 'demo',
      roles: ['super-admin'],
    },
  })

  await client.create({
    collection: 'users',
    data: {
      email: 'tenant1@payloadcms.com',
      password: 'demo',
      roles: ['user'],
      tenants: [
        {
          roles: ['tenant-admin'],
          tenant: tenant1.id,
        },
      ],
      username: 'tenant1',
    },
  })

  await client.create({
    collection: 'users',
    data: {
      email: 'tenant2@payloadcms.com',
      password: 'demo',
      tenants: [
        {
          roles: ['tenant-admin'],
          tenant: tenant2.id,
        },
      ],
      username: 'tenant2',
    },
  })

  await client.create({
    collection: 'users',
    data: {
      email: 'tenant3@payloadcms.com',
      password: 'demo',
      tenants: [
        {
          roles: ['tenant-admin'],
          tenant: tenant3.id,
        },
      ],
      username: 'tenant3',
    },
  })

  await client.create({
    collection: 'users',
    data: {
      email: 'multi-admin@payloadcms.com',
      password: 'demo',
      tenants: [
        {
          roles: ['tenant-admin'],
          tenant: tenant1.id,
        },
        {
          roles: ['tenant-admin'],
          tenant: tenant2.id,
        },
        {
          roles: ['tenant-admin'],
          tenant: tenant3.id,
        },
      ],
      username: 'multi-admin',
    },
  })

  await client.create({
    collection: 'pages',
    data: {
      slug: 'home',
      tenant: tenant1.id,
      title: 'Page for Tenant 1',
      hero: {
        type: 'lowImpact',
        richText: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ text: 'Hero Title' }],
                version: 1,
              },
            ],
            direction: 'ltr',
            format: 'left',
            indent: 0,
            version: 1,
          },
        },
      },
      layout: [
        {
          blockType: 'cta',
          blockName: 'Call to Action',
          richText: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ text: 'Hello from Tenant 1' }],
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: 'left',
              indent: 0,
              version: 1,
            },
          },
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      slug: 'home',
      tenant: tenant2.id,
      title: 'Page for Tenant 2',
      hero: {
        type: 'lowImpact',
        richText: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ text: 'Hero Title for Tenant 2' }],
                version: 1,
              },
            ],
            direction: 'ltr',
            format: 'left',
            indent: 0,
            version: 1,
          },
        },
      },
      layout: [
        {
          blockType: 'cta',
          blockName: 'Call to Action',
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      slug: 'home',
      tenant: tenant3.id,
      title: 'Page for Tenant 3',
      hero: {
        type: 'lowImpact',
        richText: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ text: 'Hero Title for Tenant 3' }],
                version: 1,
              },
            ],
            direction: 'ltr',
            format: 'left',
            indent: 0,
            version: 1,
          },
        },
      },
      layout: [
        {
          blockType: 'cta',
          blockName: 'Call to Action',
        },
      ],
    },
  })
}
