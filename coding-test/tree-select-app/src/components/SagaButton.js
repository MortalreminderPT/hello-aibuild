import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'react-redux';

/**
 * A functional React component that renders a button to trigger a Redux-Saga action.
 * When the button is clicked, it dispatches the 'FETCH_CATEGORIES_SAGA' action to initiate
 * the category fetching process using Redux-Saga.
 */
function SagaButton() {
  const dispatch = useDispatch();

  // Dispatches the 'FETCH_CATEGORIES_SAGA' action to start the Redux-Saga that fetch categories.
  const handleClick = () => {
    dispatch({ type: 'FETCH_CATEGORIES_SAGA' });
  };

  return <Button onClick={handleClick} >Fetch with Saga</Button>;
}

export default SagaButton;
