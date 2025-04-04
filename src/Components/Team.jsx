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
          setData(item?.teams);
        })
        .catch((err) => {
          // console.log(err.message);
        });
    }
    fetchData();
  }, [url]);

  return data?.map((teams, index) => {
    if (teams?.strTeamAlternate === "Scuderia AlphaTauri") {
      teams.strTeam = "RB F1 Team";
    }

    let changedTeamname =
      props?.teamName === "Renault"
        ? "BWT Alpine Formula One Team"
        : props?.teamName;

    const foundTeam =
      teams?.strTeam?.toLowerCase()?.includes(changedTeamname?.toLowerCase()) ||
      teams?.strTeamAlternate
        ?.toLowerCase()
        .includes(changedTeamname?.toLowerCase());

    if (foundTeam) {
      if (props.ls === 1) {
        return (
          <div className="" key={index}>
            <img
              className="img-fluid"
              style={{}}
              src={teams?.strLogo + "/preview"}
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
            {/* <h6>{teams.strTeam}</h6> */}
          </div>
        );
      }
      if (props.ls === 2) {
        return (
          <img
            className="img-fluid me-1 object-fit-md-cover object-fit-sm-none"
            key={{ index }}
            style={{
              width: "40%",
              maxHeight: "110px",
              objectPosition: "center",
            }}
            src={teams?.strEquipment + "/medium"}
            alt=""
            srcSet=""
            title={teams?.strDescriptionEN}
          />
        );
      } else {
        return (
          <div key={index} className="container-fluid p-0" style={{}}>
            {/* <img
              className="img-fluid w-25"
              src={teams?.strTeamBadge + "/preview"}
              alt=""
              srcSet=""
              title=""
            /> */}

            <img
              className="img-fluid mx-auto d-block w-50 object-fit-cover imgrun"
              style={{ maxHeight: "220px" }}
              src={teams?.strKit + ""}
              alt=""
              srcSet=""
              title={teams?.strTeam}
            />
            <img
              className="img-fluid mx-auto d-block w-50 object-fit-contain imgrun"
              style={{ maxHeight: "380px" }}
              src={teams?.strBadge + ""}
              alt=""
              srcSet=""
              title={teams?.strTeam}
            />
            <h5 className="text-center text-light fw-bold">
              {teams?.intFormedYear} {teams?.strCountry}
            </h5>
            <pre
              className="ps-1"
              style={{
                whiteSpace: "pre-wrap",
                color: "#62b6a5",
                lineHeight: "26px",
              }}
            >
              {teams?.strDescriptionEN ? (
                <>
                  <h6 className="text-info bg-dark text-center">English</h6>
                  {teams?.strDescriptionEN}
                </>
              ) : (
                ""
              )}
              {teams?.strDescriptionDE ? (
                <>
                  <h6 className="text-info bg-dark text-center">Deutsch</h6>
                  {teams?.strDescriptionDE}{" "}
                </>
              ) : (
                ""
              )}
              {teams?.strDescriptionFR ? (
                <>
                  <h6 className="text-info bg-dark text-center">Français</h6>
                  {teams?.strDescriptionFR}{" "}
                </>
              ) : (
                ""
              )}
            </pre>
          </div>
        );
      }
    } else {
      return null;
    }
  });
};

export default Team;
