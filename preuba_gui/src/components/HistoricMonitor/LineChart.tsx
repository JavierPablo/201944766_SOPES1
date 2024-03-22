import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import "./line_chart_style.css"
interface Params {
    data_set: number[]
    labels_list: string[]
    title:String
}
function LineChart({ data_set, title, labels_list}: Params) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        // var options = {
        //     animation:false,
        //     responsive: false,
        //     maintainAspectRatio: false,
        //     legend: {
        //         position: 'top',
        //     }
        // };
        var data = {
            labels: labels_list,
            datasets: [{
                data: data_set,
                // backgroundColor: ["blue", "red"]
            }]
        };
        if (!chartRef.current) return;
        const ctx: CanvasRenderingContext2D = chartRef.current.getContext('2d') as CanvasRenderingContext2D;
        let chart = new Chart(ctx, {
            type: 'line',
            data: data,
            // options: options,
        });
        
        return () => {
            chart.destroy();
        };
    }, [data_set]);

    return <div className='line-chart'>
        <p>{title}</p>
        <canvas ref={chartRef} />

    </div>
}

export default LineChart;