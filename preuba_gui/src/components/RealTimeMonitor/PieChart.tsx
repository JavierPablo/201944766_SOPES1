import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import "./pie_chart_style.css"
interface Params {
    data_set: number[]
    title:String
}
function PieChart({ data_set, title}: Params) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        var options = {
            animation:false,
            responsive: false,
            maintainAspectRatio: false,
            legend: {
                position: 'top',
            }
        };
        var data = {
            labels: ["Free", "Occupied", ],
            datasets: [{
                data: data_set,
                backgroundColor: ["blue", "red"]
            }]
        };
        if (!chartRef.current) return;
        const ctx: CanvasRenderingContext2D = chartRef.current.getContext('2d') as CanvasRenderingContext2D;
        let chart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options,
        });
        
        return () => {
            chart.destroy();
        };
    }, [data_set]);

    return <div className='pie-chart'>
        <p>{title}</p>
        <canvas ref={chartRef} />

    </div>
}

export default PieChart;