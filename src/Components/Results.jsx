import { useState, useCallback, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loading from "./Loading";

import axios from "axios";

const Results = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sdata, setData] = useState([]);

  let navigate = useNavigate();

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
      .catch((e) => console.log(e))
      .finally(() => setIsLoaded(true));
  }, [url]);

  useEffect(() => {
    fetchResultStandings();
  }, [fetchResultStandings]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return sdata?.Results?.length > 0 ? (
      <table className="table table-dark table-striped table-bordered">
        <caption className="text-center bg-dark text-danger caption-top">
          <b className="bg-secondary fs-5 text-light px-2 p-1">
            #{sdata.round} {sdata.raceName}
          </b>
        </caption>
        <thead className="text-white border-dark">
          <tr className="text-black ">
            <th className="">P</th>
            {/* <th className="text-center">NO</th> */}
            <th className="bg-danger text-start">DRIVER</th>
            <th className="text-start">CAR</th>
            <th className="bg-danger text-center">LAP</th>
            <th className="text-center">TIME/RETIRED</th>
            <th className="text-center bg-danger">PT</th>
          </tr>
        </thead>
        <tbody>
          {sdata?.Results?.map((Results, index) => {
            return (
              <tr key={index} className="">
                <td className="p-0 ps-2 op text-danger fw-bold pe-1">
                  {Results.positionText}
                </td>
                {/* <td className="p-0 ps-3">{Results.number}</td> */}
                <td className="p-0 fw-bold text-warning">
                  {Results.Driver.givenName?.substring(0, 1)}.{""}
                  {Results.Driver.familyName}
                </td>
                <td className="p-0 ps-1 op">{Results.Constructor.name}</td>
                <td className="p-0 text-center">{Results.laps}</td>
                <td className="text-center p-0 op">
                  {Results?.Time?.time ? Results?.Time.time : Results?.status}
                </td>
                <td className="text-center p-0">{Results?.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    ) : (
      ""
    );
  }
};

export default Results;
