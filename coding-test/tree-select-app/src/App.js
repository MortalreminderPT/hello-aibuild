import { Card, Alert, TreeSelect, Spin, Row, Col } from 'antd';
import HookButton from './components/HookButton';
import SagaButton from './components/SagaButton';
import { useSelector } from 'react-redux';

function App() {
  // Extracting necessary state variables from the Redux store
  const { categories, tip, loading, error } = useSelector(state => state.categories);

  // Handles the change event when a category is selected in the TreeSelect component.
  const onChange = (value) => {
    alert(`Selected category ID: ${value}`);
  };

  return (
    <>
      {/* Main card container for the categories selector UI */}
      <Card
        title="Categories Selector"
        bordered={false}
        style={{ width: '50vw', justifyContent: 'center' }}
      >
        {/* Row containing the tip message */}
        <Row>
          <Col span={24}>
            <Alert
              message="Tip:"
              description={tip}
              type="info"
            />
          </Col>
        </Row>

        {/* Row containing two buttons: SagaButton and HookButton */}
        <Row style={{ marginTop: '10px' }}>
          <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <SagaButton />
          </Col>
          <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <HookButton />
          </Col>
        </Row>

        {/* Row containing either the TreeSelect component, an error alert, or a loading spinner */}
        <Row style={{ marginTop: '10px' }}>
          {!loading ? (
            !error ?
              (
                <TreeSelect
                  treeData={categories.children} // Data for the tree structure
                  fieldNames={{ label: 'name', value: 'categoryId', children: 'children' }} // Custom field mappings
                  onChange={onChange} // Event handler for selection changes
                  treeDefaultExpandAll // Automatically expand all tree nodes by default
                  style={{ width: '100%' }}
                />
              ) : (
                <Alert message="Failed to fetch, did you start the server?" type="error" showIcon />
              )
          ) : (
            <Spin /> // Loading spinner shown when data is being fetched
          )}
        </Row>
      </Card>
    </>
  );
}

export default App;
