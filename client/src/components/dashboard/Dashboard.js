import React from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent, CardHeader } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for charts
const revenueData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Revenue',
      data: [30000, 60000, 6000, 24000],
      backgroundColor: 'rgba(37, 99, 235, 0.6)',
    },
  ],
};

const funnelData = {
  labels: ['TAL', 'MQLs', 'SQLs', 'Logos'],
  datasets: [
    {
      label: 'Inbound',
      data: [200, 100, 16, 2],
      backgroundColor: 'rgba(16, 185, 129, 0.6)',
    },
    {
      label: 'Outbound',
      data: [400, 150, 40, 8],
      backgroundColor: 'rgba(245, 158, 11, 0.6)',
    },
  ],
};

const pbitData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'PBIT',
      data: [1200, 2400, 375, 1350],
      borderColor: 'rgba(37, 99, 235, 1)',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

function Dashboard() {
  // Mock summary metrics
  const summaryMetrics = [
    { title: 'Net New I-ACV', value: '$120,000', color: '#2563eb' },
    { title: 'Total Logos', value: '10', color: '#10b981' },
    { title: 'Total SQLs', value: '68', color: '#f59e0b' },
    { title: 'PBIT', value: '$19,125', color: '#ef4444' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryMetrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.title}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderTop: `4px solid ${metric.color}`,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                {metric.title}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, color: metric.color }}>
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardHeader title="Quarterly Revenue" />
            <CardContent className="dashboard-card-content">
              <Bar
                data={revenueData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Funnel Chart */}
        <Grid item xs={12} md={6}>
          <Card className="dashboard-card">
            <CardHeader title="Sales Funnel" />
            <CardContent className="dashboard-card-content">
              <Bar
                data={funnelData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* PBIT Chart */}
        <Grid item xs={12}>
          <Card className="dashboard-card">
            <CardHeader title="Profit Before Interest and Taxes" />
            <CardContent className="dashboard-card-content">
              <Line
                data={pbitData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;