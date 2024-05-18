import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RaceThumb } from "./RaceInfo";
import { Event } from "./Event";

const RaceSchedule = (props) => {
  const [sdata, setData] = useState([]);
  const navigate = useNavigate();

  const dateNow = new Date();
  dateNow.setDate(dateNow.getDate());

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}.json`;
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
    <div className="bg-black container-fluid table-responsive">
      <h1 className="text-center bg-black text-danger border border-danger border-5 mb-2">
        Schedule {props.season}
      </h1>
      <table className="table table-dark table-striped table-bordered">
        <thead className="">
          <tr className="text-black">
            <th className="text-center">R</th>
            <th className="bg-danger text-center">Race Name</th>
            <th className=" text-center">Race Date</th>
            <th className="text-center bg-info">Sprint Date</th>
            <th className="text-center">Qualifying</th>
            <th className="bg-danger text-center">Practice1</th>
            <th className="text-center">Practice 2</th>
            <th className="bg-danger text-center">Practice 3</th>
          </tr>
        </thead>
        <tbody className="text-danger">
          {sdata?.map((rs, index) => {
            const title = "Click go to " + rs.raceName + " details ";
            const titleSprint =
              "Click go to " + rs.raceName + " Sprint details ";

            const dateTime = (d, t) => new Date(d + " " + t);

            return (
              <tr
                className={
                  "align-middle " +
                  ((rs.date.split("-")[1] ===
                    dateNow.toISOString().split("T")[0].split("-")[1]) &
                  (props.season === "2024")
                    ? " text-center fw-bold bg-success border border-2 border-success"
                    : " ")
                }
                key={index}
              >
                <td className="text-center p-0 align-middle">{rs.round}</td>
                <td
                  className={
                    "text-nowrap op fw-bold text-warning py-0 " +
                    (props.season === "2024" ? "col-2" : "")
                  }
                >
                  {props.season === "2024" ? (
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
                    "cp p-0 px-1 py-0 text-center text-nowrap " +
                    (dateTime(rs.date, rs.time) < dateNow
                      ? "fw-bold"
                      : // ? "fw-bold text-decoration-line-through"
                      (rs.date.split("-")[1] ===
                          dateNow.toISOString().split("T")[0].split("-")[1]) &
                        (props.season === new Date().getFullYear())
                      ? "  text-center fw-bold fst-normal"
                      : null)
                  }
                  onClick={() =>
                    dateTime(rs.date, rs.time ? rs.time : "00:00:00Z") < dateNow
                      ? navigate("/F1Race/" + props.season + "/" + rs.round)
                      : navigate("/RaceInfo/" + rs.date + "/" + rs.raceName)
                  }
                >
                  {dateTime(rs.date, rs.time) > dateNow
                    ? dateTime(rs.date, rs.time).toLocaleString("en", {
                        weekday: "short",
                        month: "2-digit",
                        day: "2-digit",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.time
                    ? dateTime(rs.date, rs.time).toLocaleString("en", {
                        weekday: "short",
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date(rs.date).toDateString()}
                </td>
                <td
                  title={titleSprint}
                  className={
                    "text-nowrap text-center p-0 px-1 text-info op " +
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
                  {rs.Sprint?.time
                    ? dateTime(rs.Sprint?.date, rs.Sprint?.time).toLocaleString(
                        "en",
                        {
                          weekday: "short",
                          month: "2-digit",
                          day: "2-digit",
                          hourCycle: "h23",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : rs.Sprint?.date}
                </td>
                <td
                  className="text-nowrap text-center cp px-1 p-0"
                  onClick={() =>
                    navigate(
                      "/Event/" +
                        rs.raceName.replace(/ /g, "_") +
                        "_Qualifying/" +
                        props.season
                    )
                  }
                >
                  {rs.Qualifying?.time
                    ? dateTime(
                        rs.Qualifying?.date,
                        rs.Qualifying?.time
                      ).toLocaleString("en", {
                        weekday: "short",
                        month: "2-digit",
                        day: "2-digit",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.Qualifying?.date}
                </td>
                <td className="text-nowrap text-center op px-1 p-0">
                  {rs.FirstPractice?.time
                    ? dateTime(
                        rs.FirstPractice?.date,
                        rs.FirstPractice?.time
                      ).toLocaleString("en-EN", {
                        weekday: "short",
                        month: "2-digit",
                        day: "2-digit",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.FirstPractice?.date}
                </td>
                <td className="text-nowrap text-center px-1 p-0">
                  {rs.SecondPractice?.time
                    ? dateTime(
                        rs.SecondPractice?.date,
                        rs.SecondPractice?.time
                      ).toLocaleString("en", {
                        weekday: "short",
                        month: "2-digit",
                        day: "2-digit",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.SecondPractice?.date}
                </td>
                <td className="text-nowrap text-center p-0 op px-1">
                  {rs.ThirdPractice?.time
                    ? dateTime(
                        rs.ThirdPractice?.date,
                        rs.ThirdPractice?.time
                      ).toLocaleString("en", {
                        weekday: "short",
                        month: "2-digit",
                        day: "2-digit",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.ThirdPractice?.date}
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
