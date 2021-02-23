// @flow

// Takes from and to timestamps (in ms) and returns which duration to apply

const minute: number = 60 * 1000;
const hour: number = minute * 60;
const day: number = hour * 24;

function getIncrement(from: number, to: number): "minute" | "hour" | "day" {
  const diff = to - from;
  if (diff >= 14 * day) return "day";
  if (diff >= 6 * hour) return "hour";
  return "minute";
}

export default getIncrement;
