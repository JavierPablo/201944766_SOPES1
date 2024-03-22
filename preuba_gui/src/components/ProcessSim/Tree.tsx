import { useEffect, useRef } from "react";
import { Network } from "vis-network";


interface Params{
    nodes:any
    edges:any
}


function Tree({nodes,edges}:Params){    
    const visJsRef = useRef<HTMLDivElement>(null);
    
    // const options = {edges:{arrows: "to"}};
    const options = {};
    const network = visJsRef.current 
    && new Network(visJsRef.current, { nodes, edges }, options);
	useEffect(() => {
        network?.setData({nodes,edges})
        
    }, [visJsRef,nodes,edges]);
        
	// return <div ref={visJsRef} style={{ height: '100%', width: '100%'}} />;
	return <div ref={visJsRef} style={{
        height: '80%',
        width: '100%',
        backgroundColor:'black',
        display:'flex',
        flexGrow:1,
    }} />;
}

export default Tree;