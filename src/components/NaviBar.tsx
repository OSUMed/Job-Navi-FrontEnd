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

const Header: React.FC = () => {
  const handleLogout = () => {
    console.log("Logging out...");
    // Handle logout logic here...
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
      <Link
        to="/logout"
        className="ml-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
      >
        <ExitToAppIcon /> Log Out
      </Link>
      {/* <Button
        onClick={handleLogout}
        className="ml-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors"
      > */}

      {/* </Button> */}
    </header>
  );
};

export default Header;
