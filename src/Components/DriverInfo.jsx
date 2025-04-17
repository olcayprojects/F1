import React, { useEffect, useState } from "react";
import PlayerProfile from "./PlayerProfile";
import Loading from "./Loading";

const normalizeString = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace("-", "_")
    .replace(/\s+/g, "_");
};

export const DrvInfo = (props) => {
  const [player, setPlayer] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let drvName = props.drv === "Carlos Sainz" ? "Carlos Sainz Jr" : props.drv;
    drvName = normalizeString(drvName);
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${drvName}`;

    function fetchData() {
      setLoading(true);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // const foundPlayer = data?.player?.find(
          //   (player) => normalizeString(player?.strPlayer) === drvName
          // );
          const foundPlayer = data?.player?.filter(
            (player) =>
              normalizeString(player?.strPlayer) === drvName &&
              player?.strSport === "Motorsport"
          );

          setPlayer(foundPlayer[0]);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err.message);
          setLoading(false);
        });
    }

    fetchData();
  }, [props.drv]);

  if (loading) {
    return <Loading />;
  }

  if (props.s === "1") {
    return player ? (
      <PlayerProfile playerId={player?.idPlayer} t={"3"} />
    ) : null;
  }

  if (player) {
    return (
      <>
        <img
          className="img-fluid"
          style={{}}
          src={
            player?.strCutout
              ? player?.strCutout + "/preview"
              : player?.strThumb + "/preview"
          }
          alt={player?.strPlayer}
          title={player?.strPlayer + " / " + player?.strNationality}
        />
        <h4 className="card-title text-danger align-self-end mx-auto text-center">
          {player?.strPlayer}
        </h4>
        <h6 className="card-title text-warning align-self-end mx-auto text-center">
          {player?.dateBorn} {player?.strNationality}
        </h6>
      </>
    );
  }

  return null;
};

export default DrvInfo;
