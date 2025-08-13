import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GradeIcon from '@mui/icons-material/Grade';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';

function Sidebar({ open, drawerWidth, toggleDrawer }) {
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Company Profile', icon: <BusinessIcon />, path: '/company-profile' },
    { text: 'Partners', icon: <PeopleIcon />, path: '/partners' },
    { text: 'Business Plans', icon: <AssignmentIcon />, path: '/business-plans' },
    { text: 'Bookkeeping', icon: <ReceiptIcon />, path: '/bookkeeping' },
    { text: 'Partner Evaluation', icon: <GradeIcon />, path: '/evaluations' },
    { text: 'Reports', icon: <BarChartIcon />, path: '/reports' },
    { text: 'Documents', icon: <DescriptionIcon />, path: '/documents' },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Toolbar>
        <Box
          component="img"
          sx={{ height: 40, width: 40, mr: 1 }}
          alt="Propel22 Logo"
          src="/logo.svg"
        />
        <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Propel22</Box>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;