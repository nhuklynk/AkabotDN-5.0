export class AuthResponseDto {
  access_token: string;
  refresh_token?: string; // Optional since it's stored in HTTP-only cookies
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}
