export const timeToSeconds = (timeStr) => {
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return minutes * 60 + seconds;
};

export const secondsToTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${minutes}:${secs.padStart(6, "0")}`;
};
