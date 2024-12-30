// src/components/BarChart.js

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const BarChart = ({ month }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        fetchBarChartData();
    }, [month]);

    const fetchBarChartData = async () => {
        try {
            const response = await axios.get(`/api/bar-chart/${month}`);
            const labels = response.data.map(item => item.range);
            const data = response.data.map(item => item.count);

            setChartData({
                labels,
                datasets: [{
                    label: 'Number of Items',
                    data,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1,
                }]
            });
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    };

    return (
        <div>
            <h3>Bar Chart of Price Ranges</h3>
            <Bar data={chartData} />
        </div>
    );
};

export default BarChart;
