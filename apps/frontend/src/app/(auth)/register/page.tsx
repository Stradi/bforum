import RegisterForm from "@components/register-form";

export default function Page() {
  return (
    <>
      <h1 className="text-center text-xl font-medium">Create New Account</h1>
      <RegisterForm className="max-w-[400px] w-full p-4" />
    </>
  );
}
