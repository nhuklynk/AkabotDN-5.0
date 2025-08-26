export class JwtPayloadDto {
  sub: string; // user ID
  email: string;
  username: string;
  role: string;
  type: 'access' | 'refresh'; // Token type
  iat?: number;
  exp?: number;
}
