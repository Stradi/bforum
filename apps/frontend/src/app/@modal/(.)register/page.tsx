import InterceptorModal from "@components/interceptor-modal";
import RegisterForm from "@components/register-form";
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
    <InterceptorModal depth={currentDepth + 1} title="Create New Account">
      <RegisterForm />
      <Separator my="3" size="4" />
      <div className="flex flex-col items-center">
        <Text size="2">
          Already have an account?{" "}
          <Link asChild size="2">
            <NextLink href={`/login?depth=${currentDepth + 1}`} shallow={false}>
              Login to that
            </NextLink>
          </Link>
        </Text>
      </div>
    </InterceptorModal>
  );
}
