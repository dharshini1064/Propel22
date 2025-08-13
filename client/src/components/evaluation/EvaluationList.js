import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const EvaluationList = () => {
  const navigate = useNavigate();
  const [evaluations, setEvaluations] = useState([]);
  const [businessPlans, setBusinessPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'evaluationDate', headerName: 'Date', width: 120, 
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
    },
    { field: 'evaluator', headerName: 'Evaluator', width: 180 },
    { field: 'businessPlanTitle', headerName: 'Business Plan', width: 200 },
    { field: 'overallScore', headerName: 'Overall Score', width: 150,
      renderCell: (params) => {
        const score = params.value;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Rating 
              value={score / 2} 
              precision={0.5} 
              readOnly 
              size="small" 
            />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {score.toFixed(1)}/10
            </Typography>
          </Box>
        );
      }
    },
    { field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleView(params.row.id)}
            title="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleEdit(params.row.id)}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => handleDeleteClick(params.row)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    },
  ];

  const fetchBusinessPlans = async () => {
    try {
      const response = await axios.get('/api/business-plans');
      setBusinessPlans(response.data);
    } catch (error) {
      console.error('Error fetching business plans:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load business plans',
        severity: 'error'
      });
    }
  };

  const fetchEvaluations = async (planId = '') => {
    try {
      setLoading(true);
      const url = planId ? `/api/evaluations?businessPlanId=${planId}` : '/api/evaluations';
      const response = await axios.get(url);
      
      // Enhance evaluations with business plan title and calculate overall score
      const enhancedEvaluations = await Promise.all(response.data.map(async (evaluation) => {
        try {
          const planResponse = await axios.get(`/api/business-plans/${evaluation.businessPlanId}`);
          const overallScore = (
            (parseFloat(evaluation.marketScore) + 
             parseFloat(evaluation.financialScore) + 
             parseFloat(evaluation.operationalScore) + 
             parseFloat(evaluation.riskScore)) / 4
          );
          
          return {
            ...evaluation,
            businessPlanTitle: planResponse.data.title,
            overallScore
          };
        } catch (error) {
          const overallScore = (
            (parseFloat(evaluation.marketScore) + 
             parseFloat(evaluation.financialScore) + 
             parseFloat(evaluation.operationalScore) + 
             parseFloat(evaluation.riskScore)) / 4
          );
          
          return {
            ...evaluation,
            businessPlanTitle: 'Unknown',
            overallScore
          };
        }
      }));
      
      setEvaluations(enhancedEvaluations);
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load evaluations',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessPlans();
    fetchEvaluations();
  }, []);

  const handlePlanChange = (event) => {
    const planId = event.target.value;
    setSelectedPlan(planId);
    fetchEvaluations(planId);
  };

  const handleAddNew = () => {
    navigate('/evaluations/new');
  };

  const handleView = (id) => {
    // In a real app, this might navigate to a detailed view
    navigate(`/evaluations/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/evaluations/${id}`);
  };

  const handleDeleteClick = (evaluation) => {
    setEvaluationToDelete(evaluation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!evaluationToDelete) return;
    
    try {
      await axios.delete(`/api/evaluations/${evaluationToDelete.id}`);
      setSnackbar({
        open: true,
        message: 'Evaluation deleted successfully',
        severity: 'success'
      });
      fetchEvaluations(selectedPlan);
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete evaluation',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setEvaluationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEvaluationToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Business Plan Evaluations
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          New Evaluation
        </Button>
      </Box>

      <Box sx={{ mb: 2, width: 300 }}>
        <FormControl fullWidth>
          <InputLabel id="business-plan-filter-label">Filter by Business Plan</InputLabel>
          <Select
            labelId="business-plan-filter-label"
            value={selectedPlan}
            label="Filter by Business Plan"
            onChange={handlePlanChange}
          >
            <MenuItem value="">All Business Plans</MenuItem>
            {businessPlans.map((plan) => (
              <MenuItem key={plan.id} value={plan.id}>
                {plan.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ height: 'calc(100% - 120px)', width: '100%' }}>
        <DataGrid
          rows={evaluations}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={loading}
        />
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this evaluation? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EvaluationList;