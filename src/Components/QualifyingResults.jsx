import react, { useEffect, useState } from "react";

const QualifyingResults = (props) => {
  const [sdata, setData] = useState([]);

  useEffect(() => {
    console.log(props.season);
    console.log(props.round);
    fetch(`https://ergast.com/api/f1/${props.season}/${props.round}/qualifying.json`)
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        // console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [props]);

  return (
    <div className="container-fluid">
          <h1 className="text-center">Qualifying Results</h1>
      <table className="table table-striped table-dark table-bordered  table-hover">
        {sdata?.map((item, index) => {
          return (
              <>
              <thead>
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
              <tbody>
                {item.QualifyingResults.map((qualifying, indexQ) => {
                  return (
                    <tr>
                      <th scope="row">{qualifying.position}</th>
                      <td>{qualifying.number}</td>
                      <td>
                        {qualifying.Driver.givenName}{" "}
                        {qualifying.Driver.familyName}
                      </td>
                      <td>{qualifying.Constructor.name}</td>
                      <td className=" text-center">{qualifying.Q1}</td>
                      <td className=" text-center">{qualifying.Q2}</td>
                      <td className=" text-center">{qualifying.Q3}</td>
                    </tr>
                  );
                })}
              </tbody>
            </>
          );
        })}
      </table>
    </div>
  );
};

export default QualifyingResults;
