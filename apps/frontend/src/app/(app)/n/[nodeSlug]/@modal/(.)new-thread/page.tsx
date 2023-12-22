import React from "react";
import InterceptorModal from "@components/interceptor-modal";
import NewThreadForm from "../../_components/new-thread-form";

type Props = {
  params: {
    nodeSlug: string;
  };
};

export default function Page({ params: { nodeSlug } }: Props) {
  return (
    <InterceptorModal title="New Thread">
      <NewThreadForm nodeSlug={nodeSlug} />
    </InterceptorModal>
  );
}
