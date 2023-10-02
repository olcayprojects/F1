import React from "react";
import { useEffect, useState } from "react";

const Team = (props) => {
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

  return data?.map((teams, index) => {
    if (teams.strTeam === "Scuderia AlphaTauri") {
      teams.strTeam = "AlphaTauri";
    }

    if (props?.teamName?.substring(0, 4) === teams?.strTeam?.substring(0, 4)) {
      if (props.ls === 1) {
        return (
          <div className="" key={index} >
            <img
              className="img-responsive w-100 "
              style={{ maxWidth: "120px" }}
              src={teams?.strTeamBadge + "/preview"}
              alt=""
              srcSet=""
              title={teams?.strDescriptionEN}
            />
            {/* <img
              className="img-fluid w-100 "
              style={{height: "100px", objectFit: "cover" }}
              src={teams?.strTeamJersey + ""}
              alt=""
              srcSet=""
              title={teams?.strDescriptionEN}
            /> */}
          </div>
        );
      } else {
        return (
          <div key={index} className="container-fluid p-0" style={{}}>
            <img
              className="img-responsive imgrun w-25"
              style={{}}
              src={teams?.strTeamJersey + ""}
              alt=""
              srcSet=""
              title={teams?.strDescriptionEN}
            />
            <img
              className="img-fluid"
              style={{}}
              src={teams?.strTeamBadge + "/preview"}
              alt=""
              srcSet=""
              title=""
            />
          </div>
        );
      }
    } else {
      // console.log(teams);
    }
  });
};

export default Team;
