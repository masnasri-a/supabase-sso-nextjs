"use client";
import supabaseClient from "@/components/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { IoReloadOutline } from "react-icons/io5";
import { z } from "zod";

export default function Home() {
  const supabase = supabaseClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);
  const { toast } = useToast();

  const User = z.object({
    email: z.coerce.string().email().min(5, { message: "Email is too short" }),
    password: z.string().min(8, { message: "Password is too short" }),
  });

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data, error);
    if (error) {
      const errorMessage = error?.message;
      toast({
        title: "Failed Login",
        variant: "destructive",
        description: errorMessage,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }else{
      window.location.href = "/profile";
    }
  }

  const validate = () => {
    const responseValidate = User.safeParse({ email, password });
    if (!responseValidate.success) {
      const parseError = responseValidate.error.errors
        .map((error) => error.message)
        .join(", ");

      toast({
        title: "Please check the form",
        variant: "destructive",
        description: parseError,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    validate();
    signInWithEmail();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  async function signInWithGithub() {
    setIsLoadingGithub(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/profile",
      },
    });
    if (error) {
      const errorMessage = error?.message;
      toast({
        title: "Failed Login",
        variant: "destructive",
        description: errorMessage,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    setTimeout(() => {
      setIsLoadingGithub(false);
    }, 2000);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="grid w-full max-w-sm items-center gap-4">
        <div className="">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          onClick={() => handleSubmit()}
          disabled={isLoading}
        >
          {isLoading ? <IoReloadOutline className="animate-spin" /> : "Sign In"}
        </Button>
        <div className="flex justify-end">
          {" "}
          Dont have an account?{" "}
          <Link href={"/register"} className="ml-2 from-stone-800 font-bold">
            {" "}
            Sign Up
          </Link>{" "}
        </div>
        <Separator className="my-4" />
        <Button
          type="button"
          variant="secondary"
          disabled={isLoadingGithub}
          onClick={() => signInWithGithub()}
        >
          {isLoadingGithub ? (
            <IoReloadOutline className="animate-spin" />
          ) : (
            <>
              {" "}
              <FaGithub className="mr-2 h-4 w-4" /> Sign in with Github{" "}
            </>
          )}
        </Button>
      </div>
    </main>
  );
}
