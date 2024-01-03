import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RaceSchedule = (props) => {
  const [sdata, setData] = useState([]);
  const navigate = useNavigate();

  const dateNow = new Date();

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
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
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
            <th className="bg-danger text-center">Practice 1</th>
            <th className="text-center">Practice 2</th>
            <th className="bg-danger text-center">Practice 3</th>
            <th className="text-center">Circuit Name</th>
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
                  "align-middle col " +
                  ((rs.date.split("-")[1] ===
                    dateNow.toISOString().split("T")[0].split("-")[1]) &
                  (props.season === "2024")
                    ? " text-center fw-bold "
                    : " ")
                }
                key={index}
              >
                <td className="col text-center p-0 align-middle">{rs.round}</td>
                <td className="col text-nowrap op fw-bold text-warning">
                  <span
                    className="bg-black p-2"
                    style={{ fontFamily: "Lucida Console" }}
                  >
                    {rs.raceName}
                  </span>
                </td>
                <td
                  title={title}
                  className={
                    "col cp  text-nowrap " +
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
                    dateTime(rs.date, rs.time) < dateNow ||
                    props.season !== new Date().getFullYear()
                      ? navigate("/F1Race/" + props.season + "/" + rs.round)
                      : navigate("/RaceInfo/" + rs.date + "/" + rs.raceName)
                  }
                >
                  {dateTime(rs.date, rs.time) > dateNow
                    ? dateTime(rs.date, rs.time).toLocaleString("tr-TR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : rs.time
                    ? dateTime(rs.date, rs.time).toLocaleString("tr-TR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })
                    : new Date(rs.date).toLocaleDateString('tr-TR')}
                </td>
                <td
                  title={titleSprint}
                  className={
                    "col text-nowrap text-info op " +
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
                            ).toLocaleString("tr-TR", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                        )
                      : null
                  }
                >
                  {rs.Sprint?.time
                    ? dateTime(rs.Sprint?.date, rs.Sprint?.time).toLocaleString(
                        "tr-TR",
                        {
                          dateStyle: "short",
                          timeStyle: "short",
                        }
                      )
                    : rs.Sprint?.date}
                </td>
                <td className="col text-nowrap">
                  {rs.Qualifying?.time
                    ? dateTime(
                        rs.Qualifying?.date,
                        rs.Qualifying?.time
                      ).toLocaleString("tr-TR", {
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.Qualifying?.date}
                </td>
                <td className="col text-nowrap op">
                  {rs.FirstPractice?.time
                    ? dateTime(
                        rs.FirstPractice?.date,
                        rs.FirstPractice?.time
                      ).toLocaleString("tr-TR", {
                        month: "2-digit",
                        day: "2-digit",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.FirstPractice?.date}
                </td>
                <td className="col text-nowrap">
                  {rs.SecondPractice?.time
                    ? dateTime(
                        rs.SecondPractice?.date,
                        rs.SecondPractice?.time
                      ).toLocaleString("tr-TR", {
                        month: "2-digit",
                        day: "2-digit",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.SecondPractice?.date}
                </td>
                <td className="col text-nowrap op">
                  {rs.ThirdPractice?.time
                    ? dateTime(
                        rs.ThirdPractice?.date,
                        rs.ThirdPractice?.time
                      ).toLocaleString("tr-TR", {
                        // weekday: "short",
                        month: "2-digit",
                        day: "2-digit",
                        hourCycle: "h23",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : rs.ThirdPractice?.date}
                </td>
                <td
                  className="col cp text-nowrap"
                  onClick={() => navigate("/Circuit/" + rs.Circuit.circuitId)}
                >
                  {rs.Circuit.circuitName}
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
