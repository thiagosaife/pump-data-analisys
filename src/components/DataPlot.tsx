import { useEffect, useState } from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
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
  Title,
  Tooltip,
  Filler,
  Legend
)

type TProps = {
  dataPlot: any[]
}

export default function DataPlot(dataPlot: TProps) {
  const [idle, setIdle] = useState([] as number[])
  const [loaded, setLoaded] = useState([] as number[])
  const [unloaded, setUnloaded] = useState([] as number[])
  const [labels, setLabels] = useState([] as string[])

  const desiredLoadFactor = 0.4 // considering the average from the status loaded

  useEffect(() => {
    if (dataPlot.dataPlot.length <= 0) return
    handleData(dataPlot.dataPlot)
  }, [dataPlot]);

  function handleData(data: any[]) {
    const fList = data.map((item: any) => {
      if (item.metrics) {
        item.value = item.metrics.Psum.avgvalue * desiredLoadFactor
      }
      return item
    })

    const idle = fList.filter((item: any) => item.value < 20)
    setIdle(idle)
    
    const loaded = fList.filter((item: any) => item.value >= 20 && item.value <= 100)
    setLoaded(loaded)

    const unloaded = fList.filter((item: any) => item.value <= 0.1)
    setUnloaded(unloaded)

    const labels = fList.map((item: any) => {
      return new Intl.DateTimeFormat('en',{
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
      }).format(new Date(item.fromts))
    })
    setLabels(labels)
    
  }

  const options = {
    responsive: true,
    layout: {
      autoPadding: true,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'State monitor',
      },
    },
  }

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Loaded - 20% >= n <= 100%',
        data: loaded.map((item: any) => item.value.toFixed(2)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        fill: true,
        label: 'Idle - n < 20%',
        data: idle.map((item: any) => item.value.toFixed(2)),
        borderColor: 'rgb(178, 222, 39)',
        backgroundColor: 'rgba(178, 222, 39, 0.5)',
      },
      {
        fill: true,
        label: 'Unloaded - no current ≈ 0.1A',
        data: unloaded.map((item: any) => item.value.toFixed(2)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <>
      <Line data={data} options={options} />
    </>
  )
}