import { useEffect, useState } from "react"

import DataPlot from './DataPlot'

interface IDevice {
  deviceid: string,
  fromts: number,
  tots: number,
  metrics?: Object,
}

export default function DataProvider() {
  const [data, setData] = useState([])
  const [normalized, setNormalized] = useState([] as IDevice[])

  useEffect(() => {
    // Fetch data from API
    fetch('/api')
      .then(res => res.json())
      .then(res => setData(res[0]))
      .catch(err => console.error(`Error fetching data: ${err}`))
  }, [])

  useEffect(() => {
    setNormalized(normalizeData(data))
  }, [data])

  function normalizeData(array: any[]): IDevice[] {
    return array.map((item: IDevice) => {
      if (item.metrics) {
        item.metrics = JSON.parse(item.metrics as string)
      }
      return item
    })
  }

  return (
    <>
      <DataPlot dataPlot={normalized} />
    </>
  )
}