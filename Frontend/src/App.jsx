import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import InterfacePage from "./Pages/InterfacePage";
import DatasetOverview from "./Components/DatasetOverview";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InterfacePage />} />
        <Route path="/Dashboard" element={<DatasetOverview />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;