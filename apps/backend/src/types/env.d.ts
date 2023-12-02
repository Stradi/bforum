export {};

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- we're extending an existing type
    interface ProcessEnv {
      PORT?: string;
      JWT_SECRET?: string;
      JWT_EXPIRES_IN?: string;
    }
  }
}
