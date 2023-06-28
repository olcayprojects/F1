import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RaceSchedule = (props) => {
  const [sdata, setData] = useState([]);
  const navigate = useNavigate();

  const dateNow = new Date();

  console.log();

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
    <div className="bg-black container-fluid">
      <h1 className="text-center bg-black text-danger border border-danger border-5 mb-2">
        Race Schedule {props.season}
      </h1>
      <div className="table-responsive-sm">
      <table className="table table-dark table-striped">
          <thead className="text-danger tho">
            <tr className="text-black">
              <th className="text-center bg-danger">Rnd</th>
              <th className="bg-danger text-center">Race Name</th>
              <th className="bg-danger text-center">Race</th>
              <th className="text-center bg-danger">Sprint</th>
              <th className="bg-danger text-center">Qualifying</th>
              <th className="bg-danger text-center">Practice1</th>
              <th className="text-center bg-danger">Circuit</th>
            </tr>
          </thead>
          <tbody className="text-danger">
            {sdata?.map((rs, index) => {
              const title = "Click go to " + rs.raceName + " details ";

              const dateTime = (d, t) => new Date(d + " " + t);

              return (
                <tr className="col" key={index}>
                  <td className="col text-center">{rs.round}</td>
                  <td className="col text-nowrap">{rs.raceName}</td>
                  <td title={title} 
                    className={
                      "col-2 cp text-center text-nowrap " +
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
                        ? dateTime(rs.date, rs.time).toLocaleString()
                        : rs.time
                        ? dateTime(rs.date, rs.time).toLocaleString()
                        : rs.date}
                    </b>
                  </td>
                  <td className="col text-center text-nowrap">
                    {rs.Sprint?.time
                      ? dateTime(
                          rs.Sprint?.date,
                          rs.Sprint?.time
                        ).toLocaleString()
                      : rs.Sprint?.date}
                  </td>
                  <td className="col text-center text-nowrap">
                    {rs.Qualifying?.time
                      ? dateTime(
                          rs.Qualifying?.date,
                          rs.Qualifying?.time
                        ).toLocaleString()
                      : rs.Qualifying?.date}
                  </td>
                  <td className="col text-center text-nowrap">
                    {rs.FirstPractice?.time
                      ? dateTime(
                          rs.FirstPractice?.date,
                          rs.FirstPractice?.time
                        ).toLocaleString()
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
