import React, { useEffect, useState } from "react";
import PlayerProfile from "./PlayerProfile";

const normalizeString = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace("-", "_")
    .replace(/\s+/g, "_");
};

const DriverDB = (props) => {
  const [err, setErr] = useState(true);
  const [playerId, setPlayerId] = useState();
  const [drvr, setDrvr] = useState("");

  useEffect(() => {
    let normalizedDrvr = normalizeString(props.drv);

    if (normalizedDrvr === "carlos_sainz") {
      normalizedDrvr = "carlos_sainz_jr";
    }

    setDrvr(normalizedDrvr);
  }, [props.drv]);

  const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${drvr}`;

  useEffect(() => {
    if (!drvr) return;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const items = await response.json();

        const player = items["player"]?.find(
          (player) =>
            normalizeString(player["strPlayer"]) === drvr &&
            player?.strSport === "Motorsport"
        );

        if (player) {
          setPlayerId(player.idPlayer);
        } else {
          setErr(false);
        }
      } catch (err) {
        console.error(err.message);
        setErr(false);
      }
    };

    fetchData();
  }, [url, drvr]);

  if (!err) {
    return <div>Oyuncu bulunamadı.</div>;
  }

  return playerId ? <PlayerProfile playerId={playerId} t={"2"} /> : null;
};

export default DriverDB;
