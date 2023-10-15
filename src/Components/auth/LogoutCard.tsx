import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const LogoutCard: React.FC = () => {
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate("/");
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div className="text-lg font-semibold mb-3 ">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Logged In</CardTitle>
            <CardDescription>
              Use the button below to sign out of your account.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button variant="outline" onClick={logOut}>
              Log Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
