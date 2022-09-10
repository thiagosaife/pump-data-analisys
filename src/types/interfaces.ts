export interface IDevice {
  deviceid: string,
  fromts: number,
  tots: number,
  metrics: {
    [key: string]: {
      [key: string]: number
    }
  }
  value: number,
}