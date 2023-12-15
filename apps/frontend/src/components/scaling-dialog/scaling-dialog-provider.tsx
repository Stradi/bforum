"use client";

import type { PropsWithChildren } from "react";
import { createContext, useEffect } from "react";

type TScalingDialogContext = {
  bodyColor: string;
};

const ScalingDialogContext = createContext<TScalingDialogContext>(
  {} as TScalingDialogContext
);

type Props = PropsWithChildren & TScalingDialogContext;
function ScalingDialogProvider({ children, ...props }: Props) {
  useEffect(() => {
    document.body.classList.add(props.bodyColor);
    return () => {
      document.body.classList.remove(props.bodyColor);
    };
  });

  return (
    <ScalingDialogContext.Provider value={props}>
      <div
        className="bg-white overflow-hidden origin-bottom fixed inset-0 transition-[transform,border-radius] duration-200"
        data-dialog-wrapper
      >
        {children}
      </div>
    </ScalingDialogContext.Provider>
  );
}

export { ScalingDialogContext, ScalingDialogProvider };
