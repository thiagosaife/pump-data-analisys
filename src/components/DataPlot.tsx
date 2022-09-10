import { useEffect, useState } from 'react'
import InfoPanel from './InfoPanel'
import { IDevice } from '../types/interfaces'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
)

type TProps = {
  dataPlot: IDevice[]
}

export default function DataPlot(dataPlot: TProps) {
  const [idle, setIdle] = useState([] as IDevice[])
  const [loaded, setLoaded] = useState([] as IDevice[])
  const [unloaded, setUnloaded] = useState([] as IDevice[])
  const [offline, setOffline] = useState([] as IDevice[])

  const [idleAvg, setIdleAvg] = useState('')
  const [loadedAvg, setLoadedAvg] = useState('')
  const [unloadedAvg, setUnloadedAvg] = useState('')
  const [offlineAvg, setOfflineAvg] = useState('')

  const [labels, setLabels] = useState([] as string[])
  const [desiredLoadFactor, setDesiredLoadFactor] = useState(0)
  const [fromts, setFromts] = useState(0)
  const [tots, setTots] = useState(0)

  const NODATA = 'No data'

  useEffect(() => {
    if (dataPlot.dataPlot.length <= 0) return

    setFromts(dataPlot.dataPlot[0].fromts)
    setTots(dataPlot.dataPlot[dataPlot.dataPlot.length - 1].tots)

    function calculateLoadFactor() {
      const avg = dataPlot.dataPlot.reduce((acc, item) => {
        return acc + item.metrics.Psum.avgvalue
      }, 0)
      setDesiredLoadFactor((avg/dataPlot.dataPlot.length)/1000)
    }
    calculateLoadFactor()

    function handleData(data: IDevice[]) {
      const fList = data.map((item: IDevice) => {
        if (item.metrics) {
          item.value = item.metrics.Psum.avgvalue * desiredLoadFactor
        }
        return item
      })
  
      setIdle(fList.filter((item: IDevice) => item.value < 20))
      
      setLoaded(fList.filter((item: IDevice) => item.value >= 20 && item.value <= 100))
  
      setUnloaded(fList.filter((item: IDevice) => item.value <= 0.1))

      setOffline(fList.filter((item: IDevice) => item.value <= 0))
  
      const labels = fList.map((item: IDevice) => {
        return new Intl.DateTimeFormat('en',{
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', second: 'numeric'
        }).format(new Date(item.tots))
      })
      setLabels(labels)
    }
    handleData(dataPlot.dataPlot)
  }, [dataPlot.dataPlot, desiredLoadFactor]);

  useEffect(() => {
    function handleAvg(sum: number, array: IDevice[]): string {
      return sum/array.length > 0 ? (sum/array.length).toFixed(2) : NODATA
    }

    function calculateAverages() {
      const idleSum = idle.reduce((acc, item: IDevice) => acc + item.value, 0)
      setIdleAvg(handleAvg(idleSum, idle))

      const loadedSum = loaded.reduce((acc, item: IDevice) => acc + item.value, 0)
      setLoadedAvg(handleAvg(loadedSum, loaded))

      const unloadedSum = unloaded.reduce((acc, item: IDevice) => acc + item.value, 0)
      setUnloadedAvg(handleAvg(unloadedSum, unloaded))

      const offlineSum = offline.reduce((acc, item: IDevice) => acc + item.value, 0)
      setOfflineAvg(handleAvg(offlineSum, offline))
    }
    calculateAverages()
  }, [idle, loaded, unloaded, offline])

  const options = {
    responsive: true,
    layout: {
      autoPadding: true,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: `Loaded: ${loaded.length}`,
        data: loaded.map((item: IDevice) => item.value.toFixed(2)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        fill: true,
        label: `Idle: ${idle.length}`,
        data: idle.map((item: IDevice) => item.value.toFixed(2)),
        borderColor: 'rgb(178, 222, 39)',
        backgroundColor: 'rgba(178, 222, 39, 0.5)',
      },
      {
        fill: true,
        label: `Unloaded: ${unloaded.length}`,
        data: unloaded.map((item: IDevice) => item.value.toFixed(2)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        fill: true,
        label: `Offline: ${offline.length}`,
        data: offline.map((item: IDevice) => item.value.toFixed(2)),
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    ],
  }

  return (
    <>
      <InfoPanel dataPlot={
        {
          idle: idle.length,
          loaded: loaded.length,
          unloaded: unloaded.length,
          offline: offline.length,
          averages: {
            idle: idleAvg,
            loaded: loadedAvg,
            unloaded: unloadedAvg,
            offline: offlineAvg,
          },
          timeLength: {
            fromts,
            tots
          }
        }
      } />
      <Line data={data} options={options} />
    </>
  )
}