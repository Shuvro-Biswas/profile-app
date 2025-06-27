import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = '/api'

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Async thunks for API calls
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async ({ search = '', page = 1, per_page = 10 } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      params.append('page', page.toString())
      params.append('per_page', per_page.toString())
      
      const response = await axios.get(`${API_BASE_URL}/users?${params}`)
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch users'
      )
    }
  }
)

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthHeaders(),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch user'
      )
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to update profile'
      )
    }
  }
)

export const getCurrentProfile = createAsyncThunk(
  'user/getCurrentProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: getAuthHeaders(),
      })
      return response.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to fetch profile'
      )
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    currentUser: null,
    selectedUser: null,
    pagination: {
      total: 0,
      pages: 0,
      current_page: 1,
      per_page: 10,
    },
    isLoading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload.users
        state.pagination = {
          total: action.payload.total,
          pages: action.payload.pages,
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
        }
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedUser = action.payload
        state.error = null
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Get current profile
      .addCase(getCurrentProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getCurrentProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentUser = action.payload
        state.error = null
      })
      .addCase(getCurrentProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { setSearchQuery, clearSelectedUser, clearError } = userSlice.actions
export default userSlice.reducer

