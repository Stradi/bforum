import Link from "next/link";
import InterceptorModal from "@components/interceptor-modal";
import RegisterForm from "@components/register-form";
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
    <InterceptorModal depth={currentDepth + 1} title="Create New Account">
      <RegisterForm />
      <Separator />
      <div className="flex flex-col items-center text-sm">
        <p>
          Already have an account?{" "}
          <Button asChild className="h-auto p-0" variant="link">
            <Link href={`/login?depth=${currentDepth + 1}`} shallow={false}>
              Login to that
            </Link>
          </Button>
        </p>
      </div>
    </InterceptorModal>
  );
}
