import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await fetch('http://localhost:8080/categories');
  const data = await response.json();
  return data;
});

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
