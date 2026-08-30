"use client";

import { Button, FieldError, Form, Input, Label, TextField } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.password.length < 8) return toast.error("Password must have at least 8 characters");
    setLoading(true);
    const result = await authClient.signUp.email({ name: values.name, email: values.email, password: values.password, callbackURL: "/" });
    if (result.error) { setLoading(false); return toast.error(result.error.message || "Could not create account"); }
    try { await apiFetch("/users/sync", { method: "POST", body: JSON.stringify({ name: values.name }) }); } catch {}
    setLoading(false); toast.success("Your account is ready"); router.push("/"); router.refresh();
  }

  return <AuthShell title="Create account" subtitle="A calmer, clearer way to book every kind of journey."><Form onSubmit={submit} className="auth-fields"><TextField isRequired name="name"><Label>Full name</Label><Input placeholder="Your name" variant="secondary" /><FieldError /></TextField><TextField isRequired name="email" type="email"><Label>Email address</Label><Input placeholder="you@example.com" variant="secondary" /><FieldError /></TextField><TextField isRequired name="password" type="password" minLength={8}><Label>Password</Label><Input placeholder="At least 8 characters" variant="secondary" /><FieldError /></TextField><Button type="submit" isPending={loading} className="w-full">Create account</Button></Form><p className="auth-switch">Already a member? <Link href="/login">Sign in</Link></p></AuthShell>;
}
