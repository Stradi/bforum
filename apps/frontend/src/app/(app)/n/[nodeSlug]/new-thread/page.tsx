import React from "react";
import Container from "@components/container";
import Header from "@components/header";
import NewThreadForm from "../_components/new-thread-form";

type Props = {
  params: {
    nodeSlug: string;
  };
};

export default function Page({ params: { nodeSlug } }: Props) {
  return (
    <div>
      <Header title="Create new thread" />
      <br />
      <Container className="px-4">
        <NewThreadForm nodeSlug={nodeSlug} />
      </Container>
    </div>
  );
}
