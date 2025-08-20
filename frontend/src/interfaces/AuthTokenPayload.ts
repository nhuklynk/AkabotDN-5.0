import { User } from "./User";

export interface AuthTokenPayload {
  sub: string; // Maps to User.id
  email: string; // Maps to User.email
  name: string; // Maps to User.name
  role: string; // Maps to User.role
  iat: number; // JWT issued at timestamp
  exp: number; // JWT expiration timestamp
}

// Helper function to convert AuthTokenPayload to User
export const mapTokenPayloadToUser = (payload: AuthTokenPayload): User => ({
  id: payload.sub,
  email: payload.email,
  name: payload.name,
  role: payload.role,
});
