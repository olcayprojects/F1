import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RaceThumb } from "./RaceInfo";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RaceSchedule = ({ season }) => {
  const [races, setRaces] = useState([]);
  const navigate = useNavigate();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Günü normalize et

  const dateTime = (d, t) => new Date(`${d} ${t}`);

  const getFormattedDate = (event) => {
    if (!event) return "-";
    const fullDate = event.time
      ? dateTime(event.date, event.time)
      : new Date(event.date);
    return fullDate.toLocaleString("en", {
      month: "2-digit",
      day: "2-digit",
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isUpcoming = (raceDate) => {
    const race = new Date(raceDate);
    race.setHours(0, 0, 0, 0);
    return race >= today;
  };

  const shouldShowThumb = (raceDate) => {
    const d = new Date(raceDate);
    return (
      season === "2025" &&
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() >= today.getDate()
    );
  };

  useEffect(() => {
    if (!season) return;
    const url = `${BASE_URL}/${season}.json`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRaces(data?.MRData?.RaceTable?.Races || []);
      })
      .catch(console.error);
  }, [season]);

  return (
    <div className="bg-black container-fluid table-responsive p-0">
      <div className="text-center bg-black text-danger border-top border-start border-end border-danger border-5 m-0 p-0">
        <h1 className="m-0 p-0">F1 Schedule {season}</h1>
        <h6 className="m-0 p-0">
          {season} FIA FORMULA ONE WORLD CHAMPIONSHIP™ RACE CALENDAR
        </h6>
      </div>

      <table className="myTable table table-dark table-striped table-bordered border-dark m-0">
        <thead>
          <tr className="text-black">
            <th className="text-center px-0">R</th>
            <th className="bg-danger text-center">Race Name</th>
            <th className="text-center text-black bg-light op">Race Date</th>
            <th className="text-center bg-light text-black">Qualifying</th>
            <th className="text-center bg-info text-black">Sprint Date</th>
            <th className="text-center bg-info text-black op">
              Sprint Qualifying
            </th>
            <th className="bg-danger text-black text-center">Practice1</th>
            <th className="op text-center bg-danger text-black">Practice2</th>
            <th className="bg-danger text-black text-center">Practice3</th>
          </tr>
        </thead>

        <tbody className="text-danger">
          {races.map((race, index) => {
            const raceDate = new Date(race.date);
            const isFuture = isUpcoming(race.date);
            const showThumb = shouldShowThumb(race.date);

            const isCurrentMonthThisYear =
              raceDate.getFullYear() === today.getFullYear() &&
              raceDate.getMonth() === today.getMonth();

            const rowClass = `align-middle ${
              showThumb
                ? "text-center fw-bold table-dark fst-italic"
                : isFuture && season === "2025"
                ? "text-center fw-bold "
                : ""
            }`;

            const title = `Click to view ${race.raceName} details`;
            const sprintTitle = `Click to view ${race.raceName} Sprint details`;

            const resultSprintQual = race.SprintQualifying
              ? getFormattedDate(race.SprintQualifying)
              : race.SprintShootout
              ? getFormattedDate(race.SprintShootout)
              : "-";

            return (
              <tr className={rowClass} key={index}>
                <td className="text-center p-0 align-middle">{race.round}</td>

                <td
                  className={`text-nowrap op fw-bold text-warning py-0 ${
                    season === "2025" ? "col-2" : ""
                  } ${isCurrentMonthThisYear ? "text-end" : "text-start"}`}
                >
                  {showThumb ? (
                    <>
                      <RaceThumb date={race.date} name={race.raceName} />
                      <h6 className="m-0">{race.raceName}</h6>
                      <h6
                        className="m-0 cp text-info"
                        onClick={() =>
                          navigate(`/Circuit/${race.Circuit.circuitId}`)
                        }
                      >
                        {race.Circuit.circuitName}
                      </h6>
                    </>
                  ) : (
                    <>
                      <span>{race.raceName}</span>
                      <i className="text-danger bi bi-slash-lg"></i>
                      <span
                        className="cp text-info"
                        onClick={() =>
                          navigate(`/Circuit/${race.Circuit.circuitId}`)
                        }
                      >
                        {race.Circuit.circuitName}
                      </span>
                    </>
                  )}
                </td>

                <td
                  title={title}
                  className="p-0 py-0 text-center text-nowrap cp"
                  onClick={() =>
                    dateTime(race.date, "00:00") <= today
                      ? navigate(`/F1Race/${season}/${race.round}`)
                      : navigate(`/RaceInfo/${race.date}/${race.raceName}`)
                  }
                >
                  {getFormattedDate(race)}
                </td>

                <td
                  className="text-nowrap text-center cp p-0"
                  onClick={() =>
                    navigate(
                      `/Event/${race.raceName.replace(
                        / /g,
                        "_"
                      )}_Qualifying/${season}/${race.round}`
                    )
                  }
                >
                  {race.Qualifying ? getFormattedDate(race.Qualifying) : "-"}
                </td>

                <td
                  title={sprintTitle}
                  className={`text-nowrap text-center p-0 text-info op ${
                    race.Sprint ? "cp" : "ch"
                  } ${isFuture ? "fw-bold" : ""}`}
                  onClick={() =>
                    race.Sprint &&
                    navigate(
                      `/Sprint/${season}/${race.round}/${getFormattedDate(
                        race.Sprint
                      )}`
                    )
                  }
                >
                  {race.Sprint ? getFormattedDate(race.Sprint) : "-"}
                </td>

                <td className="text-nowrap text-center p-0 text-info op">
                  {resultSprintQual}
                </td>

                <td className="text-nowrap text-center op p-0">
                  {race.FirstPractice
                    ? getFormattedDate(race.FirstPractice)
                    : "-"}
                </td>

                <td className="text-nowrap text-center p-0">
                  {race.SecondPractice
                    ? getFormattedDate(race.SecondPractice)
                    : "-"}
                </td>

                <td className="text-nowrap text-center p-0 op">
                  {race.ThirdPractice
                    ? getFormattedDate(race.ThirdPractice)
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RaceSchedule;
