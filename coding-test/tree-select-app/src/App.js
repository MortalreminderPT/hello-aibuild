import { TreeSelect } from 'antd';
import HookButton from './components/HookButton';
import SagaButton from './components/SagaButton';
import { useSelector } from 'react-redux';

function App() {
  const { categories, loading } = useSelector(state => state.categories);

  const onChange = (value) => {
    alert(`Selected category ID: ${value}`);
  };

  return (
    <>
      <SagaButton />
      <HookButton />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <TreeSelect
          treeData={categories.children}
          fieldNames={{ label: 'name', value: 'categoryId', children: 'children' }}
          onChange={onChange}
          treeDefaultExpandAll
          style={{ width: '100%' }}
        />
      )}
    </>
  );
}

export default App;
