import type { Access } from 'payload'
import { z } from 'zod'
export const isSuperAdminAccess: Access = ({ req }): boolean => {
  return isSuperAdmin(req.user)
}

const userSchema = z.object({
  id: z.number(),
  roles: z.array(z.string()),
})

export const isSuperAdmin = (user: unknown): boolean => {
  const userData = userSchema.safeParse(user)
  if (!userData.success) {
    return false
  }
  return Boolean(userData.data.roles.includes('super-admin'))
}
