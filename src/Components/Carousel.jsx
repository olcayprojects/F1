import React from "react";
import { useEffect, useState } from "react";
import Caro from "react-bootstrap/Carousel";

const Carousel = () => {
  const [data, setData] = useState([]);

  let url = "";
  url = `https://www.thesportsdb.com/api/v1/json/3/search_all_teams.php?l=Formula 1`;

  useEffect(() => {
    function fetchData() {
      fetch(url)
        .then((response) => response.json())
        .then((item) => {
          setData(item.teams);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return (
    <Caro
      controls={false}
      indicators={false}
      fade={true}
      style={{ height: "110px" }}
    >
      {data.map((item, i) => {
        return (
          <Caro.Item interval={2000} key={i}>
            {/* <h1
              style={{ fontFamily: "fantasy", transform: "scaleX(-1)" }}
              className="text-danger float-start pe-1"
            >
              {item.strTeam}
            </h1> */}
            <img
              style={{
                width: "28%",
                height: "140px",
                objectFit: "cover",
                objectPosition: "top 50%",
              }}
              className="rounded float-start p-0"
              // src={item.strTeamJersey}
              // src={item.strKit}
              src={item.strEquipment + "/medium"}
              srcSet=""
              alt=""
            />
            {/* <h1
              style={{ fontFamily: "fantasy" }}
              className="text-danger float-end pe-1"
            >
              {item.strTeam}
            </h1> */}
            <img
              style={{
                width: "28%",
                height: "140px",
                objectFit: "cover",
                objectPosition: "center",
                transform: "scaleX(-1)",
              }}
              className="rounded float-end p-0"
              // src={item.strKit + ""}
              src={item.strEquipment + "/medium"}
              srcSet=""
              alt=""
            />
          </Caro.Item>
        );
      })}
    </Caro>
  );
};

export default Carousel;
