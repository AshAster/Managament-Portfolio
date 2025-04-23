import { useEffect, useState } from 'react'
import Chart from 'react-google-charts'

const linechart = ({historiaclData}) => {

  const [data, setData] = useState(["Date","Prices"])

  useEffect(()=>{
    let dataCopy = [["Date","Prices"]];
    if(historiaclData.prices){
      historiaclData.prices.map((item)=>{
        dataCopy.push([`${new Date(item[0]).toLocaleDateString().slice(0,-5)}`,item[1]])
      })
      setData(dataCopy);
    }
  },[historiaclData])
  return (
    
    <Chart 
        chartType='LineChart'
        data={data}
        height="100%"
        legendToggle
    />
  )
}

export default linechart