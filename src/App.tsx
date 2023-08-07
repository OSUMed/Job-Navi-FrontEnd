import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Contacts from "./components/Contacts";
import Applications from "./components/Applications";
import Notes from "./components/Notes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="contacts"
          element={
            <Contacts
              cookie={{
                session: "",
              }}
            />
          }
        />
        <Route path="applications" element={<Applications />} />
        <Route path="notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
