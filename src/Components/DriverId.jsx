import React from "react";
import { useEffect, useState } from "react";

export default function DriverId(props) {
  const [sdata, setData] = useState([]);

  let url = "";

  url = `https://ergast.com/api/f1/drivers/${props.Id}.json`;


  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
       // console.log(data["MRData"].DriverTable.Drivers[0]);

        setData(data["MRData"].DriverTable.Drivers[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [url]);
  

  return(    
    // sdata.givenName+" "+sdata.familyName
    sdata.code
  )
  

     
}
