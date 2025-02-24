import type { User } from '@/payload-types'
import type { Access, Where } from 'payload'

import { parseCookies } from 'payload'
import { z } from 'zod'
import { isSuperAdmin } from '@/collections/Tenants/access/isSuperAdmin'
import { getUserTenantIDs } from '@/collections/Tenants/utilities/getUserTenantIDs'
import { isAccessingSelf } from './isAccessingSelf'

const parseIntSchema = z.coerce.number()

export const readAccess: Access<User> = ({ req, id }) => {
  if (!req?.user) {
    return false
  }

  if (isAccessingSelf({ id, user: req.user })) {
    return true
  }

  const cookies = parseCookies(req.headers)
  const superAdmin = isSuperAdmin(req.user)
  const selectedTenant = cookies.get('payload-tenant')
  const adminTenantAccessIDs = getUserTenantIDs(req.user, 'tenant-admin')

  if (selectedTenant) {
    const tryParseInt = parseIntSchema.safeParse(selectedTenant)
    if (tryParseInt.success) return false
    // If it's a super admin, or they have access to the tenant ID set in cookie
    const hasTenantAccess = adminTenantAccessIDs.some((id) => id === tryParseInt.data)
    if (superAdmin || hasTenantAccess) {
      return {
        'tenants.id': {
          equals: selectedTenant,
        },
      }
    }
  }

  if (superAdmin) {
    return true
  }

  return {
    or: [
      {
        id: {
          equals: req.user.id,
        },
      },
      {
        'tenants.id': {
          in: adminTenantAccessIDs,
        },
      },
    ],
  } as Where
}
