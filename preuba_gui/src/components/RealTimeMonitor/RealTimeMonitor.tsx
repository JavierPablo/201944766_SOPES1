import React, { useEffect, useState } from 'react';
import PieChart from './PieChart';
import "./realtimemonitor_style.css"




interface Params{
    back_button:()=>void
}

function RealTimeMonitor({back_button}:Params){
    const HOST = process.env.GO_HOST;
const PORT = process.env.GO_PORT;
    let [ram_data,set_ram_data] = useState([25,75])
    let [cpu_data,set_cpu_data] = useState([40,60])
    useEffect(() => {
        // Use setTimeout to update the message after 2000 milliseconds (2 seconds)
        const timeoutId = setTimeout(() => {
            let algo = fetch(`http://${HOST}:${PORT}/realtime`)
            algo.then((res)=>{
                res.json().then((obj)=>{
                    
                    set_ram_data([obj.Ram,100-obj.Ram])
                    set_cpu_data([obj.Cpu,100-obj.Cpu])  
                })
            })
        }, 2000);
    
        // Cleanup function to clear the timeout if the component unmounts
        return () => clearTimeout(timeoutId);
      }, [ram_data,cpu_data]);
    

    return <div className='realtimemonitor-page'>
        <button onClick={back_button}>Back</button>
        <div className='container-realtimemonitor'>
            <PieChart data_set={cpu_data} title={"CPU Usage"}></PieChart>
            <PieChart data_set={ram_data} title={"RAM Usage"}></PieChart>
        </div>
    </div>
}

export default RealTimeMonitor;