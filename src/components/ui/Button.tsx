import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const base =
  "btn-primary inline-flex items-center justify-center gap-2 rounded-md bg-violet-light px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-purple focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-light";

type ButtonBaseProps = {
  children: ReactNode;
  className?: string;
};

type ButtonLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children" | "href"> & {
    href: string;
  };

type ButtonElementProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonLinkProps | ButtonElementProps;

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { href, children, className, ...rest } = props;

    return (
      <Link href={href} className={cn(base, className)} {...rest}>
        {children}
      </Link>
    );
  }

  const { children, className, type = "button", ...rest } = props;

  return (
    <button type={type} className={cn(base, className)} {...rest}>
      {children}
    </button>
  );
}
