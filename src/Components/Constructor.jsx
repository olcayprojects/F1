import React from "react";
import { useEffect, useState } from "react";
import Loading from "./Loading";

const Constructor = (props) => {
  let url = `https://ergast.com/api/f1/${props.year}/constructors.json`;

  const [sdata, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((items) => {
          setIsLoaded(true);

          setData(items["MRData"]?.ConstructorTable?.Constructors);
        })
        .catch((err) => {
          console.log("Hata:", err.message);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, [url]);

  if (!isLoaded) {
    return <Loading />;
  } else {
    return sdata?.map((item, index) => {
      return (
        <option key={index} value={item.constructorId}>
          {item?.name + " " + props.year}
        </option>
      );
    });
  }
};

export default Constructor;
