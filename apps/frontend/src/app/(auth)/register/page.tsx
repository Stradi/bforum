import { Heading } from "@radix-ui/themes";
import RegisterForm from "../../../components/register-form";

export default function Page() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 bg-neutral-900 flex items-center justify-center text-white">
        <Heading as="h2">Welcome to bForum!</Heading>
      </div>
      <div className="w-1/2 flex flex-col gap-4 items-center justify-center">
        <Heading as="h1">Create New Account</Heading>
        <RegisterForm className="max-w-[400px] w-full" />
      </div>
    </div>
  );
}
