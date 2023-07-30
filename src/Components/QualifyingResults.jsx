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
              <th className="bg-danger op">DRIVER</th>
              <th className="text-center bg-danger">Q1</th>
              <th className="text-center bg-danger op">Q2</th>
              <th className="text-center bg-danger">Q3</th>
            </tr>
          </thead>
          {sdata?.map((item, index) => {
            return (
              <tbody key={index}>
                {item?.QualifyingResults?.map((qualifying, indexQ) => {
                  return (
                    <tr key={indexQ} className="bg-danger">
                      <td className="col text-center">
                        {qualifying.position}
                      </td>
                      <td className="col text-center op">{qualifying.number}</td>
                      <td className="col">
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

                      <td className=" text-center col op">{qualifying.Q1}</td>
                      <td className=" text-center col">
                        {qualifying.Q2 ? qualifying.Q2 : ""}
                      </td>
                      <td className="text-center col op">
                        <b>

                        {qualifying.Q3 ? qualifying.Q3 : ""}
                        </b>
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
