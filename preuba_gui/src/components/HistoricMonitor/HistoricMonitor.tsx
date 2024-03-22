import React, { useEffect, useState } from 'react';
import "./historicaltimemonitor_style.css"
import LineChart from './LineChart';




interface Params{
    back_button:()=>void
}

function HistoricMonitor({back_button}:Params){
    
    
    let [ram_data,set_ram_data] = useState([0])
    let [cpu_data,set_cpu_data] = useState([0])
    let [labels_list,set_labels_list] = useState([""])
    useEffect(() => {
        
        let algo = fetch(`http://127.0.0.1:1200/historical`)
        algo.then((res)=>{
            res.json().then((obj)=>{
                let rams = [] 
                let cpus = [] 
                let lbls = []
                for (let i=0;i<obj.length;i++) {
                    rams.push(obj[i].Ram)
                    cpus.push(obj[i].Cpu)
                    lbls.push(i.toString())
                }
                set_ram_data(rams)
                set_cpu_data(cpus)
                set_labels_list(lbls)
            })
        })
        
        
      }, []);

    return <div className='realtimemonitor-page'>
        <button onClick={back_button}>Back</button>
        <div className='container-realtimemonitor'>
            <LineChart data_set={cpu_data} labels_list={labels_list} title={"CPU Usage"}></LineChart>
            <LineChart data_set={ram_data} labels_list={labels_list} title={"RAM Usage"}></LineChart>
        </div>
    </div>
}

export default HistoricMonitor;