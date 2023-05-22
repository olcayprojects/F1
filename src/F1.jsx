import react, { useEffect, useState } from "react";

const F1 = () => {
  const [sdata, setData] = useState([]);

  useEffect(() => {
    fetch("http://ergast.com/api/f1/current/last/results.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data["MRData"].RaceTable.Races);
        //  console.log(data["MRData"].RaceTable.Races[0].raceName);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <>
      <div className="container">
        {sdata?.map((item) => {
          return (
            <>
              {console.log(item)}
              <h1>
                {" "}
                {item.season} {item.raceName} #{item.round}
              </h1>
              <div class="table-responsive">
                <table className="table table-striped table-dark table-bordered  table-hover ">
                  <thead></thead>
                  <tbody>
                    {item.Results.map((result) => {
                      // console.log(result);

                      return (
                        <tr className="tableRow">
                          <td>{result.position}</td>
                          <td>{result.Driver.code}</td>
                          <td>
                            {result.Driver.givenName} {result.Driver.familyName}
                          </td>
                          <td>
                            {result.Time?.time ? result.Time.time : "00.00"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default F1;
