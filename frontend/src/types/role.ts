/**
 * RoleSerializer's field list wasn't included in the endpoints you shared —
 * this assumes the common {id, name} shape. Adjust to match your real
 * serializer if it exposes more (e.g. a `codename` or `description`).
 */
export interface Role {
  id: number;
  name: string;
}

/** Mirrors UserRoleSerializer — read-only in every serializer above, so
 * there's no create/update path for roles from the Staff endpoints. */
export interface UserRole {
  id: number;
  role: Role;
}
