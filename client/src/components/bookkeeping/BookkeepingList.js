import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
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
  MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const BookkeepingList = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [businessPlans, setBusinessPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'date', headerName: 'Date', width: 120, 
      valueFormatter: (params) => new Date(params.value).toLocaleDateString() 
    },
    { field: 'description', headerName: 'Description', width: 250 },
    { field: 'amount', headerName: 'Amount', width: 120,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      cellClassName: (params) => {
        return params.row.type === 'income' ? 'income-cell' : 'expense-cell';
      }
    },
    { field: 'type', headerName: 'Type', width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)} 
          color={params.value === 'income' ? 'success' : 'error'}
          size="small"
        />
      )
    },
    { field: 'category', headerName: 'Category', width: 150,
      valueFormatter: (params) => params.value.charAt(0).toUpperCase() + params.value.slice(1)
    },
    { field: 'businessPlanTitle', headerName: 'Business Plan', width: 200 },
    { field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton 
            size="small" 
            color="primary" 
            onClick={() => handleEdit(params.row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={() => handleDeleteClick(params.row)}
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

  const fetchBookkeepingEntries = async (planId = '') => {
    try {
      setLoading(true);
      const url = planId ? `/api/bookkeeping?businessPlanId=${planId}` : '/api/bookkeeping';
      const response = await axios.get(url);
      
      // Enhance entries with business plan title
      const enhancedEntries = await Promise.all(response.data.map(async (entry) => {
        try {
          const planResponse = await axios.get(`/api/business-plans/${entry.businessPlanId}`);
          return {
            ...entry,
            businessPlanTitle: planResponse.data.title
          };
        } catch (error) {
          return {
            ...entry,
            businessPlanTitle: 'Unknown'
          };
        }
      }));
      
      setEntries(enhancedEntries);
    } catch (error) {
      console.error('Error fetching bookkeeping entries:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load bookkeeping entries',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessPlans();
    fetchBookkeepingEntries();
  }, []);

  const handlePlanChange = (event) => {
    const planId = event.target.value;
    setSelectedPlan(planId);
    fetchBookkeepingEntries(planId);
  };

  const handleAddNew = () => {
    navigate('/bookkeeping/new');
  };

  const handleEdit = (id) => {
    navigate(`/bookkeeping/${id}`);
  };

  const handleDeleteClick = (entry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;
    
    try {
      await axios.delete(`/api/bookkeeping/${entryToDelete.id}`);
      setSnackbar({
        open: true,
        message: 'Bookkeeping entry deleted successfully',
        severity: 'success'
      });
      fetchBookkeepingEntries(selectedPlan);
    } catch (error) {
      console.error('Error deleting bookkeeping entry:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete bookkeeping entry',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ height: '100%', width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Bookkeeping
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add Entry
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
          rows={entries}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={loading}
          sx={{
            '& .income-cell': {
              color: 'success.main',
            },
            '& .expense-cell': {
              color: 'error.main',
            },
          }}
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
            Are you sure you want to delete the entry "{entryToDelete?.description}"? This action cannot be undone.
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

export default BookkeepingList;