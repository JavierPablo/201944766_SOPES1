import React, { useEffect, useRef, useState } from 'react';
import "./processsim_style.css"
import Tree from './Tree';
import { Network } from "vis-network";

interface Params{
    back_button:()=>void
}

function ProcessSim({back_button}:Params){
    

    let [nodes,set_nodes] = useState([] as any[])
    let [edges,set_edges] = useState([] as any[])

    let node1 = { id: 1, label: "New" ,color:"blue"}
    let node2 = { id: 2, label: "Ready" ,color:"blue"}
    let node3 = { id: 3, label: "Runing", color:"blue"}
    let edge1 = { from: 1, to: 2 ,arrows:"to"}
    let edge2 = { from: 2, to: 3 ,arrows:"to", color:""}
    let edge3 = { from: 3, to: 2 ,arrows:"to",color:"",hidden:true}

    let [hidedge3,set_hidedge3] = useState(true)
    let [trgt_pid,set_trgt_pid] = useState(0)
    let [last_node,set_last_node] = useState(node1)
    let new_action = ()=>{
        let algo = fetch(`http://127.0.0.1:1200/new_process`)
        algo.then((res)=>{
            res.json().then((obj)=>{
                set_trgt_pid(obj.Pid)
                console.log(obj.Pid)
                fetch(`http://127.0.0.1:1200/save_op_process`,{ method:'POST', body:`{"pid":${obj.Pid},"operation":1}`})
                fetch(`http://127.0.0.1:1200/save_op_process`,{ method:'POST', body:`{"pid":${obj.Pid},"operation":2}`})
                fetch(`http://127.0.0.1:1200/save_op_process`,{ method:'POST', body:`{"pid":${obj.Pid},"operation":3}`})
                node3.color = "red"
                set_nodes([node1,node2,node3])
                edge2.color = 'red'
                set_edges([edge1,edge2,edge3])
                set_last_node(node3)
            })
        })
    }
    let stop_action = ()=>{
        fetch(`http://127.0.0.1:1200/save_op_process`,{ method:'POST', body:`{"pid":${trgt_pid},"operation":2}`})
        // 3->2
        edge2.color = ""
        edge3.color = 'red'
        set_hidedge3(false)
        edge3.hidden = false
        set_edges([edge1,edge2,edge3])
        node2.color = "red"
        node3.color = "blue"
        set_nodes([node1,node2,node3])
        set_last_node(node2)

    }
    let resume_action = ()=>{
        fetch(`http://127.0.0.1:1200/save_op_process`,{ method:'POST', body:`{"pid":${trgt_pid},"operation":3}`})
        // 2->3
        edge2.color = "red"
        edge3.color = 'blue'
        edge3.hidden = hidedge3
        node2.color = "blue"
        node3.color = "red"
        set_edges([edge1,edge2,edge3])
        set_nodes([node1,node2,node3])
        set_last_node(node3)
        
    }
    let kill_action = ()=>{
        fetch(`http://127.0.0.1:1200/save_op_process`,{ method:'POST', body:`{"pid":${trgt_pid},"operation":4}`})
        edge3.color = ""
        edge2.color = ""
        edge3.hidden = hidedge3
        last_node.color = "blue"
        set_nodes([node1,node2,node3,{ id: 4, label: "Terminated", color:'red'}])
        set_edges([edge1,edge2,edge3,{from:last_node.id, to:4, color:"red",arrows:"to"}])
    }
    

    return <div className='processsim-page'>
        <button onClick={back_button} id='back'>Back</button>
        <div id='process-pid-on'>
            <p>Proceess pid: </p>
            <p id='trgt-pid'>{trgt_pid}</p>
        </div>
        <div id='buttons-box'>
            <button className='sim-buttons' onClick={new_action}>New</button>
            <button className='sim-buttons' onClick={stop_action}>Stop</button>
            <button className='sim-buttons' onClick={resume_action}>Resume</button>
            <button className='sim-buttons' onClick={kill_action}>Kill</button>
        </div>
        <Tree edges={edges} nodes={nodes}></Tree>

    </div>
}

export default ProcessSim;