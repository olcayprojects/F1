import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RaceSchedule = (props) => {
  const [sdata, setData] = useState([]);
  const navigate = useNavigate();

  const dateNow= new Date();



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

        //console.log(data["MRData"].RaceTable.Races);
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
        <table className="table  table-bordered table-dark bg-dark table-hover h-100 border border-danger border-5">
          <thead className="border-dark">
            <tr className="text-black">
              <th className="text-center bg-danger">Rnd</th>
              <th className="bg-danger text-center">Race Name</th>
              <th className="bg-danger text-center">DATE</th>
              <th className="text-center bg-danger">Sprint</th>
              <th className="text-center bg-danger">Circuit</th>
            </tr>
          </thead>
          <tbody className="text-danger">
            {sdata?.map((rs, index) => {
              const title = "Click go to " + rs.raceName + " details ";

              const dateTime = (d, t) => new Date(d + " " + t);

              return (
                <tr
                  className="cp"
                  title={title}
                  key={index}
                 
                  onClick={() =>dateTime(rs.date,rs.time) <dateNow  ? navigate("/F1Race/" + props.season + "/" + rs.round):""}
                    
                   
                >
                  <td className="col text-center">{rs.round}</td>
                  <td className="col-3">{rs.raceName}</td>
                  <td className="col text-center">
                    {dateTime(rs.date,rs.time) > dateNow   ? dateTime(rs.date,rs.time).toLocaleString():<b>{dateTime(rs.date,rs.time).toLocaleString()}</b>}
                    {console.log(dateTime(rs.date,rs.time),"**",dateNow)}                 
                    
                  </td>
                  <td className="col text-center">{rs.Sprint?.date}</td>
                  <td className="col-5">{rs.Circuit.circuitName}</td>
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
