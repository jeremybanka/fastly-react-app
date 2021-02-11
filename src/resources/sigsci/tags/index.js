import SiteTags from "./SiteTags";

export { SiteTags };

export type TimeseriesType = {
  data: {
    type: string,
    label: string,
    from: number,
    until: number,
    inc: number,
    summaryCount: number,
    totalPoints: number,
    data: number[],
    meta: {
      lookup: number,
      quantize: number,
    },
  }[],
};
