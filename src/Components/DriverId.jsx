import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "./Loading";

export default function DriverId(props) {
  const [sdata, setData] = useState();
  const [isLoaded, setIsLoaded] = useState(false);

  //  console.log(props.ls);

  let url = `https://ergast.com/api/f1/drivers/${props.Id}.json`;

  useEffect(() => {
    axios.get(url).then((response) => {
      //console.log(response.data["MRData"]);
      setData(response.data["MRData"].DriverTable.Drivers[0]);
      setIsLoaded(true);
    });
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    if (props.ls === 1) {
      return (
        <>
          <span className="fs-5">{sdata?.givenName} </span>
          <span className="fs-5">
            {sdata?.familyName}({sdata?.permanentNumber}){" "}
          </span>
          <span>{sdata?.nationality} </span>
          <span>{sdata?.dateOfBirth} </span>
          <span className="fs-5">({sdata?.code})</span>
        </>
      );
    } else {
      return (
        <>
          <span className="fw-bold">{sdata?.givenName} </span>
          <span className="fw-bold">{sdata?.familyName}</span>
          <span className="fw-bold"> ({sdata?.permanentNumber})</span>
        </>
      );
    }
  }
}
