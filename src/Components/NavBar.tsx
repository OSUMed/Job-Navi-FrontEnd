// Header.tsx
import React from "react";
import { Button } from "@/Components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/Components/ui/navigation-menu";
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
} from "@/Components/ui/alert-dialog";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { TfiWrite } from "react-icons/ti";
import classNames from "classnames";
import { useLocation } from "react-router-dom";
import { BsSendCheckFill } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import UserNav from "./UserNav";

const Header: React.FC = () => {
  // const handleLogout = () => {
  // console.log("Logging out...");
  // // Handle logout logic here...
  // };
  const navigate = useNavigate();
  const location = useLocation();
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

  const links = [
    { label: "Applications", href: "/applications" },
    { label: "Contacts", href: "/contacts" },
    { label: "Notes", href: "/notes" },
  ];

  return (
    <nav className="flex space-x-6 border-b mb-5 px-5 h-14 items-center bg-white justify-between">
      <div className="flex space-x-6">
        <Link to="/">
          <BsSendCheckFill />
        </Link>
        <ul className="flex space-x-6">
          {links.map((link) => {
            const isHighlighted =
              (link.href === "/applications" && location.pathname === "/") ||
              location.pathname === link.href;
            return (
              <Link
                key={link.href}
                className={classNames({
                  "text-zinc-900": isHighlighted,
                  "text-zinc-500": !isHighlighted,
                  "hover:text-zinc-900 transition-colors": true,
                })}
                to={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </ul>
      </div>
      <UserNav />
    </nav>
  );
};

export default Header;
