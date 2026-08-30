"use client";

import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";

import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";

import AuthShell from "@/components/AuthShell";
import { authClient } from "@/lib/auth-client";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);

  const callbackURL = search.get("callbackUrl") || "/";

  async function submit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      const values = Object.fromEntries(
        new FormData(event.currentTarget)
      );

      const result = await authClient.signIn.email({
        ...values,
        callbackURL,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Unable to log in"
        );
        return;
      }

      toast.success("Welcome back");

      router.push(callbackURL);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Pick up your journey right where you left it."
    >
      <Button
        className="google-button"
        variant="secondary"
        onPress={google}
      >
        <FcGoogle size={20} />
        Continue with Google
      </Button>

      <div className="or">
        <span>or use email</span>
      </div>

      <Form
        onSubmit={submit}
        className="auth-fields"
      >
        <TextField
          isRequired
          name="email"
          type="email"
        >
          <Label>Email address</Label>

          <Input
            placeholder="you@example.com"
            variant="secondary"
          />

          <FieldError />
        </TextField>

        <TextField
          isRequired
          name="password"
          type="password"
        >
          <Label>Password</Label>

          <Input
            placeholder="At least 8 characters"
            variant="secondary"
          />

          <FieldError />
        </TextField>

        <Button
          type="submit"
          isPending={loading}
          className="w-full"
        >
          Sign in
        </Button>
      </Form>

      <p className="auth-switch">
        New here?{" "}
        <Link href="/register">
          Create your account
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}