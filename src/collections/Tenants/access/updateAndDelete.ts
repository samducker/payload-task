import { isSuperAdmin } from '@/collections/Tenants/access/isSuperAdmin'
import { getUserTenantIDs } from '@/collections/Tenants/utilities/getUserTenantIDs'
import { Access } from 'payload'

export const updateAndDeleteAccess: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  return {
    id: {
      in: getUserTenantIDs(req.user, 'tenant-admin'),
    },
  }
}
