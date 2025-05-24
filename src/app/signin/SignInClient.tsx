"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignInClient() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn("google", { callbackUrl })}>
        Sign in with Google
      </button>
    </div>
  );
}