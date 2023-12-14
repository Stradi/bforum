import LoginForm from "@components/login-form/page";
import { Heading } from "@radix-ui/themes";

export default function Page() {
  return (
    <>
      <Heading as="h1" className="text-center">
        Login to Your Account
      </Heading>
      <LoginForm className="max-w-[400px] w-full p-4" />
    </>
  );
}
