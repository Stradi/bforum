import { Heading } from "@radix-ui/themes";
import RegisterForm from "@components/register-form";

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
