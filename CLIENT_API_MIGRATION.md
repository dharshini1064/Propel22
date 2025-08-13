# Client API Configuration Migration Guide

This guide explains how to update the client components to use the centralized API configuration for Fly.io deployment.

## Overview

We've created a centralized API configuration to make it easier to deploy the application to Fly.io. This configuration:

1. Uses environment variables when available
2. Falls back to relative URLs in production
3. Uses localhost for development

## Files Created

- `client/src/config.js` - Contains the API URL configuration
- `client/src/api.js` - Creates an axios instance with the API URL

## Migration Steps

### Step 1: Import the API Instance

In each component that uses axios directly, replace:

```javascript
import axios from 'axios';
```

With:

```javascript
import api from '../api';
```

### Step 2: Update API Calls

Replace all axios calls with the api instance. For example:

```javascript
// Before
const response = await axios.get('/api/business-plans');

// After
const response = await api.get('/api/business-plans');
```

### Step 3: Remove /api Prefix (Optional)

Since the API URL already includes the base path, you can optionally remove the `/api` prefix from your requests:

```javascript
// Before
const response = await api.get('/api/business-plans');

// After
const response = await api.get('/business-plans');
```

However, this step is optional and depends on your API configuration. If you keep the `/api` prefix in your requests, make sure the `API_URL` in `config.js` doesn't already include it.

## Example Migration

### Before

```javascript
import axios from 'axios';

const fetchBusinessPlans = async () => {
  try {
    const response = await axios.get('/api/business-plans');
    setBusinessPlans(response.data);
  } catch (error) {
    console.error('Error fetching business plans:', error);
  }
};
```

### After

```javascript
import api from '../api';

const fetchBusinessPlans = async () => {
  try {
    const response = await api.get('/api/business-plans');
    setBusinessPlans(response.data);
  } catch (error) {
    console.error('Error fetching business plans:', error);
  }
};
```

## Testing

After migrating, test your application in both development and production modes to ensure API calls are working correctly.

### Development Testing

```bash
npm run dev
```

### Production Build Testing

```bash
npm run build
npm start
```

## Troubleshooting

If you encounter issues with API calls after migration:

1. Check the browser console for errors
2. Verify that the API URL is correctly configured in `config.js`
3. Ensure that the API server is running and accessible
4. Check for CORS issues if the API and client are on different domains