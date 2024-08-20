import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchCategoriesHook } from '../redux/categorySlice';

function HookButton() {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(fetchCategoriesHook());
  };

  return <Button onClick={handleClick}>Fetch with Hook</Button>;
}

export default HookButton;