"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signUpSchema } from "@/lib/zodschema";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axiosInterceptor";
import Link from "next/link";
import { ModeToggle } from "@/components/toggle";
import { UploadButton } from "@/lib/uploadthing";

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imageUploaded, setImageUploaded] = useState<boolean>(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    if (!imageUploaded) {
      toast.error("Image upload is required!");
      return;
    }
    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
      avatar:uploadedImageUrl,
    };
    setIsSubmitting(!isSubmitting);
    try {
      await axiosInstance.post("/auth/signup", data).then((response) => {
        Cookies.set("token", response.data.access_token, { expires: 7 });
        router.push("/");
        toast.success("Signup successful!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      });
    } catch (error) {
      toast.error("Something went wrong.", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }

  return (
    <div>
      <ToastContainer />
      <div className="absolute p-4 right-0">
        <ModeToggle />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md dark:bg-gray-800">
          <div className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
            Sign Up
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name here."
                        {...field}
                        className="w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 dark:text-gray-400">
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email here."
                        {...field}
                        className="w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 dark:text-gray-400">
                      This is your public display email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-200">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password here."
                        {...field}
                        className="w-full px-4 py-2 mt-1 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                      />
                    </FormControl>
                    <FormDescription className="text-gray-500 dark:text-gray-400">
                      This is your password.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <main className="flex flex-col items-center justify-between">
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setImageUploaded(!imageUploaded);
                    toast.success("Upload completed.", {
                      position: "bottom-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      transition: Bounce,
                    });
                    setUploadedImageUrl(res[0].url);
                  }}
                  onUploadError={(error: Error) => {
                    toast.error("Image upload error.", {
                      position: "bottom-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "colored",
                      transition: Bounce,
                    });;
                  }}
                />
              </main>
              <Button
              disabled={isSubmitting}
                type="submit"
                className="w-full py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {isSubmitting?"Submitting...":"Submit"}
              </Button>
            </form>
          </Form>
          <div className="text-sm text-center text-gray-600 dark:text-gray-400">
            Already Signed Up? Please Login{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
            >
              HERE
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
