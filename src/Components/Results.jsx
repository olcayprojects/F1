import { useState, useCallback, useEffect } from "react";
import Loading from "./Loading";

import axios from "axios";

const Results = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sdata, setData] = useState([]);

  // const timeMS = (d) => new Date(d);
  //const { season2 = "2023" } = useParams();

  let url;
  if (props) {
    url = `https://ergast.com/api/f1/${props.season}/${props.rounds}/results.json`;
  }

  const fetchResultStandings = useCallback(() => {
    setIsLoaded(false);
    axios
      .get(url)
      .then((res) => {
        setData(res?.data["MRData"]?.RaceTable?.Races[0]);
      })
      .catch((e) => console.log(e), setIsLoaded(true))
      .finally(() => setIsLoaded(true));
  }, [url]);

  useEffect(() => {
    fetchResultStandings();
  }, [fetchResultStandings]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return sdata?.Results?.length > 0 ? (
      <table className="table table-dark table-striped table-bordered m-0">
        <caption className="text-center border border-danger border-5 text-danger caption-top">
          <span className="bg-dark text-light px-3 fs-5 fw-bold">
            #{sdata.round} {sdata.raceName}
          </span>
        </caption>
        <thead className="text-white border-dark">
          <tr className="text-black ">
            <th className="py-0">P</th>
            {/* <th className="text-center">NO</th> */}
            <th className="bg-danger text-start py-0">DRIVER</th>
            <th className="text-start py-0">CAR</th>
            <th className="bg-danger text-center py-0">LAP</th>
            <th className="text-center py-0">TIME</th>
            <th className="text-center bg-danger py-0">PT</th>
          </tr>
        </thead>
        <tbody>
          {sdata?.Results?.map((Results, index) => {
            return (
              <tr key={index} className="">
                <td className="p-0 ps-2 op text-danger fw-bold pe-1">
                  {Results.positionText}

                  {/* !isNaN(Results.positionText) ? (
                    Results.positionText
                  ) : (
                    <>
                      <span>{Results.position}</span>{"-"}
                      <span className="fw-light">{Results.positionText}</span>
                    </>
                  )*/}
                </td>
                {/* <td className="p-0 ps-3">{Results.number}</td> */}
                <td className="p-0 fw-bold text-warning">
                  {Results.Driver.givenName?.substring(0, 1)}.{""}
                  {Results.Driver.familyName.toUpperCase()}
                </td>
                <td className="p-0 ps-1 op">{Results.Constructor.name}</td>
                <td className="p-0 text-center">{Results.laps}</td>
                <td className="text-center p-0 op">
                  {Results?.Time?.time ? (
                    Results?.Time.time
                  ) : Results?.status[0] === "+" ? (
                    <span className="text-secondary">{Results?.status}</span>
                  ) : (
                    <span className="text-danger text-uppercase">
                      {Results?.status}
                    </span>
                  )}
                </td>
                <td className="text-center p-0">{Results?.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : null;
  }
};

export default Results;
