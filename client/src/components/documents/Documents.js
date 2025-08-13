import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import axios from 'axios';

const Documents = () => {
  const [businessPlans, setBusinessPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState('contract');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
        setSnackbar({
          open: true,
          message: 'Failed to load business plans',
          severity: 'error'
        });
      }
    };

    fetchBusinessPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchDocuments(selectedPlan);
    }
  }, [selectedPlan]);

  const fetchDocuments = async (planId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/documents?businessPlanId=${planId}`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load documents',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (event) => {
    setSelectedPlan(event.target.value);
  };

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
    setUploadFile(null);
    setDocumentTitle('');
    setDocumentType('contract');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      if (!documentTitle) {
        setDocumentTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleTitleChange = (event) => {
    setDocumentTitle(event.target.value);
  };

  const handleTypeChange = (event) => {
    setDocumentType(event.target.value);
  };

  const handleUpload = async () => {
    if (!uploadFile || !documentTitle || !selectedPlan) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('title', documentTitle);
    formData.append('type', documentType);
    formData.append('businessPlanId', selectedPlan);

    try {
      await axios.post('/api/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSnackbar({
        open: true,
        message: 'Document uploaded successfully',
        severity: 'success'
      });

      handleUploadDialogClose();
      fetchDocuments(selectedPlan);
    } catch (error) {
      console.error('Error uploading document:', error);
      setSnackbar({
        open: true,
        message: 'Failed to upload document',
        severity: 'error'
      });
    }
  };

  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      await axios.delete(`/api/documents/${documentToDelete.id}`);
      setSnackbar({
        open: true,
        message: 'Document deleted successfully',
        severity: 'success'
      });
      fetchDocuments(selectedPlan);
    } catch (error) {
      console.error('Error deleting document:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete document',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleDownload = async (document) => {
    try {
      const response = await axios.get(`/api/documents/${document.id}/download`, {
        responseType: 'blob'
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.filename || `${document.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      setSnackbar({
        open: true,
        message: 'Failed to download document',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Group documents by type
  const groupedDocuments = documents.reduce((acc, doc) => {
    const type = doc.type || 'other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(doc);
    return acc;
  }, {});

  // Document type display names
  const documentTypeNames = {
    contract: 'Contracts',
    financial: 'Financial Documents',
    legal: 'Legal Documents',
    marketing: 'Marketing Materials',
    other: 'Other Documents'
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Documents
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={handleUploadDialogOpen}
          disabled={!selectedPlan}
        >
          Upload Document
        </Button>
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
        ) : documents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Documents Found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload documents to get started
            </Typography>
          </Box>
        ) : (
          <Box>
            {Object.entries(groupedDocuments).map(([type, docs]) => (
              <Box key={type} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {documentTypeNames[type] || type.charAt(0).toUpperCase() + type.slice(1)}
                  </Typography>
                </Box>
                <Paper variant="outlined" sx={{ mb: 2 }}>
                  <List>
                    {docs.map((doc, index) => (
                      <React.Fragment key={doc.id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                          <ListItemIcon>
                            <FileIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={doc.title}
                            secondary={
                              <>
                                {`Uploaded: ${new Date(doc.createdAt).toLocaleDateString()}`}
                                {doc.description && ` - ${doc.description}`}
                              </>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDownload(doc)} title="Download">
                              <DownloadIcon />
                            </IconButton>
                            <IconButton edge="end" onClick={() => handleDeleteClick(doc)} title="Delete">
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </React.Fragment>
                    ))}
                  </List>
                </Paper>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Upload a document to associate with the selected business plan.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Document Title"
            type="text"
            fullWidth
            value={documentTitle}
            onChange={handleTitleChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="document-type-label">Document Type</InputLabel>
            <Select
              labelId="document-type-label"
              value={documentType}
              label="Document Type"
              onChange={handleTypeChange}
            >
              <MenuItem value="contract">Contract</MenuItem>
              <MenuItem value="financial">Financial Document</MenuItem>
              <MenuItem value="legal">Legal Document</MenuItem>
              <MenuItem value="marketing">Marketing Material</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            startIcon={<UploadIcon />}
          >
            {uploadFile ? uploadFile.name : 'Select File'}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button onClick={handleUpload} color="primary" disabled={!uploadFile || !documentTitle}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the document "{documentToDelete?.title}"? This action cannot be undone.
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

export default Documents;