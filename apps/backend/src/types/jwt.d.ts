export type RegisteredJwtClaims = {
  iat: number;
  nbf: number;
  exp: number;
};

export type CustomJwtClaims = {
  id: number;
  username: string;
  display_name: string;
  email: string;
  groups: {
    id: number;
    name: string;
  }[];
};

export type JwtPayload = RegisteredJwtClaims & CustomJwtClaims;
