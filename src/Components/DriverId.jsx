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
    // return <Loading />;
    return <span>{props.Id}</span>;
  } else {
    if (props.ls === 1) {
      return (
        <>
          <span className="pe-1">({sdata?.code})</span>
          <span className="fs-5 p-1 bg-black"> {sdata?.givenName} </span>
          <span className="fs-5 p-1 bg-black">{sdata?.familyName} </span>
          <span className="ps-1">({sdata?.permanentNumber})</span>
          {/* <span>{sdata?.nationality} </span> */}
          {/* <span>{sdata?.dateOfBirth} </span> */}
        </>
      );
    } else {
      return (
        <>
          <span className="">{sdata?.givenName.substring(0, 1)}.</span>
          <span className="">{sdata?.familyName}</span>
          {/* <span className=""> ({sdata?.permanentNumber})</span> */}
        </>
      );
    }
  }
}
