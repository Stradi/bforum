import LoginForm from "@components/login-form";

export default function Page() {
  return (
    <>
      <h1 className="text-center text-xl font-medium">Login to Your Account</h1>
      <LoginForm className="max-w-[400px] w-full p-4" />
    </>
  );
}
