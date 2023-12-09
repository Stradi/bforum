import { Heading } from "@radix-ui/themes";
import LoginForm from "../../../components/login-form/page";

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
