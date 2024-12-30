// src/components/PieChart.js

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const PieChart = ({ month }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        fetchPieChartData();
    }, [month]);

    const fetchPieChartData = async () => {
        try {
            const response = await axios.get(`/api/pie-chart/${month}`);
            const labels = response.data.map(item => item._id);
            const data = response.data.map(item => item.count);

            setChartData({
                labels,
                datasets: [{
                    data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                }]
            });
        } catch (error) {
            console.error('Error fetching pie chart data:', error);
        }
    };

    return (
        <div>
            <h3>Pie Chart of Categories</h3>
            <Pie data={chartData} />
        </div>
    );
};

export default PieChart;
