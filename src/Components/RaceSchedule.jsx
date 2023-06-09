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
    <div className="bg-black container-fluid p-0">
      <h2 className="text-center bg-black text-danger border border-danger border-5 mb-2">
        F1 Schedule {props.season}
      </h2>
      <div className="table-responsive-sm">
        <table className="table table-dark table-striped">
          <thead className="text-danger tho">
            <tr className="text-black">
              <th className="text-center">Rnd</th>
              <th className="bg-danger text-center">Race Name</th>
              <th className=" text-center">Race</th>
              <th className="text-center bg-info">Sprint</th>
              <th className="text-center">Qualifying</th>
              <th className="bg-danger text-center">Practice1</th>
              <th className="text-center">Circuit</th>
            </tr>
          </thead>
          <tbody className="text-danger">
            {sdata?.map((rs, index) => {
              const title = "Click go to " + rs.raceName + " details ";

              const dateTime = (d, t) => new Date(d + " " + t);

              return (
                <tr className="col" key={index}>
                  <td className="col text-center">{rs.round}</td>
                  <td className="col text-nowrap op"><b>{rs.raceName}</b></td>
                  <td
                    title={title}
                    className={
                      "col cp text-center text-nowrap " +
                      (dateTime(rs.date, rs.time) < dateNow
                        ? "raceComplete text-danger"
                        : (rs.date.split("-")[1] ===
                            dateNow.toISOString().split("T")[0].split("-")[1]) &
                          (props.season === "2023")
                        ? "  text-center"
                        : "")
                    }
                    onClick={() =>
                      dateTime(rs.date, rs.time) < dateNow ||
                      props.season !== "2023"
                        ? navigate("/F1Race/" + props.season + "/" + rs.round)
                        : navigate("/RaceInfo/" + rs.date + "/" + rs.raceName)
                    }
                  >
                    <b>
                      {" "}
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
                        : rs.date}
                    </b>
                  </td>
                  <td
                    className="col text-center text-nowrap cp text-info op"
                    onClick={() =>
                      navigate("/Sprint/" + props.season + "/" + rs.round)
                    }
                  >
                    {rs.Sprint?.time
                      ? dateTime(
                          rs.Sprint?.date,
                          rs.Sprint?.time
                        ).toLocaleString("tr-TR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : rs.Sprint?.date}
                  </td>
                  <td className="col text-center text-nowrap">
                    {rs.Qualifying?.time
                      ? dateTime(
                          rs.Qualifying?.date,
                          rs.Qualifying?.time
                        ).toLocaleString("tr-TR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : rs.Qualifying?.date}
                  </td>
                  <td className="col text-center text-nowrap op">
                    {rs.FirstPractice?.time
                      ? dateTime(
                          rs.FirstPractice?.date,
                          rs.FirstPractice?.time
                        ).toLocaleString("tr-TR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : rs.FirstPractice?.date}
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
      <hr />
    </div>
  );
};

export default RaceSchedule;
