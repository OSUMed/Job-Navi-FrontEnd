import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import SingleRowSelectionGrid from "./Components/Test";
import SingleRowSelectionGrid2 from "./Components/Test2";
import Test3 from "./Components/Test3";
import Contacts from "./Components/Contacts";
import Applications from "./Components/Applications";
import Notes from "./Components/Notes";
import "tailwindcss/tailwind.css";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { LoginCard } from "./Components/auth/LoginCard";
import { LogoutCard } from "./Components/auth/LogoutCard";
import { ThemeProvider } from "@/components/theme-provider";

import { Collapsible } from "./Components/ui/collapsible";
import ContactsForm from "./Components/ContactsForm";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // To store the user object
  const [loading, setLoading] = useState(true); // To manage a loading state during auth check

  useEffect(() => {
    const auth = getAuth();
    // Listener for auth state (logged in or out)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // If logged in, currentUser is user object, else null
      setLoading(false);
    });
    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner/component
  }
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Applications />} />
              <Route
                path="contacts"
                element={<Contacts cookie={{ session: "" }} />}
              />
              <Route path="applications" element={<Applications />} />
              <Route path="notes" element={<Notes />} />
              <Route path="logout" element={<LogoutCard />} />
              <Route path="test" element={<SingleRowSelectionGrid />} />
              <Route path="test2" element={<SingleRowSelectionGrid2 />} />
              <Route path="test3" element={<Test3 />} />
            </>
          ) : (
            // Render a login component or redirect to a login page
            <Route path="/" element={<LoginCard />} />
          )}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
