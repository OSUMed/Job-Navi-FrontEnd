import React, { useRef, useState } from "react";
import {
  authCreateAccountWithEmail,
  authSignInWithEmail,
} from "../services/firebase/firebaseConfig";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";

export const LoginCard: React.FC = () => {
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError("");
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    try {
      await authSignInWithEmail(email, password);
    } catch (err) {
      setError("Invalid Login Credentials: Check Email and Password");
    }
  };

  const handleDemoAccess = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setError("");
    const email = "tester@gmail.com";
    const password = "tester";

    try {
      await authSignInWithEmail(email, password);
    } catch (err) {
      setError("Invalid Login Credentials: Check Email and Password");
    }
  };

  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setError("");

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";

    if (!passwordRef.current?.value || passwordRef.current?.value.length < 6) {
      setError("Password should be at least 6 characters");
      passwordRef.current?.focus();
      return;
    }

    function validateEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      emailRef.current?.focus();
    }

    try {
      await authCreateAccountWithEmail(email, password);
    } catch (err) {
      console.log("the error is : ", err.code);
      if ((err as { code: string }).code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if ((err as { code: string }).code === "auth/invalid-email") {
        // Correcting the error code here
        setError("The email address is badly formatted.");
      } else {
        setError("An error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="text-lg font-semibold mb-3 ">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Create an account or sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input ref={emailRef} id="email" placeholder="Your Email" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    placeholder="Your Password"
                  />
                  {error && (
                    <Alert>
                      <AlertDescription className="text-red-500">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 items-center justify-center">
            <div className="flex w-full space-x-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
                variant="outline"
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <Button
                className="w-full bg-gray-500 hover:bg-gray-600 text-white "
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </div>
            {/* <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={handleDemoAccess}
            >
              Try It Out
            </Button> */}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  {" "}
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleDemoAccess}
                  >
                    Try It Out
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 text-white p-2 rounded-md">
                  <p>Experience all features without signing up</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
