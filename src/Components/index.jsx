import { HashRouter,  Routes, Route } from "react-router-dom";
import React from "react";

import F1 from "./F1";
import F1Race from "./F1Race";
import ResultsDriver from "./ResultsDriver";
import RaceInfo from "./RaceInfo";
import Circuit from "./Circuit";
import Sprint from "./Sprint";
import Laps from "./Laps";
import ConstructorsResult from "./ConstructorsResult";
import Results from "./Results";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import Event from "./Event";
import  RaceHistoryChart  from "./RaceHistoryChart";

const Components = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/F1/:season2" element={<F1 />} />
        <Route path="/" element={<F1 />} />
        <Route path="/F1Race/:season2/:rounds" element={<F1Race />} />
        <Route path="/RaceInfo/:date/:name" element={<RaceInfo />} />
        <Route path="/ResultsDriver/:driver" element={<ResultsDriver />} />
        <Route path="/Circuit/:cname" element={<Circuit />} />
        <Route
          path="/Sprint/:season2/:rounds/:sprintDate"
          element={<Sprint />}
        />
        <Route path="/Laps/:drvname/:season/:rounds" element={<Laps />} />
        <Route
          path="/ConstructorsResult/:constructors/:season/"
          element={<ConstructorsResult />}
        />
        <Route path="/Results/:season2/:rounds" element={<Results />} />
        <Route path="/DriverStandings" element={<DriverStandings />} />
        <Route
          path="/ConstructorStandings"
          element={<ConstructorStandings />}
        />
        <Route path="/Event/:name/:date/:round" element={<Event />} />
        <Route path="/RaceHistoryChart" element={<RaceHistoryChart />} />
      </Routes>
    </HashRouter>
  );
};

export default Components;
