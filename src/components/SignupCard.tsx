"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { registerSchema } from "@/validations/register.validations";
import { axiosInstance } from "@/lib/axios";
import { signIn } from "next-auth/react";

export default function SignupCard() {
  const [otpPhase, setOtpPhase] = useState(false);
  const [username, setUsername] = useState("");
  const [loading,setLoading] = useState(false)
  const [otp, setOtp] = useState("");

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      const res = await axiosInstance.post("/register", values);
      if (res.status === 201) {
        toast.success(res.data.message);
        setUsername(values.username);
        setOtpPhase(true);
      }
    } catch (err) {
      //@ts-ignore
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axiosInstance.post("/verify-otp", {
        username: username,
        otp,
      });
      if (res.status === 200) {
        toast.success("Account verified successfully");
        setOtpPhase(false);
        setOtp("");
        form.reset();
      }
    } catch (err) {
      //@ts-ignore
      toast.error(err.response?.data?.error || "Invalid OTP");
    }finally{
      setLoading(false)
    }
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          {otpPhase ? "Verify OTP" : "Sign up"}
        </CardTitle>
        {!otpPhase && (
          <CardDescription>
            By signing up, you agree to our{" "}
            <Link href={"/privacy"}>
              <span className="text-blue-700">Privacy Policy</span>
            </Link>{" "}
            and{" "}
            <Link href={"/terms"}>
              <span className="text-blue-700">Terms of Service</span>
            </Link>
          </CardDescription>
        )}
      </CardHeader>

      <div className="px-7 mb-2">
        <Separator />
      </div>

      <CardContent className="p-7">
        {otpPhase ? (
          <form className="space-y-4" onSubmit={onOtpSubmit}>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP sent to your email"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Verify OTP
            </Button>
          </form>
        ) : (
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter email address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={form.formState.isSubmitting}
                size={"lg"}
                className="w-full"
                type="submit"
              >
                Sign up
              </Button>
            </form>
          </Form>
        )}
      </CardContent>

      {!otpPhase && (
        <>
          <div className="p-7">
            <Separator />
          </div>
          <CardContent className="p-7 flex flex-col gap-y-4">
            <Button
              variant={"secondary"}
              size={"lg"}
              className="w-full"
              onClick={() => signIn("google")}
            >
              <FcGoogle className="mr-2 size-5" /> Login with Google
            </Button>
            <Button
              variant={"secondary"}
              size={"lg"}
              className="w-full"
              onClick={() => signIn("github")}
            >
              <FaGithub className="mr-2 size-5" /> Login with Github
            </Button>
          </CardContent>
          <div className="px-7">
            <Separator />
          </div>
          <CardContent className="p-7 flex items-center justify-center">
            <p>Already have an account?</p>
            <Link href={"/sign-in"}>
              <span className="text-blue-700">&nbsp;Sign In</span>
            </Link>
          </CardContent>
        </>
      )}
    </Card>
  );
}
