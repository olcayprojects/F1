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
          {/* <span className="pe-1">{sdata?.code}</span> */}
          <span className="p-1 bg-black">
            {sdata?.givenName} {sdata?.familyName}
          </span>
          <span className="bg-info p-1 px-2 text-black">
            {sdata?.permanentNumber}
          </span>
          {/* <span>{sdata?.nationality} </span> */}
          {/* <span>{sdata?.dateOfBirth} </span> */}
        </>
      );
    } else if (props.ls === 2) {
      return (
        <div className="fw-bold">
          <span className="bg-black text-info fs-4">{sdata?.givenName} </span>
          <span className="bg-black text-success fs-4">
            {sdata?.familyName}{" "}
          </span>
          <span className="bg-black text-success me-1 fs-4">
            {" "}
            ({sdata?.permanentNumber}){" "}
          </span>
          <span>{sdata?.nationality} </span>
          <span>{new Date(sdata?.dateOfBirth).toDateString()} </span>
        </div>
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
