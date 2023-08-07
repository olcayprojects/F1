import { useEffect, useState } from "react";

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
    <div className="bg-black container-fluid p-0">
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead className="">
            <tr className="text-black">
              <th className="bg-danger text-center op">P</th>
              <th className="bg-danger text-center">NO</th>
              <th className="bg-danger op text-center">D R I V E R</th>
              <th className="text-center bg-danger">Q3</th>
              <th className="text-center bg-danger op">Q2</th>
              <th className="text-center bg-danger">Q1</th>
            </tr>
          </thead>
          {sdata?.map((item, index) => {
            return (
              <tbody key={index}>
                {item?.QualifyingResults?.map((qualifying, indexQ) => {
                  return (
                    <tr key={indexQ} className="">
                      <td className="text-center">{qualifying.position}</td>
                      <td className="text-center op">{qualifying.number}</td>
                      <td className="">
                        <b className="fs-5">
                          {qualifying.Driver.givenName}{" "}
                          {qualifying.Driver.familyName}
                        </b>
                        <span className="">
                          {" "}
                          {qualifying.Driver.nationality}{" "}
                        </span>
                        <i className="fw-lighter fs-5">
                          {qualifying.Constructor.name}{" "}
                        </i>
                        <span className="">
                          {qualifying.Constructor.nationality}
                        </span>
                      </td>

                      <td className="text-center op">
                        <b>{qualifying?.Q3}</b>
                      </td>
                      <td className=" text-center ">{qualifying?.Q2}</td>
                      <td className=" text-center op">{qualifying?.Q1}</td>
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
