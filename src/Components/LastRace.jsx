import React, { useEffect, useState } from "react";
import { getFormattedDate } from "../utils/utils";

const LastRace = () => {
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.jolpi.ca/ergast/f1/current/next.json")
      .then((res) => res.json())
      .then((data) => {
        const raceData = data.MRData.RaceTable.Races[0];
        setRace(raceData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!race) return <p>No race data found.</p>;

  return (
    <div className="text-success">
      <h2>Last Race {race.raceName}</h2>
      <p>
        <strong>Season:</strong> {race.season} <br />
        <strong>Round:</strong> {race.round}
      </p>
      <p>
        <strong>Circuit:</strong> {race.Circuit.circuitName} (
        {race.Circuit.Location.locality}, {race.Circuit.Location.country})
      </p>
      <hr />
      <h3>Sessions</h3>
      <ul>
        <li>
          <strong>First Practice:</strong>{" "}
          {getFormattedDate(race.FirstPractice)}
        </li>
        <li>
          <strong>Sprint Qualifying:</strong>{" "}
          {getFormattedDate(race.SprintQualifying)}
        </li>
        <li>
          <strong>Sprint:</strong> {getFormattedDate(race.Sprint)}
        </li>
        <li>
          <strong>Qualifying:</strong> {getFormattedDate(race.Qualifying)}
        </li>
        <li>
          <strong>Race:</strong> {getFormattedDate(race)}
        </li>
      </ul>
    </div>
  );
};

export default LastRace;
