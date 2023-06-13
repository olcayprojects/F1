import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WinRacesInaSeason from "./WinRacesInaSeason";
import DriverStandings from "./DriverStandings";
import ConstructorStandings from "./ConstructorStandings";
import Next from "./Next";
import RaceSchedule from "./RaceSchedule";
import F1Race from "./F1Race";
import Loading from "./Loading";

const F1 = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [sdata, setData] = useState([]);
  let round = "";
  let navigate = useNavigate();
  const { season2 = "2023" } = useParams();

  const year = new Date().getFullYear();
  const years = Array.from(new Array(74), (val, index) => year - index);

  useEffect(() => {
    fetch("https://ergast.com/api/f1/current/last/results.json")
      .then((response) => response.json())
      .then((data) => {
        setIsLoaded(true);

        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        setIsLoaded(true);

        console.log(err.message);
      });
  }, []);

  if (!isLoaded) {
    return <Loading />;
  } else {
  return (
    <>
      <div className="container.fluid bg-dark p-3">
        <Next />
        <RaceSchedule season={season2} />
        <F1Race/>
        <select
          className="form-select bg-dark text-danger border-danger shadow-none"
          onChange={(e) => {
            navigate(`/F1/${e.target.value}`);
            navigate(0);
          }}
        >
          <option value="" hidden>Select Year for Drivers and Constructors Winning Races In a Season 1950 - Now
          </option>
          {years.map((year, index) => {
            return (
              <option key={`year${index}`} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <WinRacesInaSeason season={season2} />
        <DriverStandings season={season2} round={round} />
        <ConstructorStandings season={season2} round={round} />

      </div>
      
  
    </>
  );}
};

export default F1;
