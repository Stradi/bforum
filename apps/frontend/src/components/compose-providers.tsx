import type { JSXElementConstructor, PropsWithChildren } from "react";

// TODO: How to type this? For example, when we enter the `GroupsApiProvider`
// component, props should be the same as the props for the `GroupsApiProvider`
type Props = PropsWithChildren & {
  providers: [
    JSXElementConstructor<PropsWithChildren>,
    Record<string, unknown> | undefined
  ][];
};

export default function ComposeProviders({ children, providers }: Props) {
  return (
    <>
      {providers.reduceRight((acc, provider) => {
        const [Provider, ...props] = provider;
        return <Provider {...props[0]}>{acc}</Provider>;
      }, children)}
    </>
  );
}
