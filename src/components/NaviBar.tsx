// Header.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  //   const handleLogout = () => {
  //     console.log("Logging out...");
  //     // Handle logout logic here...
  //   };
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
    <header className="p-4 bg-blue-400 text-white flex justify-end items-center">
      <NavigationMenu className="flex-grow">
        <ul className="flex space-x-4 justify-end">
          <li>
            <Link to="/applications" className="hover:underline">
              Applications
            </Link>
          </li>
          <li>
            <Link to="/contacts" className="hover:underline">
              Contacts
            </Link>
          </li>
          <li>
            <Link to="/notes" className="hover:underline">
              Notes
            </Link>
          </li>
        </ul>
      </NavigationMenu>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="ml-4 px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Log Out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              Use the button below to sign out of your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={logOut}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* <Link
        to="/logout"
        className="ml-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
      >
        <ExitToAppIcon /> Log Out
      </Link> */}
      {/* <Button
        onClick={handleLogout}
        className="ml-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
      > */}

      {/* </Button> */}
    </header>
  );
};

export default Header;
