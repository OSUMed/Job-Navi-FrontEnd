import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "tailwindcss/tailwind.css";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { LoginCard } from "./Components/auth/LoginCard";

// Lazily load the Dashboard component
const Dashboard = React.lazy(() => import("./Components/Dashboard"));
const Contacts = React.lazy(() => import("./Components/Contacts"));
const Applications = React.lazy(() => import("./Components/Applications"));
const Notes = React.lazy(() => import("./Components/Notes"));
const LogoutCard = React.lazy(() =>
  import("./Components/auth/LogoutCard").then((module) => ({
    default: module.LogoutCard,
  }))
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<Applications />} />
              <Route
                path="contacts"
                element={<Contacts cookie={{ session: "" }} />}
              />
              <Route path="applications" element={<Applications />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="notes" element={<Notes />} />
              <Route path="logout" element={<LogoutCard />} />
            </>
          ) : (
            <Route path="/" element={<LoginCard />} />
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
