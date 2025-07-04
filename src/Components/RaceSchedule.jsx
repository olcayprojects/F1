import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RaceThumb } from "./RaceInfo";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";

import { fetchRaceSchedule } from "../redux/raceScheduleSlice";
import {
  thisYear,
  getFormattedDate,
  isUpcoming,
  shouldShowThumb,
  dateTime,
} from "../utils/utils";

const RaceSchedule = ({ season }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { races, isLoading, error } = useSelector((state) => state.schedule);

  const [showImage, setShowImage] = useState(true);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (season) {
      dispatch(fetchRaceSchedule(season));
    }
  }, [dispatch, season]);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-danger">Hata: {error}</div>;

  return (
    <div className="bg-black container-fluid p-0">
      <div className="text-center bg-black text-danger m-0 p-0 border border-danger border-5 bg-gradient">
        <h1 className="fw-bold m-0">F1 Schedule {season}</h1>
        <h6 className="fw-bold m-0">
          {season} FIA FORMULA ONE WORLD CHAMPIONSHIP™ RACE CALENDAR
        </h6>
      </div>
      <div className="table-responsive">
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
              const showThumb = shouldShowThumb(race.date, thisYear);

              const isCurrentMonthThisYear =
                raceDate.getFullYear() === today.getFullYear() &&
                raceDate.getMonth() === today.getMonth();

              const rowClass = `align-middle ${
                showThumb
                  ? "text-center fw-bold fst-italic"
                  : isFuture && season === thisYear
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
                  <td className="text-center align-middle">{race.round}</td>

                  <td
                    className={`text-nowrap op fw-bold text-warning py-0 ${
                      season === thisYear ? "col-2" : ""
                    } ${
                      isCurrentMonthThisYear
                        ? "text-center border border-3 border-danger"
                        : "text-start"
                    }`}
                  >
                    {/* {showImage ? (
                      <RaceThumb
                        date={race.date}
                        name={race.raceName}
                        onError={() => setShowImage(false)}
                      />
                    ) : (
                      ""
                    )} */}
                    <h5 className="bg-black bg-gradient m-0">
                      {race.raceName}
                    </h5>
                    <h6
                      className="m-0 cp text-info"
                      onClick={() =>
                        navigate(`/Circuit/${race.Circuit.circuitId}`)
                      }
                    >
                      {race.Circuit.circuitName}
                    </h6>
                  </td>

                  <td
                    title={title}
                    className="py-0 text-center text-nowrap cp"
                    onClick={() =>
                      dateTime(race.date, "00:00") <= today
                        ? navigate(`/F1Race/${season}/${race.round}`)
                        : navigate(`/RaceInfo/${race.date}/${race.raceName}`)
                    }
                  >
                    <span
                      className={`p-2 ${
                        showThumb
                          ? "text-black bg-gradient bg-danger"
                          : "bg-black bg-gradient "
                      }`}
                    >
                      {getFormattedDate(race)}
                    </span>
                  </td>

                  <td
                    className="text-nowrap text-center cp"
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
                    className={`text-nowrap text-center text-info op ${
                      race.Sprint ? "cp" : "ch"
                    } ${isFuture ? "fw-bold" : ""}`}
                    onClick={() =>
                      race.Sprint &&
                      navigate(
                        `/Sprint/${season}/${
                          race.round
                        }/${race.Sprint.date.replace("/", "-")}`
                      )
                    }
                  >
                    {race.Sprint ? getFormattedDate(race.Sprint) : "-"}
                  </td>

                  <td className="text-nowrap text-center text-info op">
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

                  <td className="text-nowrap text-center op p-0">
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
    </div>
  );
};

export default RaceSchedule;
