import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Nav from "./Nav";
import DriverId from "./DriverId";
import Loading from "./Loading";

// Zamanı "dakika:saniye.milisaniye" formatında saniyeye dönüştürme
const timeToSeconds = (time) => {
  const [minutes, seconds] = time.split(":");
  const [sec, ms] = seconds.split(".");
  return parseFloat(minutes) * 60 + parseFloat(sec) + parseFloat(ms) / 1000;
};

const ApiDataComponent = () => {
  const [data, setData] = useState([]); // Veriyi saklamak için state
  const [loading, setLoading] = useState(true); // Veri yükleniyor durumu
  const [error, setError] = useState(null); // Hata durumu
  const [totalItems, setTotalItems] = useState(0); // Toplam öğe sayısı
  const [raceDetails, setRaceDetails] = useState(null); // Yarış detayları
  const itemsPerPage = 100; // Her sayfada 100 öğe

  const { season = "2020" } = useParams();
  const { rounds = "1" } = useParams();

  const apiUrl = `https://ergast.com/api/f1/${season}/${rounds}/laps.json`; // API URL'si

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let allData = [];
      let total = 0;
      try {
        // İlk API çağrısını yaparak toplam veri sayısını öğrenelim
        const response = await axios.get(apiUrl, {
          params: {
            limit: itemsPerPage,
            offset: 0, // Başlangıçta ilk sayfayı alalım
          },
        });

        total = response.data.MRData.total; // Toplam veri sayısını al
        setTotalItems(total); // Toplam veriyi state'e kaydedelim

        // Yarış bilgilerini alalım
        const raceInfo = response.data.MRData.RaceTable.Races[0]; // İlk yarış bilgisini al
        setRaceDetails(raceInfo); // Yarış detaylarını state'e kaydedelim
        console.log(raceInfo);

        // Sayfalama ile tüm veriyi çekelim
        let totalPages = Math.ceil(total / itemsPerPage);
        for (let i = 0; i < totalPages; i++) {
          const pageResponse = await axios.get(apiUrl, {
            params: {
              limit: itemsPerPage,
              offset: i * itemsPerPage, // Her sayfada offset arttırılır
            },
          });

          // Her sayfadaki "Laps" verisini birleştir
          const raceData = pageResponse.data.MRData.RaceTable.Races[0];
          if (raceData && raceData.Laps) {
            // raceName bilgisini her veriye ekleyelim
            allData = [
              ...allData,
              ...raceData.Laps.map((lap) => ({
                raceName: raceData.raceName, // raceName bilgisini ekle
                laps: lap,
              })),
            ];
          }
        }

        // Veriyi zamanlara göre sıralama
        allData = allData.map((item) => {
          const { raceName, laps } = item;
          laps.Timings = laps.Timings.map((timing) => ({
            ...timing,
            timeInSeconds: timeToSeconds(timing.time), // Zamanı saniyeye çevir
            lapNumber: laps.number, // Tur numarasını ekle
            raceName: raceName, // raceName'i ekle
          }));
          return laps.Timings; // Sadece zaman bilgilerini döndür
        });

        // Zamanları en iyi (en küçük saniye) zamana göre sıralama
        allData = allData
          .flat()
          .sort((a, b) => a.timeInSeconds - b.timeInSeconds); // Küçükten büyüğe sıralama

        setData(allData); // Veriyi state'e kaydet
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Veri alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Sayfa yüklendiğinde veri çekmeye başla

  // Yükleniyor durumu
  if (loading) {
    return <Loading />;
  }

  // Hata durumu
  if (error) {
    return <div>{error}</div>;
  }

  // Yarış bilgilerini başlıkta gösterme
  const raceInfo = raceDetails ? raceDetails : {};

  return (
    <div className="container-fluid p-0">
      <Nav />

      <div className="border border-danger border-5 fs-2 text-info text-center fw-bold m-1">
        <p>
          {raceInfo.raceName} <br />
          {raceInfo.season} #{raceInfo.round} <br />
          {raceInfo.date} {raceInfo.time} <br />
          {raceInfo.Circuit?.Location?.locality},{" "}
          {raceInfo.Circuit?.Location?.country} (lat:
          {raceInfo.Circuit?.Location?.lat} long:
          {raceInfo.Circuit?.Location?.long})<br />
          {raceInfo.Circuit?.circuitName} <br />
        </p>
      </div>

      <table className="table table-dark table-striped op table-bordered border-black">
        <thead>
          <tr>
            <th>
              Lap Time<i className="bi bi-sort-down-alt fs-4"></i>
            </th>
            <th>Driver Info</th>
            <th>LAP</th>
            <th>POS</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((timing, index) => (
              <tr key={index}>
                <td>{timing.time}</td>
                <td> {<DriverId Id={timing.driverId} ls={2} />}</td>
                <td>{timing.lapNumber}</td> {/* Tur numarasını göster */}
                <td>{timing.position}</td> {/* Pozisyonu gösteriyoruz */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Veri bulunamadı.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApiDataComponent;
