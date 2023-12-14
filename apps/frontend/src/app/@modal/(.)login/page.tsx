import InterceptorModal from "@components/interceptor-modal";
import LoginForm from "@components/login-form/page";
import { Link, Separator, Text } from "@radix-ui/themes";
import { default as NextLink } from "next/link";

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
      <Separator my="3" size="4" />
      <div className="flex flex-col items-center gap-1">
        <Text size="2">
          Don&apos;t have an account?{" "}
          <Link asChild size="2">
            <NextLink
              href={`/register?depth=${currentDepth + 1}`}
              shallow={false}
            >
              Create an account
            </NextLink>
          </Link>
        </Text>
        <Text size="2">
          Forgot your password?{" "}
          <Link asChild size="2">
            <NextLink
              href={`/forgot-password?depth=${currentDepth + 1}`}
              shallow={false}
            >
              Reset it
            </NextLink>
          </Link>
        </Text>
      </div>
    </InterceptorModal>
  );
}
