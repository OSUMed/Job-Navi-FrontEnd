import React from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "./Components/Dashboard";
import Contacts from "./Components/Contacts";
import Applications from "./Components/Applications";
import Notes from "./Components/Notes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="applications" element={<Applications />} />
        <Route path="notes" element={<Notes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
