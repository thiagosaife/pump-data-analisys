import { useEffect, useState } from 'react'
import { IDevice } from '../types/interfaces'

import DataPlot from './DataPlot'

export default function DataProvider() {
  const [data, setData] = useState([])
  const [normalized, setNormalized] = useState([] as IDevice[])

  useEffect(() => {
    // Fetch data from API
    fetch('/api')
      .then(res => res.json())
      .then(res => {
        setData(res[0])
      })
      .catch(err => console.error(`Error fetching data: ${err}`))
  }, [])

  useEffect(() => {
    setNormalized(normalizeData(data))
  }, [data])

  function normalizeData(array: any[]): IDevice[] {
    return array.map((item: IDevice) => {
      if (item.metrics) {
        item.metrics = JSON.parse(item.metrics as unknown as string)
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