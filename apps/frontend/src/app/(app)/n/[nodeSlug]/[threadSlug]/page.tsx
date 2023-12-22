import React from "react";

type Props = {
  params: {
    nodeSlug: string;
    threadSlug: string;
  };
};

export default function Page({ params: { nodeSlug, threadSlug } }: Props) {
  return (
    <div>
      {nodeSlug} {threadSlug}
    </div>
  );
}
