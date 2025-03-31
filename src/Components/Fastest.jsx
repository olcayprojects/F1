import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Fastest = (props) => {
  const [sdata, setData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  const url = `${BASE_URL}/${props.season}/fastest/1/results.json`;

  const fetchFastest = useCallback(async () => {
    try {
      const res = await axios.get(url);
      setData(res?.data?.MRData?.RaceTable?.Races);
      setIsLoaded(true);
    } catch (e) {
      if (e.response && e.response.status === 429) {
        console.log("Too many requests. Waiting 5 seconds before retrying...");
        setError("Too many requests. Please try again later.");
        setTimeout(fetchFastest, 5000);
      } else {
        console.log("Error fetching data: ", e);
        setError("An error occurred while fetching the data.");
        setIsLoaded(true);
      }
    }
  }, [url]);

  const getFastestLapForRound = (round) => {
    if (!sdata || !Array.isArray(sdata)) return null;
    console.log(sdata);
    const race = sdata.find((race) => race.round === round);
    return race ? race.Results[0] : null;
  };

  useEffect(() => {
    fetchFastest();
  }, [fetchFastest]);

  if (!isLoaded) {
    return <h6>Loading...</h6>;
  }

  const roundData = getFastestLapForRound(props.round);

  return (
    <div>
      {error ? (
        <span className="text-danger fw-bold">{error}</span>
      ) : roundData ? (
        <h6 className="text-info m-0">
          Fastest Lap: {roundData?.laps} | {roundData?.FastestLap?.Time?.time} |{" "}
          {roundData?.FastestLap?.AverageSpeed?.speed}{" "}
          {roundData?.FastestLap?.AverageSpeed?.units}{" "}
          <u>{roundData?.Driver?.familyName}</u>
        </h6>
      ) : (
        <span className="text-danger fw-bold">Fastest Lap Data Not Found!</span>
      )}
    </div>
  );
};

export default Fastest;
