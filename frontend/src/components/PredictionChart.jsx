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

    const canvas = chartRef.current;
    if (!canvas) return;

    // Use warm gradient
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(194, 80, 42, 0.4)'); // terra-soft but slightly deeper
    gradient.addColorStop(1, 'rgba(194, 80, 42, 0.0)');

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: predictions.map(p => {
          // format output to be more human "2 PM" instead of "14:00"
          const h = parseInt(p.time.split(':')[0], 10);
          return h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : h === 0 ? '12 AM' : `${h} AM`;
        }),
        datasets: [{
          label: 'Expected Busyness',
          data: predictions.map(p => p.density),
          backgroundColor: gradient,
          borderColor: '#C2502A', // terra
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#C2502A',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4 // Bezier curve for organic feel
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1C1917',
            bodyColor: '#44403C',
            borderColor: '#EDE4D8',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            titleFont: { family: "'Bricolage Grotesque', sans-serif", size: 14, weight: 'bold' },
            bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 13 },
            callbacks: {
              label: function(context) {
                return `${context.parsed.y}% Full`;
              }
            }
          }
        },
        scales: {
           x: { 
             ticks: { color: '#78716C', font: { family: "'Plus Jakarta Sans'", size: 11, weight: '500' } }, 
             grid: { display: false },
             border: { display: false }
           },
           y: { 
             min: 0, 
             max: 100, 
             ticks: { 
               color: '#78716C', 
               font: { family: "'Plus Jakarta Sans'", size: 11 },
               callback: function(value) { return value + "%"; },
               stepSize: 25
             }, 
             grid: { color: '#F5EFE6', drawBorder: false },
             border: { display: false }
           },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [predictions]);

  return <canvas ref={chartRef}></canvas>;
};

export default PredictionChart;
