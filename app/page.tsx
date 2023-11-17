"use client";

import { Spinner } from "flowbite-react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main>
      {status === "loading" ? (
        <Spinner />
      ) : status === "unauthenticated" ? (
        "Please login to see this page"
      ) : (
        <div>
          <h1>Home</h1>
          <p>
            Hello <strong>{session?.user?.name ?? "stranger"}</strong>! This is
            your home page.
          </p>
        </div>
      )}
    </main>
  );
}
