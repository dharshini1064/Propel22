import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Reports = () => {
  const [businessPlans, setBusinessPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [bookkeepingData, setBookkeepingData] = useState([]);
  const [evaluationData, setEvaluationData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBusinessPlans = async () => {
      try {
        const response = await axios.get('/api/business-plans');
        setBusinessPlans(response.data);
        if (response.data.length > 0) {
          setSelectedPlan(response.data[0].id);
        }
      } catch (error) {
        console.error('Error fetching business plans:', error);
      }
    };

    fetchBusinessPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchReportData(selectedPlan);
    }
  }, [selectedPlan]);

  const fetchReportData = async (planId) => {
    setLoading(true);
    try {
      // Fetch bookkeeping data
      const bookkeepingResponse = await axios.get(`/api/bookkeeping?businessPlanId=${planId}`);
      setBookkeepingData(bookkeepingResponse.data);

      // Fetch evaluation data
      const evaluationResponse = await axios.get(`/api/evaluations?businessPlanId=${planId}`);
      setEvaluationData(evaluationResponse.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  // Prepare data for financial summary chart
  const prepareFinancialData = () => {
    const incomeData = bookkeepingData
      .filter(entry => entry.type === 'income')
      .reduce((acc, entry) => acc + parseFloat(entry.amount), 0);

    const expenseData = bookkeepingData
      .filter(entry => entry.type === 'expense')
      .reduce((acc, entry) => acc + parseFloat(entry.amount), 0);

    const balance = incomeData - expenseData;

    return {
      labels: ['Income', 'Expenses', 'Balance'],
      datasets: [
        {
          label: 'Amount ($)',
          data: [incomeData, expenseData, balance],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            balance >= 0 ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            balance >= 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for expense categories pie chart
  const prepareExpenseCategoriesData = () => {
    const expensesByCategory = bookkeepingData
      .filter(entry => entry.type === 'expense')
      .reduce((acc, entry) => {
        const category = entry.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(entry.amount);
        return acc;
      }, {});

    return {
      labels: Object.keys(expensesByCategory).map(category => 
        category.charAt(0).toUpperCase() + category.slice(1)
      ),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(expensesByCategory),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for evaluation scores chart
  const prepareEvaluationScoresData = () => {
    if (evaluationData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }]
      };
    }

    // Get the most recent evaluation
    const latestEvaluation = evaluationData.sort((a, b) => 
      new Date(b.evaluationDate) - new Date(a.evaluationDate)
    )[0];

    return {
      labels: ['Market', 'Financial', 'Operational', 'Risk'],
      datasets: [
        {
          label: 'Evaluation Scores',
          data: [
            latestEvaluation.marketScore,
            latestEvaluation.financialScore,
            latestEvaluation.operationalScore,
            latestEvaluation.riskScore
          ],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for cash flow over time chart
  const prepareCashFlowData = () => {
    // Group entries by date and calculate daily balance
    const entriesByDate = bookkeepingData.reduce((acc, entry) => {
      const date = new Date(entry.date).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { income: 0, expense: 0 };
      }
      if (entry.type === 'income') {
        acc[date].income += parseFloat(entry.amount);
      } else {
        acc[date].expense += parseFloat(entry.amount);
      }
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(entriesByDate).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    // Calculate cumulative balance
    let runningBalance = 0;
    const balances = sortedDates.map(date => {
      runningBalance += entriesByDate[date].income - entriesByDate[date].expense;
      return runningBalance;
    });

    return {
      labels: sortedDates,
      datasets: [
        {
          label: 'Cash Flow',
          data: balances,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1
        }
      ]
    };
  };

  // Export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const selectedPlanName = businessPlans.find(plan => plan.id === selectedPlan)?.title || 'Business Plan';
    
    // Add title
    doc.setFontSize(18);
    doc.text(`${selectedPlanName} - Financial Report`, 14, 22);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Add financial summary
    doc.setFontSize(14);
    doc.text('Financial Summary', 14, 45);
    
    const incomeTotal = bookkeepingData
      .filter(entry => entry.type === 'income')
      .reduce((acc, entry) => acc + parseFloat(entry.amount), 0);
    
    const expenseTotal = bookkeepingData
      .filter(entry => entry.type === 'expense')
      .reduce((acc, entry) => acc + parseFloat(entry.amount), 0);
    
    const balance = incomeTotal - expenseTotal;
    
    doc.setFontSize(12);
    doc.text(`Total Income: $${incomeTotal.toFixed(2)}`, 20, 55);
    doc.text(`Total Expenses: $${expenseTotal.toFixed(2)}`, 20, 65);
    doc.text(`Balance: $${balance.toFixed(2)}`, 20, 75);
    
    // Add expense breakdown table
    doc.setFontSize(14);
    doc.text('Expense Breakdown by Category', 14, 90);
    
    const expensesByCategory = bookkeepingData
      .filter(entry => entry.type === 'expense')
      .reduce((acc, entry) => {
        const category = entry.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(entry.amount);
        return acc;
      }, {});
    
    const expenseTableData = Object.entries(expensesByCategory).map(([category, amount]) => [
      category.charAt(0).toUpperCase() + category.slice(1),
      `$${amount.toFixed(2)}`
    ]);
    
    doc.autoTable({
      startY: 95,
      head: [['Category', 'Amount']],
      body: expenseTableData,
    });
    
    // Add evaluation summary if available
    if (evaluationData.length > 0) {
      const latestEvaluation = evaluationData.sort((a, b) => 
        new Date(b.evaluationDate) - new Date(a.evaluationDate)
      )[0];
      
      const evaluationY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(14);
      doc.text('Latest Evaluation Summary', 14, evaluationY);
      
      doc.setFontSize(12);
      doc.text(`Evaluation Date: ${new Date(latestEvaluation.evaluationDate).toLocaleDateString()}`, 20, evaluationY + 10);
      doc.text(`Evaluator: ${latestEvaluation.evaluator}`, 20, evaluationY + 20);
      
      const overallScore = (
        (parseFloat(latestEvaluation.marketScore) + 
         parseFloat(latestEvaluation.financialScore) + 
         parseFloat(latestEvaluation.operationalScore) + 
         parseFloat(latestEvaluation.riskScore)) / 4
      ).toFixed(2);
      
      doc.text(`Overall Score: ${overallScore}/10`, 20, evaluationY + 30);
      
      doc.autoTable({
        startY: evaluationY + 35,
        head: [['Category', 'Score (out of 10)']],
        body: [
          ['Market Potential', latestEvaluation.marketScore],
          ['Financial Viability', latestEvaluation.financialScore],
          ['Operational Feasibility', latestEvaluation.operationalScore],
          ['Risk Assessment', latestEvaluation.riskScore]
        ],
      });
    }
    
    doc.save(`${selectedPlanName.replace(/\s+/g, '_')}_Report.pdf`);
  };

  // Export data to Excel
  const exportToExcel = () => {
    const selectedPlanName = businessPlans.find(plan => plan.id === selectedPlan)?.title || 'Business Plan';
    
    // Prepare financial data worksheet
    const financialData = bookkeepingData.map(entry => ({
      Date: new Date(entry.date).toLocaleDateString(),
      Description: entry.description,
      Type: entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
      Category: entry.category.charAt(0).toUpperCase() + entry.category.slice(1),
      Amount: parseFloat(entry.amount)
    }));
    
    // Prepare evaluation data worksheet if available
    const evaluationDataFormatted = evaluationData.map(evaluation => ({
      'Evaluation Date': new Date(evaluation.evaluationDate).toLocaleDateString(),
      'Evaluator': evaluation.evaluator,
      'Market Score': evaluation.marketScore,
      'Financial Score': evaluation.financialScore,
      'Operational Score': evaluation.operationalScore,
      'Risk Score': evaluation.riskScore,
      'Overall Score': ((evaluation.marketScore + evaluation.financialScore + evaluation.operationalScore + evaluation.riskScore) / 4).toFixed(2),
      'Comments': evaluation.comments || ''
    }));
    
    // Create workbook and add worksheets
    const wb = XLSX.utils.book_new();
    const wsFinancial = XLSX.utils.json_to_sheet(financialData);
    XLSX.utils.book_append_sheet(wb, wsFinancial, 'Financial Data');
    
    if (evaluationDataFormatted.length > 0) {
      const wsEvaluation = XLSX.utils.json_to_sheet(evaluationDataFormatted);
      XLSX.utils.book_append_sheet(wb, wsEvaluation, 'Evaluation Data');
    }
    
    // Generate Excel file
    XLSX.writeFile(wb, `${selectedPlanName.replace(/\s+/g, '_')}_Report.xlsx`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Business Plan Reports
        </Typography>
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
            onClick={exportToPDF}
            sx={{ mr: 2 }}
            disabled={!selectedPlan || loading}
          >
            Export to PDF
          </Button>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />} 
            onClick={exportToExcel}
            disabled={!selectedPlan || loading}
          >
            Export to Excel
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="business-plan-select-label">Select Business Plan</InputLabel>
          <Select
            labelId="business-plan-select-label"
            value={selectedPlan}
            label="Select Business Plan"
            onChange={handlePlanChange}
            disabled={businessPlans.length === 0}
          >
            {businessPlans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {plan.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Financial Summary */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Financial Summary</Typography>
                {bookkeepingData.length > 0 ? (
                  <Bar data={prepareFinancialData()} options={{ responsive: true }} />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No financial data available
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Expense Categories */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Expense Categories</Typography>
                {bookkeepingData.filter(entry => entry.type === 'expense').length > 0 ? (
                  <Pie data={prepareExpenseCategoriesData()} options={{ responsive: true }} />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No expense data available
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Cash Flow Over Time */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Cash Flow Over Time</Typography>
                {bookkeepingData.length > 0 ? (
                  <Line data={prepareCashFlowData()} options={{ responsive: true }} />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No cash flow data available
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Evaluation Scores */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Latest Evaluation Scores</Typography>
                {evaluationData.length > 0 ? (
                  <Bar data={prepareEvaluationScoresData()} options={{ responsive: true }} />
                ) : (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    No evaluation data available
                  </Typography>
                )}
              </Paper>
            </Grid>

            {/* Summary Statistics */}
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Summary Statistics</Typography>
                <Box sx={{ p: 2 }}>
                  {bookkeepingData.length > 0 ? (
                    <>
                      <Typography variant="body1" gutterBottom>
                        <strong>Total Income:</strong> $
                        {bookkeepingData
                          .filter(entry => entry.type === 'income')
                          .reduce((acc, entry) => acc + parseFloat(entry.amount), 0)
                          .toFixed(2)}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Total Expenses:</strong> $
                        {bookkeepingData
                          .filter(entry => entry.type === 'expense')
                          .reduce((acc, entry) => acc + parseFloat(entry.amount), 0)
                          .toFixed(2)}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Net Balance:</strong> $
                        {(bookkeepingData
                          .filter(entry => entry.type === 'income')
                          .reduce((acc, entry) => acc + parseFloat(entry.amount), 0) -
                          bookkeepingData
                          .filter(entry => entry.type === 'expense')
                          .reduce((acc, entry) => acc + parseFloat(entry.amount), 0))
                          .toFixed(2)}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Number of Transactions:</strong> {bookkeepingData.length}
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                      No financial data available
                    </Typography>
                  )}

                  {evaluationData.length > 0 && (
                    <>
                      <Typography variant="body1" sx={{ mt: 2 }} gutterBottom>
                        <strong>Latest Evaluation Date:</strong> {new Date(evaluationData
                          .sort((a, b) => new Date(b.evaluationDate) - new Date(a.evaluationDate))[0]
                          .evaluationDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Overall Score:</strong> {((evaluationData
                          .sort((a, b) => new Date(b.evaluationDate) - new Date(a.evaluationDate))[0]
                          .marketScore +
                          evaluationData
                          .sort((a, b) => new Date(b.evaluationDate) - new Date(a.evaluationDate))[0]
                          .financialScore +
                          evaluationData
                          .sort((a, b) => new Date(b.evaluationDate) - new Date(a.evaluationDate))[0]
                          .operationalScore +
                          evaluationData
                          .sort((a, b) => new Date(b.evaluationDate) - new Date(a.evaluationDate))[0]
                          .riskScore) / 4).toFixed(2)}/10
                      </Typography>
                    </>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default Reports;