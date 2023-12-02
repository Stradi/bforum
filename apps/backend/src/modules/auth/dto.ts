import * as zod from "zod";

export type TLoginBodySchema = zod.infer<typeof LoginBodySchema>;
export const LoginBodySchema = zod.object({
  username: zod.string(),
  password: zod.string(),
});

export type TRegisterBodySchema = zod.infer<typeof RegisterBodySchema>;
export const RegisterBodySchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  email: zod.string().email(),
});
