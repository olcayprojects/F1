import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RaceThumb } from "./RaceInfo";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RaceSchedule = (props) => {
  const [sdata, setData] = useState([]);
  const navigate = useNavigate();

  const dateNow = new Date();
  dateNow.setDate(dateNow.getDate());

  const dateTime = (d, t) => new Date(d + " " + t);

  const getFormattedDate = (event) => {
    if (!event) return "-";

    const { date, time } = event;
    if (time) {
      return dateTime(date, time).toLocaleString("en", {
        // weekday: "short",
        month: "2-digit",
        day: "2-digit",
        hourCycle: "h23",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date;
  };

  let url = "";
  if (props.season) {
    url = `${BASE_URL}/${props.season}.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid table-responsive p-0">
      <div className="text-center bg-black text-danger border-top border-start border-end border-danger border-5 m-0 p-0">
        <h1 className="m-0 p-0">F1 Schedule {props.season}</h1>
        <h6 className="m-0 p-0">
          {props.season} FIA FORMULA ONE WORLD CHAMPIONSHIP™ RACE CALENDAR
        </h6>
      </div>
      <table className="myTable table table-dark table-striped table-bordered border-dark">
        <thead className="">
          <tr className="text-black">
            <th className="text-center px-0">R</th>
            <th className="bg-danger text-center">Race Name</th>
            <th className=" text-center text-black bg-light op">Race Date</th>
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
          {sdata?.map((rs, index) => {
            const title = "Click go to " + rs.raceName + " details ";
            const titleSprint =
              "Click go to " + rs.raceName + " Sprint details ";

            const resultSprintQualifyingShootout = rs.SprintQualifying
              ? getFormattedDate(rs.SprintQualifying)
              : rs.SprintShootout
              ? getFormattedDate(rs.SprintShootout)
              : "-";

            return (
              <tr
                className={
                  "align-middle  " +
                  ((rs.date.split("-")[1] ===
                    dateNow.toISOString().split("T")[0].split("-")[1]) &
                  (rs.date.split("-")[2] >=
                    dateNow.toISOString().split("T")[0].split("-")[2]) &
                  (props.season === "2025")
                    ? " text-center fw-bold table-dark fst-italic"
                    : rs.date.split("-")[1] ===
                      dateNow.toISOString().split("T")[0].split("-")[1]
                    ? " text-center fw-bold"
                    : " ")
                }
                key={index}
              >
                <td className="text-center p-0 align-middle">{rs.round}</td>
                <td
                  className={
                    "text-nowrap op fw-bold text-warning py-0 " +
                    (props.season === "2025" ? "col-2" : "")
                  }
                >
                  {props.season === "2025" ? (
                    (rs.date.split("-")[1] ===
                      dateNow.toISOString().split("T")[0].split("-")[1]) &
                    (rs.date.split("-")[2] >=
                      dateNow.toISOString().split("T")[0].split("-")[2]) ? (
                      <>
                        <RaceThumb date={rs.date} name={rs.raceName} />
                        <h6 className="m-0">{rs.raceName}</h6>
                        <h6
                          className="m-0 cp text-info"
                          onClick={() =>
                            navigate("/Circuit/" + rs.Circuit.circuitId)
                          }
                        >
                          {rs.Circuit.circuitName}
                        </h6>
                      </>
                    ) : (
                      <>
                        <span className="">{rs.raceName}</span>
                        <i className="text-danger bi bi-slash-lg"></i>
                        <span
                          className="cp text-info"
                          onClick={() =>
                            navigate("/Circuit/" + rs.Circuit.circuitId)
                          }
                        >
                          {rs.Circuit.circuitName}
                        </span>
                      </>
                    )
                  ) : (
                    <>
                      <span className="">{rs.raceName}</span>
                      <i className="text-danger bi bi-slash-lg"></i>
                      <span
                        className="cp text-info"
                        onClick={() =>
                          navigate("/Circuit/" + rs.Circuit.circuitId)
                        }
                      >
                        {rs.Circuit.circuitName}
                      </span>
                    </>
                  )}
                </td>
                <td
                  title={title}
                  className={
                    "p-0 py-0 text-center text-nowrap cp " +
                    ((rs.date.split("-")[1] ===
                      dateNow.toISOString().split("T")[0].split("-")[1]) &
                    (props.season === new Date().getFullYear())
                      ? "text-center fw-bold fst-normal"
                      : (dateTime(rs.date, rs.time) < dateNow) |
                        (new Date(rs.date) < dateNow)
                      ? "fw-bold text-center p-0"
                      : "text-center")
                  }
                  onClick={() => {
                    dateTime(rs.date, "00:00") <=
                    new Date().setHours(0, 0, 0, 0)
                      ? navigate("/F1Race/" + props.season + "/" + rs.round)
                      : navigate("/RaceInfo/" + rs.date + "/" + rs.raceName);
                  }}
                >
                  {dateTime(rs.date, rs.time) < dateNow
                    ? getFormattedDate(rs)
                    : rs.time
                    ? dateTime(rs.date, rs.time).toLocaleString("en", {
                        // weekday: "short",
                        month: "2-digit",
                        day: "2-digit",
                        // year: "numeric",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date(rs.date).toDateString()}
                </td>
                <td
                  className="text-nowrap text-center cp p-0"
                  onClick={() =>
                    navigate(
                      "/Event/" +
                        rs.raceName.replace(/ /g, "_") +
                        "_Qualifying/" +
                        props.season +
                        "/" +
                        rs.round
                    )
                  }
                >
                  {rs.Qualifying
                    ? rs.Qualifying?.time
                      ? getFormattedDate(rs.Qualifying)
                      : rs.Qualifying?.date
                    : "-"}
                </td>
                <td
                  title={titleSprint}
                  className={
                    "text-nowrap text-center p-0 text-info op " +
                    (rs.Sprint ? "cp" : "ch") +
                    " " +
                    (dateTime(rs.date, rs.time) < dateNow
                      ? "fw-bold"
                      : //  ? "fw-bold text-decoration-line-through"
                        null)
                  }
                  onClick={() =>
                    rs.Sprint
                      ? navigate(
                          "/Sprint/" +
                            props.season +
                            "/" +
                            rs.round +
                            "/" +
                            dateTime(
                              rs.Sprint?.date,
                              rs.Sprint?.time
                            ).toLocaleString("en", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })
                        )
                      : null
                  }
                >
                  {rs.Sprint
                    ? rs.Sprint?.time
                      ? getFormattedDate(rs.Sprint)
                      : rs.Sprint?.date
                    : "-"}
                </td>
                <td
                  title={titleSprint}
                  className={
                    "text-nowrap text-center p-0 text-info op " +
                    (rs.Sprint ? "cp" : "ch") +
                    " " +
                    (dateTime(rs.date, rs.time) < dateNow
                      ? "fw-bold"
                      : //  ? "fw-bold text-decoration-line-through"
                        null)
                  }
                >
                  {resultSprintQualifyingShootout}
                </td>

                <td className="text-nowrap text-center op p-0">
                  {rs.FirstPractice
                    ? rs.FirstPractice?.time
                      ? getFormattedDate(rs.FirstPractice)
                      : rs.FirstPractice?.date
                    : "-"}
                </td>
                <td className="text-nowrap text-center p-0">
                  {rs.SecondPractice
                    ? rs.SecondPractice?.time
                      ? getFormattedDate(rs.SecondPractice)
                      : rs.SecondPractice?.date
                    : "-"}
                </td>
                <td className="text-nowrap text-center p-0 op">
                  {rs.ThirdPractice
                    ? rs.ThirdPractice?.time
                      ? getFormattedDate(rs.ThirdPractice)
                      : rs.ThirdPractice?.date
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
