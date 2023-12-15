"use client";

import type { PropsWithChildren } from "react";
import { createContext, useEffect } from "react";

type TScalingDialogContext = {
  bodyColor: string;
  padding: number;
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
        className="bg-white overflow-hidden transition-[transform,border-radius] ease-out h-full min-h-screen"
        data-dialog-wrapper
      >
        {children}
      </div>
    </ScalingDialogContext.Provider>
  );
}

export { ScalingDialogContext, ScalingDialogProvider };
