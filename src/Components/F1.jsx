import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import QualifyingResults from "./QualifyingResults";
import WinRacesInaSeason from "./WinRacesInaSeason";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import Pitstops from "./Pitstops";
import Next from "./Next";
import Laptimes from "./Laptimes";
import Images from "./Images";
import RaceSchedule from "./RaceSchedule";
import F1Race from "./F1Race";


const F1 = () => {
  const [sdata, setData] = useState([]);
  let season = "";
  let round = "";
  let laps = "";
  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();
  const date = (d) => new Date(d).toDateString();

  const year = new Date().getFullYear();
  const years = Array.from(new Array(74), (val, index) => year - index);

  useEffect(() => {
    fetch("https://ergast.com/api/f1/current/last/results.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <div className="container.fluid bg-dark p-3">
        <Next />
        <F1Race/>
        <select
          className="form-select bg-dark text-danger border-danger shadow-none"
          onChange={(e) => {
            navigate(`/F1/${e.target.value}`);
            navigate(0);
          }}
        >
          <option value="" hidden>
            Select Year for Drivers and Constructors Winning Races In a Season
          </option>
          {years.map((year, index) => {
            return (
              <option key={`year${index}`} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <RaceSchedule season={season2} />
        <WinRacesInaSeason season={season2} />
        <DriverStandings season={season2} round={round} />
        <ConstructorStandings season={season2} round={round} />

      </div>
      
  
    </>
  );
};

export default F1;
