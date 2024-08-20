import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchCategoriesHook } from '../redux/categorySlice';

/**
 * A functional React component that renders a button to trigger an asynchronous action
 * using Redux Toolkit's createAsyncThunk.
 * When the button is clicked, it dispatches the `fetchCategoriesHook` action to initiate the category fetching process.
 */
function HookButton() {
  const dispatch = useDispatch();

  // Dispatches the `fetchCategoriesHook` async thunk action to start fetching categories.
  const handleClick = () => {
    dispatch(fetchCategoriesHook());
  };

  return <Button onClick={handleClick}>Fetch with Hook</Button>;
}

export default HookButton;