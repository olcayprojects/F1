import { HashRouter,BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import F1 from "./F1";

const Components = () => {
  return (
  <HashRouter>
      <Routes>
        <Route path="/F1/:season2" element={<F1 />} />
        <Route path="/" element={<F1 />} />
      </Routes>
  </HashRouter>
  );
};

export default Components;
