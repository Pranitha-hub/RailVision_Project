import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const PredictionChart = ({ predictions }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: predictions.map(p => p.hourLabel),
        datasets: [
          {
            label: 'Upper Bound',
            data: predictions.map(p => p.upper),
            borderColor: 'transparent',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            fill: '+1',
            pointRadius: 0,
            tension: 0.4,
          },
          {
            label: 'Predicted Crowd',
            data: predictions.map(p => p.predicted),
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6, 182, 212, 0.1)',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: predictions.map(p => 
              p.isCurrentHour ? '#22d3ee' : 'rgba(6, 182, 212, 0.6)'
            ),
            pointBorderColor: predictions.map(p => 
              p.isCurrentHour ? '#fff' : 'transparent'
            ),
            pointBorderWidth: predictions.map(p => p.isCurrentHour ? 2 : 0),
            tension: 0.4,
            fill: false,
          },
          {
            label: 'Lower Bound',
            data: predictions.map(p => p.lower),
            borderColor: 'transparent',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            fill: false,
            pointRadius: 0,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 14, 26, 0.95)',
            borderColor: 'rgba(6, 182, 212, 0.3)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (ctx) => {
                if (ctx.datasetIndex === 1) {
                  const pred = predictions[ctx.dataIndex];
                  return `Predicted: ${pred.predicted}% (Confidence: ${pred.confidence}%)`;
                }
                return null;
              },
            },
          },
        },
        scales: {
          x: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { color: 'rgba(148,163,184,0.06)' } },
          y: { min: 0, max: 100, ticks: { color: '#64748b', font: { size: 11 }, callback: v => v + '%' }, grid: { color: 'rgba(148,163,184,0.06)' } },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [predictions]);

  return <canvas ref={chartRef} />;
};

export default PredictionChart;
