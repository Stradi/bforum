import RegisterForm from "@components/register-form";
import { Heading } from "@radix-ui/themes";

export default function Page() {
  return (
    <>
      <Heading as="h1" className="text-center">
        Create New Account
      </Heading>
      <RegisterForm className="max-w-[400px] w-full p-4" />
    </>
  );
}
