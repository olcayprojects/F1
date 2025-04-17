export const timeToSeconds = (timeStr) => {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
};

export const secondsToTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${minutes}:${secs.padStart(6, "0")}`;
};

export const thisYear = new Date().getFullYear().toString();

export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const dateTime = (date, time) => new Date(`${date} ${time}`);

// 03/25, 08:10
export const getFormattedDate = (event) => {
  if (!event) return "-";
  const fullDate = event.time
    ? dateTime(event.date, event.time)
    : new Date(event.date);
  return fullDate.toLocaleString("en", {
    month: "2-digit",
    day: "2-digit",
    hourCycle: "h23",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const isUpcoming = (raceDate) => {
  const race = new Date(raceDate);
  race.setHours(0, 0, 0, 0);
  return race >= getToday();
};

export const shouldShowThumb = (raceDate, season) => {
  const d = new Date(raceDate);
  const today = getToday();
  return (
    season === thisYear &&
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() >= today.getDate()
  );
};
