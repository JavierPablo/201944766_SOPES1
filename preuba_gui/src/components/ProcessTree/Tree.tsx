import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
// import { Network } from 'vis-network/standalone/umd/vis-network.min.js';

interface Params{
    nodes:any
    edges:any
}


function Tree({nodes,edges}:Params){    
    const visJsRef = useRef<HTMLDivElement>(null);
    
    const options = {};
	useEffect(() => {
        const network = visJsRef.current 
        && new Network(visJsRef.current, { nodes, edges }, options);	

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