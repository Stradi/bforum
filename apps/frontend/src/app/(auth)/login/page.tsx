import { Heading } from "@radix-ui/themes";
import LoginForm from "../../../components/login-form/page";

export default function Page() {
  return (
    <div className="w-full h-screen flex">
      <div className="w-1/2 bg-neutral-900 flex items-center justify-center text-white">
        <Heading as="h2">Welcome to bForum!</Heading>
      </div>
      <div className="w-1/2 flex flex-col gap-4 items-center justify-center">
        <Heading as="h1">Login to Your Account</Heading>
        <LoginForm className="max-w-[400px] w-full" />
      </div>
    </div>
  );
}
