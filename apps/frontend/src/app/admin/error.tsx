"use client";

import { Button } from "@components/ui/button";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Page({ error, reset }: Props) {
  let isApiError = false;
  try {
    JSON.stringify(error);
    isApiError = true;
  } catch {
    /* empty */
  }

  if (isApiError) {
    const errorObj = JSON.parse(error.message);
    return (
      <div className="text-center my-16 space-y-2">
        <h1 className="text-lg">{errorObj.message}</h1>
        <p className="text-sm">{errorObj.action}</p>
      </div>
    );
  }
  return (
    <div className="text-center my-16 space-y-2">
      <h1 className="text-lg">Something went really wrong. I am sorry 😔</h1>
      <p className="text-sm">
        Maybe you can try to
        <Button className="p-2" onClick={reset} variant="link">
          reload
        </Button>
        the page, and hope for the best.
      </p>
    </div>
  );
}
