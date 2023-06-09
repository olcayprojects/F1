import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import F1 from "./F1";

const Components = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/F1/:season2" element={<F1 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Components;
