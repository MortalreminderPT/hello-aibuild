import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCategoriesHook = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await fetch('http://localhost:8080/categories');
  const data = await response.json();
  return data;
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchCategoriesSuccess: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCategoriesFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesHook.pending, (state) => {
        console.log(state);
        state.loading = true;
      })
      .addCase(fetchCategoriesHook.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoriesHook.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
export const { fetchCategoriesSuccess, fetchCategoriesFailure, setLoading } = categorySlice.actions;