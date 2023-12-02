export type JwtPayload = {
  id: number;
  username: string;
  displayName: string;
  email: string;
  iat: number;
  nbf: number;
  exp: number;
};
