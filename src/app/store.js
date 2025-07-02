// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import opportunitiesReducer from '../features/opportunities/opportunitiesSlice';
import savedOpportunitiesReducer from '../features/savedOpportunities/savedOpportunitiesSlice';
import resourcesReducer from '../features/resources/resourcesSlice';
import userReducer from '../features/user/userSlice';
import companyReducer from '../features/company/companySlice';
import messagesReducer from '../features/messages/messagesSlice';
import applicationsReducer from '../features/applications/applicationsSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    opportunities: opportunitiesReducer,
    savedOpportunities: savedOpportunitiesReducer,
    resources: resourcesReducer,
    user: userReducer,
    company: companyReducer, // For company-specific data (e.g., posted opportunities)
    messages: messagesReducer,
    applications: applicationsReducer,
  },
  // DevTools are enabled by default in development
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myCustomMiddleware),
});