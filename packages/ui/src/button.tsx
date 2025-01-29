"use client";

import { ReactNode } from "react";
// import './index.css'

interface ButtonProps {
  children: ReactNode;
  className?: string;
  fn: () => void;
}

export const Button = ({ children, className, fn }: ButtonProps) => {
  return (
    <button
      className={`${className} bg-red-400`}
      onClick={fn}
    >
      {children}
    </button>
  );
};
// for pnpm @repo/typescript-config": "workspace:*",
//  for npm "@repo/typescript-config": ":*"