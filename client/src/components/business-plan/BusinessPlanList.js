import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { format } from 'date-fns';

// Mock data for business plans
const mockBusinessPlans = [
  {
    id: '1',
    partnerName: 'Partner A',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-02-10'),
    status: 'active',
    revenue: 120000,
    pbit: 19125,
  },
  {
    id: '2',
    partnerName: 'Partner B',
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05'),
    status: 'draft',
    revenue: 85000,
    pbit: 12750,
  },
  {
    id: '3',
    partnerName: 'Partner C',
    createdAt: new Date('2022-11-20'),
    updatedAt: new Date('2023-01-30'),
    status: 'completed',
    revenue: 150000,
    pbit: 22500,
  },
];

function BusinessPlanList() {
  const navigate = useNavigate();
  const [businessPlans, setBusinessPlans] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setBusinessPlans(mockBusinessPlans);
  }, []);

  const handleCreateNew = () => {
    navigate('/business-plans/create');
  };

  const handleView = (id) => {
    navigate(`/business-plans/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/business-plans/${id}/edit`);
  };

  const handleDeleteClick = (plan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would call an API
    setBusinessPlans(businessPlans.filter(plan => plan.id !== planToDelete.id));
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPlanToDelete(null);
  };

  const handleExportPdf = (id) => {
    // In a real app, this would generate and download a PDF
    console.log(`Exporting business plan ${id} as PDF`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Joint Business Plans
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNew}
        >
          Create New Plan
        </Button>
      </Box>

      {businessPlans.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No business plans yet
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Create your first joint business plan to start collaborating with partners.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
          >
            Create New Plan
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {businessPlans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                      {plan.partnerName}
                    </Typography>
                    <Chip
                      label={plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      color={getStatusColor(plan.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created: {format(plan.createdAt, 'MMM d, yyyy')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Last updated: {format(plan.updatedAt, 'MMM d, yyyy')}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Revenue
                      </Typography>
                      <Typography variant="h6">
                        ${plan.revenue.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        PBIT
                      </Typography>
                      <Typography variant="h6">
                        ${plan.pbit.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                
                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                  <Box>
                    <IconButton onClick={() => handleView(plan.id)} title="View">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(plan.id)} title="Edit">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(plan)} title="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  <IconButton onClick={() => handleExportPdf(plan.id)} title="Export as PDF">
                    <PictureAsPdfIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Business Plan</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the business plan for {planToDelete?.partnerName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default BusinessPlanList;