import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TreeSelect } from 'antd';
import { fetchCategories } from './redux/categorySlice';

function App() {
  const { categories, loading } = useSelector(state => state.categories);

  const onChange = (value) => {
    alert(`Selected category ID: ${value}`);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  console.log(categories);

  return (
    <div>
      <TreeSelect
        treeData={categories.children}
        fieldNames={{ label: 'name', value: 'categoryId', children: 'children' }}
        onChange={onChange}
        treeDefaultExpandAll
        style={{ width: '100%' }}
      />
      {/* <button onClick={() => dispatch(fetchCategories())}>Fetch with Saga</button>
      <button onClick={() => dispatch(fetchCategories())}>Fetch with Hook</button> */}
    </div>
  );
}

export default App;
