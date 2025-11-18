export const USERS = [
  {
    id: "test-user-id",
    name: "Test User",
    email: "test-user-id.e2e@tasksync.test",
  },
  {
    id: "test-user-admin-id",
    name: "Test User Admin",
    email: "test-user-admin.e2e@tasksync.test",
  },
];

export const USER_DEFAULT: Partial<{
  id: string;
  name: string;
  email: string;
}> = USERS[0] ?? {};

export const USER_ADMIN: Partial<{ id: string; name: string; email: string }> =
  USERS[1] ?? {};
