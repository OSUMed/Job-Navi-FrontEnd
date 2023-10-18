import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./Components/Dashboard";
import Contacts from "./Components/Contacts";
import Applications from "./Components/Applications";
import Notes from "./Components/Notes";
import "tailwindcss/tailwind.css";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { LoginCard } from "./Components/auth/LoginCard";
import { LogoutCard } from "./Components/auth/LogoutCard";
import { Collapsible } from "./components/ui/collapsible";
import ContactsForm from "./components/ContactsForm";

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
            <Route path="test" element={<ContactsForm />} />
          </>
        ) : (
          // Render a login component or redirect to a login page
          <Route path="/" element={<LoginCard />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
