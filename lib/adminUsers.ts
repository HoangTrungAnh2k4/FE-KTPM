export type UserRole = 'Administrator' | 'Instructor' | 'Student';

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  roles: UserRole[];
  active: boolean;
};

let users: AdminUser[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', roles: ['Student'], active: true },
  { id: 2, name: 'Bob', email: 'bob@example.com', roles: ['Instructor'], active: true },
  { id: 3, name: 'Carol', email: 'carol@example.com', roles: ['Administrator'], active: true },
];

export function viewUsers(roleFilter?: UserRole): AdminUser[] {
  if (!roleFilter) return [...users];
  return users.filter((u) => u.roles.includes(roleFilter));
}

export function createUserAccount(payload: { name: string; email: string; roles?: UserRole[] }): AdminUser {
  const id = Math.max(0, ...users.map((u) => u.id)) + 1;
  const newUser: AdminUser = {
    id,
    name: payload.name,
    email: payload.email,
    roles: payload.roles && payload.roles.length ? payload.roles : ['Student'],
    active: true,
  };
  users = [newUser, ...users];
  return newUser;
}

export function toggleUserStatus(userId: number): AdminUser | undefined {
  users = users.map((u) => (u.id === userId ? { ...u, active: !u.active } : u));
  return users.find((u) => u.id === userId);
}

export function resetUserPassword(userId: number): { userId: number; tempPassword: string } | undefined {
  const user = users.find((u) => u.id === userId);
  if (!user) return undefined;
  // Demo only: generate a temp password
  const temp = `Temp-${Math.random().toString(36).slice(2, 8)}`;
  return { userId, tempPassword: temp };
}

// Enforce single-role accounts: assigning a role replaces current role.
export function assignRole(userId: number, role: UserRole): AdminUser | undefined {
  users = users.map((u) => (u.id === userId ? { ...u, roles: [role] } : u));
  return users.find((u) => u.id === userId);
}

// Revoking role sets the default role back to Student
export function revokeRole(userId: number, role: UserRole): AdminUser | undefined {
  users = users.map((u) => (u.id === userId ? { ...u, roles: ['Student'] } : u));
  return users.find((u) => u.id === userId);
}
