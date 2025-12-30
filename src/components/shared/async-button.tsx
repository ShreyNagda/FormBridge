"use client";
"use client";

import { useState } from "react";
import { Button, ButtonProps } from "./button";

interface AsyncButtonProps extends Omit<ButtonProps, "onClick"> {
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>
  ) => Promise<unknown> | void;
  loadingText?: React.ReactNode;
}

export function AsyncButton({
  onClick,
  isLoading: externalLoading,
  disabled,
  loadingText,
  children,
  ...props
}: AsyncButtonProps) {
  const [isInternalLoading, setIsInternalLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!onClick) return;

    const result = onClick(e);

    // Check if the result is a promise
    if (result instanceof Promise) {
      setIsInternalLoading(true);
      try {
        await result;
      } finally {
        setIsInternalLoading(false);
      }
    }
  };

  const isLoading = externalLoading || isInternalLoading;

  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      onClick={handleClick}
    >
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
}
