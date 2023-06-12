import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";

import F1 from "./F1";
import F1Race from "./F1Race";
import ResultsDriver from "./ResultsDriver";



const Components = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/F1/:season2" element={<F1 />} />
        <Route path="/" element={<F1 />} />
        <Route path="/F1Race/:season2/:rounds" element={<F1Race />} />
        <Route path="/ResultsDriver/:season2/:driver" element={<ResultsDriver />} />
      </Routes>
    </HashRouter>
  );
};

export default Components;
