import Link from "next/link";
import InterceptorModal from "@components/interceptor-modal";
import LoginForm from "@components/login-form";
import { Separator } from "@components/ui/separator";
import { Button } from "@components/ui/button";

type Props = {
  searchParams: {
    depth?: string;
  };
};
export default function Page({ searchParams }: Props) {
  const currentDepth = searchParams.depth ? parseInt(searchParams.depth) : 1;

  return (
    <InterceptorModal depth={currentDepth + 1} title="Login to Your Account">
      <LoginForm />
      <Separator />
      <div className="text-sm flex flex-col items-center gap-1">
        <p>
          Don&apos;t have an account?{" "}
          <Button asChild className="p-0 h-auto" variant="link">
            <Link href={`/register?depth=${currentDepth + 1}`} shallow={false}>
              Create an account
            </Link>
          </Button>
        </p>
        <p>
          Forgot your password?{" "}
          <Button asChild className="p-0 h-auto" variant="link">
            <Link
              href={`/forgot-password?depth=${currentDepth + 1}`}
              shallow={false}
            >
              Reset it
            </Link>
          </Button>
        </p>
      </div>
    </InterceptorModal>
  );
}
