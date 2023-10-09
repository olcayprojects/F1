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
    <div className=" container p-0">
      <div className="table-responsive">
        <table className="table table-dark table-striped fs-5 table-bordered">
          <thead className="">
            <tr className="text-black">
              <th className="bg-danger text-center op">P</th>
              <th className="bg-danger text-center">NO</th>
              <th className="bg-danger op">D R I V E R</th>
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
                    <tr key={indexQ} className="align-middle">
                      <td className="p-0 text-center fs-5 op">
                        {qualifying.position < 4 ? (
                          <i
                            className={
                              "text-info bi bi-" +
                              qualifying.position +
                              "-square"
                            }
                          ></i>
                        ) : (
                          qualifying.position
                        )}
                      </td>
                      <td className="text-center p-0">{qualifying.number}</td>
                      <td className="col-5 op">
                        <b className="fs-5 text-info bg-black px-1 p-1">
                          {qualifying.Driver.givenName}{" "}
                          {qualifying.Driver.familyName}
                        </b>

                        <span className="fw-bold bg-opacity-75 fst-italic fs-5 text-black px-1 p-1 bg-info">
                          {qualifying.Constructor.name}
                        </span>
                      </td>
                      <td className="col-2 text-center fw-bold text-primary">
                        <span
                          className={
                            qualifying?.Q3
                              ? "bg-black px-5 p-2 fw-bolder align-middle"
                              : ""
                          }
                        >
                          {qualifying?.Q3}
                        </span>
                      </td>
                      <td className="col-2 text-center op">
                        <span
                          className={
                            qualifying?.Q2
                              ? "bg-black px-5 p-2 fw-bolder align-middle"
                              : ""
                          }
                        >
                          {qualifying?.Q2}
                        </span>
                      </td>
                      <td className="col-2 text-center fw-bolder align-middle">
                        <span
                          className={
                            qualifying?.Q1 ? "bg-secondary px-5 p-2" : ""
                          }
                        >
                          {qualifying?.Q1}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default QualifyingResults;
