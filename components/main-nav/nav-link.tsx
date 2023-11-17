"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  text: string;
  href: string;
}

export default function NavLink(props: Props) {
  const { text, href } = props;
  const pathname = usePathname();
  return (
    <Link
      href={href}
      className={cn('text-sm font-medium transition-colors hover:text-primary', {
        'text-muted-foreground ': pathname !== href,
      })}
    >
      {text}
    </Link>
  );
}
