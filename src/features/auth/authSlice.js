// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/index'; // Import your authService

const initialState = {
    user: null, // Supabase auth.users object, potentially merged with profile data
    isAuthenticated: false,
    role: null, // 'student' | 'company_admin' | 'admin' - retrieved from public.profiles
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Async Thunk for user login
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { user } = await authService.login(credentials);

            if (user) {
                const profile = await authService.getProfile(user.id);
                if (profile) {
                    // Return the merged user and profile data
                    return { ...user, profile };
                } else {
                    console.warn("User logged in but no profile found. Returning auth user only.");
                    return user; // Return just the auth.user if profile missing
                }
            } else {
                return rejectWithValue("Login successful, but no user data received.");
            }
        } catch (error) {
            console.error("Login Thunk Error:", error.message);
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

// Async Thunk for student registration
export const registerStudent = createAsyncThunk(
    'auth/registerStudent',
    async (userData, { rejectWithValue }) => {
        try {
            const { user } = await authService.registerStudent(userData);

            if (user) {
                const profile = await authService.getProfile(user.id);
                if (profile) {
                    return { ...user, profile };
                } else {
                    console.warn("Student registered, but profile data not immediately available. Returning auth user only.");
                    return user;
                }
            } else {
                return rejectWithValue("Registration successful, but email confirmation may be required. Please check your email.");
            }
        } catch (error) {
            console.error("Register Student Thunk Error:", error.message);
            return rejectWithValue(error.message || 'Student registration failed');
        }
    }
);

// Async Thunk for company registration
export const registerCompany = createAsyncThunk(
    'auth/registerCompany',
    async (companyData, { rejectWithValue }) => {
        try {
            const { user } = await authService.registerCompany(companyData);

            if (user) {
                const profile = await authService.getProfile(user.id);
                if (profile) {
                    return { ...user, profile };
                } else {
                    console.warn("Company registered, but profile data not immediately available. Returning auth user only.");
                    return user;
                }
            } else {
                return rejectWithValue("Registration successful, but email confirmation may be required. Please check your email.");
            }
        } catch (error) {
            console.error("Register Company Thunk Error:", error.message);
            return rejectWithValue(error.message || 'Company registration failed');
        }
    }
);

// Get current user (e.g., on app load or token refresh)
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const authUser = await authService.getCurrentUser();
            if (authUser) {
                const profile = await authService.getProfile(authUser.id);
                if (profile) {
                    return { ...authUser, profile }; // Return merged user
                } else {
                    console.warn("Authenticated user found, but no matching profile. User ID:", authUser.id);
                    return authUser; // Return auth user without profile
                }
            } else {
                return null; // No authenticated user found
            }
        } catch (error) {
            console.error("Get Current User Thunk Error:", error.message);
            authService.logout(); // Force logout on error to clear potentially invalid session
            return rejectWithValue(error.message || 'Failed to fetch user data');
        }
    }
);

// Async Thunk for user logout
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            return true; // Indicate success
        } catch (error) {
            console.error("Logout Thunk Error:", error.message);
            return rejectWithValue(error.message || 'Logout failed');
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;
            state.status = 'idle';
            state.error = null;
        },
        clearAuthError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- ALL addCase calls MUST come FIRST ---
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
                state.role = action.payload?.profile?.role || null;
                state.error = null;
            })
            .addCase(registerStudent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
                state.role = action.payload?.profile?.role || null;
                state.error = null;
            })
            .addCase(registerCompany.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
                state.role = action.payload?.profile?.role || null;
                state.error = null;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
                state.role = action.payload?.profile?.role || null;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
                state.status = 'succeeded';
                state.error = null;
            })

            // --- ALL addMatcher calls MUST come AFTER all addCase calls ---
            .addMatcher(
                (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
                (state) => {
                    state.status = 'loading';
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                    state.user = null;
                    state.isAuthenticated = false;
                    state.role = null;
                }
            );
    },
});

export const { clearUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;