import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import Loading from "./Loading";

const PlayerCarousel = ({ playerImages }) => {
  return (
    <div className="container mt-4">
      <Carousel>
        {playerImages.map((image, index) =>
          image ? (
            <Carousel.Item key={index}>
              <img
                className="d-block mx-auto img-fluid"
                src={image + "/small"}
                alt={`Player ${index + 1}`}
                style={{ objectFit: "fill", height: "400px" }}
              />
            </Carousel.Item>
          ) : null
        )}
      </Carousel>
    </div>
  );
};

const PlayerInfo = ({ playerData }) => (
  <div>
    <h4>
      <strong>Team:</strong> {playerData.strTeam}
    </h4>
    <h5>
      {playerData.strBirthLocation}{" "}
      {new Date(playerData.dateBorn).toLocaleDateString()}
      {playerData.strNationality && <span> ({playerData.strNationality})</span>}
      {playerData.strHeight && (
        <p>
          {playerData.strHeight} {playerData.strWeight}
        </p>
      )}
    </h5>
  </div>
);

const PlayerProfile = ({ playerId, t }) => {
  const [playerData, setPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Player verisi alınamadı.");
        }
        return response.json();
      })
      .then((data) => {
        setPlayerData(data.players[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [playerId]);

  const playerImages = [
    playerData?.strThumb,
    playerData?.strPoster,
    playerData?.strFanart1,
    playerData?.strFanart2,
    playerData?.strFanart3,
    playerData?.strFanart4,
    playerData?.strBanner,
    playerData?.strRender,
    playerData?.strCutout,
  ].filter((image) => image !== null);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  return t === "1" ? (
    <div className="player-profile">
      {playerImages.length > 1 ? (
        <PlayerCarousel playerImages={playerImages} />
      ) : (
        <img
          className="img-fluid"
          src={
            playerData.strThumb
              ? playerData.strThumb + "/small"
              : playerData.strCutout + "/small"
          }
          alt={playerData.strPlayer}
        />
      )}
      <PlayerInfo playerData={playerData} />
      <pre
        className="p-1 bg-dark text-start border"
        style={{ whiteSpace: "pre-wrap" }}
      >
        <strong className="fs-5 text-black">Biyografi:</strong>{" "}
        {playerData?.strDescriptionEN}
      </pre>
    </div>
  ) : t === "2" ? (
    <div className="container-fluid">
      <img
        className="img-fluid"
        src={
          playerData.strBanner
            ? playerData.strBanner + "/small"
            : playerData.strCutout + "/small"
            ? playerData.strThumb + "/small"
            : ""
        }
        alt=""
      />
      <pre className="text-center m-0">
        {new Date(playerData?.dateBorn).toDateString()}{" "}
        {playerData.strBirthLocation} {playerData.strNationality}
      </pre>
      {playerData.strHeight && (
        <pre className="m-0 text-center">
          {playerData.strHeight} {playerData.strWeight}
        </pre>
      )}
      <pre
        className="p-1 bg-dark text-start"
        style={{ whiteSpace: "pre-wrap" }}
      >
        <strong className="fs-5 text-black">Description:</strong>{" "}
        {playerData?.strDescriptionEN}
      </pre>
    </div>
  ) : t === "3" ? (
    <div className="container-fluid text-info">
      <img
        className="img-fluid d-block mx-auto"
        src={
          playerData.strCutout
            ? playerData.strCutout + "/tiny"
            : playerData.strThumb + "/tiny"
            ? playerData.strRender + "/tiny"
            : ""
        }
        alt={playerData.strPlayer}
        title={playerData.strDescriptionEN}
      />
      <pre className="text-center m-0">
        {new Date(playerData.dateBorn).toDateString()} <br />
        {playerData.strBirthLocation} {playerData.strNationality}
      </pre>
      {playerData.strHeight && (
        <pre className="m-0 text-center">
          {playerData.strHeight} {playerData.strWeight}
        </pre>
      )}
    </div>
  ) : (
    ""
  );
};

export default PlayerProfile;
