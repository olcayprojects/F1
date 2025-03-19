import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";

// Carousel bileşeni
const PlayerCarousel = ({ playerImages }) => {
  return (
    <div className="container mt-4">
      <Carousel>
        {playerImages.map((image, index) =>
          image ? (
            <Carousel.Item key={index}>
              <img
                className="d-block mx-auto img-fluid"
                src={image}
                alt={`Player  ${index + 1}`}
                style={{ objectFit: "fill", height: "400px" }}
              />
            </Carousel.Item>
          ) : null
        )}
      </Carousel>
    </div>
  );
};
const PlayerProfile = ({ playerId }) => {
  const [playerData, setPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API URL'si, oyuncu ID'sini içeren URL
    const url = `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`;

    // API'den veriyi çekme
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch player data");
        }
        return response.json();
      })
      .then((data) => {
        // Gelen veriyi set et
        setPlayerData(data.players[0]);
        setIsLoading(false);
      })
      .catch((err) => {
        // Hata durumu
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
  ].filter((image) => image !== null); // Sadece geçerli (null olmayan) görselleri alıyoruz

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="player-profile">
      <PlayerCarousel playerImages={playerImages} />
      {/* <img src={playerData.strThumb} alt={playerData.strPlayer} /> */}
      <p>
        <strong>Team:</strong> {playerData.strTeam}
      </p>
      <p>
        {playerData.strBirthLocation}{" "}
        {new Date(playerData.dateBorn).toLocaleDateString()}
        {playerData.strNationality && (
          <span> ({playerData.strNationality})</span>
        )}
        {playerData.strHeight && <p>Height: {playerData.strHeight}</p>}
      </p>
      <pre className="text-wrap">
        <strong>Biography:</strong> {playerData.strDescriptionEN}
      </pre>
    </div>
  );
};

export default PlayerProfile;
