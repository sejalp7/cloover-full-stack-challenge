export type UserRole = "user" | "admin";

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};
