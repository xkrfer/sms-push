"use client";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

interface Props {
  logs: {
    page: number;
    total: number;
  };
}

export default function ButtonGroup(props: Props) {
  const { logs } = props;
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const handlePrevious = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("p", String(logs.page - 1));
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleNext = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("p", String(logs.page + 1));
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-x-2">
      <Button variant="outline" size="sm" disabled={logs.page === 1 || isPending} onClick={() => {
        handlePrevious();
      }}>
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={logs.page >= Math.ceil(logs.total / 10) || isPending}
        onClick={() => {
          handleNext();
        }}
      >
        Next
      </Button>
    </div>
  );
}
