"use client";

import { Button, TextField } from "@radix-ui/themes";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  onShowChange: (show: boolean) => void;
};

export default function ShowPasswordButton({ onShowChange }: Props) {
  const [show, setShow] = useState(false);

  return (
    <TextField.Slot pr="3">
      <Button
        className="!py-1 !px-1"
        onClick={() => {
          setShow((prev) => !prev);
          onShowChange(!show);
        }}
        type="button"
        variant="ghost"
      >
        {show ? (
          <EyeOffIcon
            className="stroke-neutral-400"
            height={16}
            strokeWidth={1.5}
            width={16}
          />
        ) : (
          <EyeIcon
            className="stroke-neutral-400"
            height={16}
            strokeWidth={1.5}
            width={16}
          />
        )}
      </Button>
    </TextField.Slot>
  );
}
