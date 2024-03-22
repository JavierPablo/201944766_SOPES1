import React, { useEffect, useRef, useState } from 'react';
import "./processtree_style.css"
import Tree from './Tree';
interface Params{
    back_button:()=>void
}


function ProcessTree({back_button}:Params){
    const HOST = process.env.GO_HOST;
const PORT = process.env.GO_PORT;
    let [nodes,set_nodes] = useState([] as { id: number; label: string; }[])
    let [edges,set_edges] = useState([] as { from: number; to: number; }[])
    let [elm_list,set_elm_list] = useState([<></>])
    useEffect(() => {
        let algo = fetch(`http://${HOST}:${PORT}/all_pids`)
        algo.then((res)=>{
            res.json().then((obj)=>{
                let options = [] 
                for (let i=0;i<obj.length;i++) {
                    
                    options.push(<option value={obj[i].Pid} onSelect={on_click}>{obj[i].Pid}</option>)
                }
                set_elm_list(options)
            })
        })
      }, []);
    
      let on_click =(event:any)=>{
        let mas = event.target.value
        let algo = fetch(`http://${HOST}:${PORT}/process_info`,{ method:'POST', body:`{"pid":${mas}}`})

        algo.then((res)=>{
            res.json().then((obj)=>{
                let counter = 1
                const nodes = [{ id: counter, label: `pid:${obj.Pid}\n${obj.Name}` }];
                const edges = [] as { from: number; to: number; }[];
                let recursive_to_child = (parent:number,child:any)=>{
                    nodes.push({ id: ++counter, label: `pid:${child.Pid}\n${child.Name}` })
                    edges.push({ from: parent, to: counter})
                    for (let i=0;i<child.Childs.length;i++) {
                        recursive_to_child(counter,child.Childs[i])
                    }
                }
                for (let i=0;i<obj.Childs.length;i++) {
                    recursive_to_child(counter,obj.Childs[i])
                }
                set_nodes(nodes)
                set_edges(edges)
            })
        })
      }

    return <div className='processtree-page'>
        <button onClick={back_button}>Back</button>
            <div className='process-pid-select'>
                <p>Proceess pid</p>
                <select  name="select-pid" onChange={on_click} > {elm_list}</select>
            </div>
            <Tree edges={edges} nodes={nodes}></Tree>
    </div>
}

export default ProcessTree;