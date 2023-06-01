import react, { useEffect, useState } from "react";
import {} from "@fortawesome/fontawesome-free"

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
        console.log(err.message);
      });
  }, [url]);

  return (
    <div className="bg-black container-fluid">
      <h1 className="text-center bg-black text-danger border border-danger border-5">
        Qualifying Results
      </h1>
      <table className="table table-dark bg-dark table-bordered table-hover text-danger border border-danger border-5">
        <thead className="text-white">
          <tr>
            <th className="text-center">Pos</th>
            <th className="text-center">No</th>
            <th className="text-center">Driver</th>
            <th className="text-center">Constructor</th>
            <th className="text-center">Q1</th>
            <th className="text-center">Q2</th>
            <th className="text-center">Q3</th>
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
                    <td className=" text-center col">{qualifying.Q2}</td>
                    <td className=" text-center col">{qualifying.Q3}</td>
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
      <hr />
    </div>
  );
};

export default QualifyingResults;
