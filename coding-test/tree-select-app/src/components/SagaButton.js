import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';


function SagaButton() {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch({ type: 'FETCH_CATEGORIES_SAGA' });
  };

  return <Button onClick={handleClick}>Fetch Categories with Saga</Button>;
}

export default SagaButton;
