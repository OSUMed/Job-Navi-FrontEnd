import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Contacts from "./components/Contacts";
import Applications from "./components/Applications";
import Notes from "./components/Notes";
import "tailwindcss/tailwind.css";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { LoginCard } from "./components/auth/LoginCard";
import { LogoutCard } from "./components/auth/LogoutCard";
import Header from "./components/NaviBar";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import UserNav from "./components/UserNav";

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
    <Theme>
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
              <Route path="test" element={<Header />} />
              <Route path="test2" element={<UserNav />} />
            </>
          ) : (
            // Render a login component or redirect to a login page
            <Route path="/" element={<LoginCard />} />
          )}
        </Routes>
      </BrowserRouter>
    </Theme>
  );
};

export default App;
