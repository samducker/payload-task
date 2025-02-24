import type { Access } from 'payload'

import { getUserTenantIDs } from '@/collections/Tenants/utilities/getUserTenantIDs'
import { isSuperAdmin } from '@/collections/Tenants/access/isSuperAdmin'
import { isAccessingSelf } from './isAccessingSelf'

export const updateAndDeleteAccess: Access = ({ req, id }) => {
  const { user } = req

  if (!user) {
    return false
  }

  if (isSuperAdmin(user) || isAccessingSelf({ user, id })) {
    return true
  }

  /**
   * Constrains update and delete access to users that belong
   * to the same tenant as the tenant-admin making the request
   *
   * You may want to take this a step further with a beforeChange
   * hook to ensure that the a tenant-admin can only remove users
   * from their own tenant in the tenants array.
   */
  return {
    'tenants.id': {
      in: getUserTenantIDs(user, 'tenant-admin'),
    },
  }
}
