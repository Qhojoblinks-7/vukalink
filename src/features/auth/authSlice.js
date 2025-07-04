// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';

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
            // CORRECTED: authService.login returns the {user, session} object directly.
            const authData = await authService.login(credentials); // Assign the direct result

            if (authData && authData.user) { // Check authData and its user property
                const profile = await authService.getProfile(authData.user.id);
                if (profile) {
                    return { ...authData.user, profile };
                } else {
                    console.warn("User logged in but no profile found for ID:", authData.user.id, ". Returning auth user only.");
                    return authData.user;
                }
            } else {
                // This case should be rare if authService.login is successful, but handles if user is null
                return rejectWithValue("Login successful, but no user data received. Email confirmation might be required.");
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
            // CORRECTED: authService.registerStudent returns the {user, session} object directly.
            const authData = await authService.registerStudent(userData); // Assign the direct result

            if (authData && authData.user) {
                // After signup, user might not be immediately authenticated or profile created by trigger.
                // It's common to require email confirmation before full login/profile access.
                const profile = await authService.getProfile(authData.user.id);
                if (profile) {
                    console.log("Student registered and profile found:", profile);
                    return { ...authData.user, profile };
                } else {
                    console.warn("Student registered, but profile data not immediately available. Returning auth user only.");
                    return authData.user;
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
            // CORRECTED: authService.registerCompany returns the {user, session} object directly.
            const authData = await authService.registerCompany(companyData); // Assign the direct result

            if (authData && authData.user) {
                const profile = await authService.getProfile(authData.user.id);
                if (profile) {
                    console.log("Company registered and profile found:", profile);
                    return { ...authData.user, profile };
                } else {
                    console.warn("Company registered, but profile data not immediately available. Returning auth user only.");
                    return authData.user;
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
            const authUser = await authService.getCurrentUser(); // This now returns user or null
            if (authUser) {
                const profile = await authService.getProfile(authUser.id);
                if (profile) {
                    console.log("getCurrentUser: Found user and profile.");
                    return { ...authUser, profile };
                } else {
                    console.warn("getCurrentUser: Authenticated user found, but no matching profile. User ID:", authUser.id);
                    return authUser;
                }
            } else {
                console.log("getCurrentUser: No authenticated user found from service.");
                return null; // Explicitly return null if no user
            }
        } catch (error) {
            console.error("Get Current User Thunk Error:", error.message);
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
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = !!action.payload;
                state.user = action.payload;
                state.role = action.payload?.profile?.role || null;
                state.error = null;
            })
            .addCase(registerStudent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = !!action.payload; // Will be false if email confirmation is pending
                state.user = action.payload;
                state.role = action.payload?.profile?.role || null;
                state.error = null;
            })
            .addCase(registerCompany.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = !!action.payload; // Will be false if email confirmation is pending
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
                    // Only clear user on rejected if it's a login, register, or current user check
                    // For logout.rejected, we might keep the user but show an error.
                    if (action.type === login.rejected.type ||
                        action.type === registerStudent.rejected.type ||
                        action.type === registerCompany.rejected.type ||
                        action.type === getCurrentUser.rejected.type) {
                        state.user = null;
                        state.isAuthenticated = false;
                        state.role = null;
                    }
                }
            );
    },
});

export const { clearUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;