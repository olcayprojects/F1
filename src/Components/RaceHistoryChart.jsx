// RaceHistoryChart.jsx
import React, { useState, useEffect } from "react";
import LapTable from "./LapTable";
import { timeToSeconds } from "../utils/utils";
import Nav from "./Nav";

const RaceHistoryChart = () => {
  const [lapTimes, setLapTimes] = useState({});
  const [driverIds, setDriverIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [season, setSeason] = useState("");
  const [round, setRound] = useState("");
  const [info, setInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRaceInfo = async () => {
      try {
        const response = await fetch(
          "https://ergast.com/api/f1/current/last/results.json"
        );
        const data = await response.json();

        if (season === "" && round === "") {
          setSeason(data.MRData.RaceTable.season);
          setRound(data.MRData.RaceTable.round);
          setInfo(data.MRData.RaceTable.Races[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Yarış bilgileri alınırken bir hata oluştu.");
      }
    };

    fetchRaceInfo();
  }, [season, round]);

  useEffect(() => {
    if (!season || !round) return;

    const fetchAllLapData = async () => {
      try {
        let allLapData = [];
        let offset = 0;
        const limit = 100;

        const fetchLapData = async (offset) => {
          const url = `https://ergast.com/api/f1/${season}/${round}/laps.json?limit=${limit}&offset=${offset}`;
          const response = await fetch(url);
          const data = await response.json();

          if (
            data.MRData &&
            data.MRData.RaceTable &&
            data.MRData.RaceTable.Races &&
            data.MRData.RaceTable.Races[0]
          ) {
            const lapsData = data.MRData.RaceTable.Races[0].Laps;
            const totalLaps = parseInt(data.MRData.total, 10);

            if (lapsData && lapsData.length > 0) {
              allLapData = allLapData.concat(lapsData);
              offset += limit; // Bir sonraki offset'i ayarla

              // Eğer toplam lap sayısı, toplam veriye ulaştıysa, verileri sınırla
              if (allLapData.length >= totalLaps) {
                allLapData = allLapData.slice(0, totalLaps); // Toplam lap sayısını sınırla
                return;
              }

              // Daha fazla veri varsa, bir sonraki sayfayı al
              if (offset < totalLaps) {
                await fetchLapData(offset);
              }
            } else {
              // Daha fazla veri yoksa döngüyü sonlandırıyoruz
              return;
            }
          } else {
            console.error("Beklenmeyen veri yapısı:", data);
            setError("Beklenmeyen veri yapısı alındı.");
            return;
          }
        };

        await fetchLapData(offset);

        let allTimes = {};
        allLapData.forEach((lap) => {
          lap.Timings.forEach((timing) => {
            if (!allTimes[timing.driverId]) {
              allTimes[timing.driverId] = {};
            }
            allTimes[timing.driverId][lap.number] = timeToSeconds(timing.time);
          });
        });

        const uniqueDriverIds = Object.keys(allTimes);

        let completeLapTimes = {};
        allLapData.forEach((lap) => {
          completeLapTimes[lap.number] = {};
          uniqueDriverIds.forEach((driverId) => {
            completeLapTimes[lap.number][driverId] =
              allTimes[driverId]?.[lap.number] ?? undefined;
          });
        });

        setDriverIds(uniqueDriverIds);
        setLapTimes(completeLapTimes);
        setLoading(false);
      } catch (error) {
        console.error("Tur zamanları alınırken bir hata oluştu:", error);
        setError("Tur zamanları alınırken bir hata oluştu.");
        setLoading(false);
      }
    };

    fetchAllLapData();
  }, [season, round]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Nav />
      <div className="RaceHistoryChart">
        <h1 className="text-info text-center">Race Chart History</h1>
        <h2 className="text-warning text-center">
          {new Date(info.date + "T" + info.time).toLocaleString()}_
          {info.raceName}_{info.Circuit?.circuitName}__{season} #{round}
        </h2>
        <LapTable lapTimes={lapTimes} driverIds={driverIds} />
      </div>
    </>
  );
};

export default RaceHistoryChart;
