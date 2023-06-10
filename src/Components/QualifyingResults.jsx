import react, { useEffect, useState } from "react";
import {} from "@fortawesome/fontawesome-free";

const QualifyingResults = (props) => {
  const [sdata, setData] = useState([]);

  let url = "";
  if (props.season) {
    url = `https://ergast.com/api/f1/${props.season}/${props.round}/qualifying.json`;
  }

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        if (!err === "Unexpected token") {
          console.log(err.message);
        }
      });
  }, [url]);

  return (
    
    <div className="bg-black container-fluid">
      <h1 className="text-center bg-black text-danger border border-danger border-5">
        Qualifying Results
      </h1>
      <div className="table-responsive">
      <table className="table table-dark bg-dark table-bordered table-hover text-danger border border-danger border-5">
        <thead className="border-dark">
          <tr className="text-black">
            <th className="bg-danger">P</th>
            <th className="bg-danger">NO</th>
            <th className="text-center bg-danger">DRIVER</th>
            <th className="text-center bg-danger">CONSTRUCTOR</th>
            <th className="text-center bg-danger">Q1</th>
            <th className="text-center bg-danger">Q2</th>
            <th className="text-center bg-danger">Q3</th>
          </tr>
        </thead>
        {sdata?.map((item, index) => {
          return (
            <tbody key={index}>
              {item?.QualifyingResults?.map((qualifying, indexQ) => {
                return (
                  <tr key={indexQ}>
                    <th className="col" scope="row">
                      {qualifying.position}
                    </th>
                    <td className="col">{qualifying.number}</td>
                    <td className="col-4">
                      {qualifying.Driver.givenName}{" "}
                      {qualifying.Driver.familyName}
                    </td>
                    <td className="col-4">{qualifying.Constructor.name}</td>
                    <td className=" text-center col">{qualifying.Q1}</td>
                    <td className=" text-center col">
                      {qualifying.Q2 ? qualifying.Q2 : "0:00.000"}
                    </td>
                    <td className=" text-center col">
                      {qualifying.Q3 ? qualifying.Q3 : "0:00.000"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
      </div>
      <hr />
    </div>
  );
};

export default QualifyingResults;
