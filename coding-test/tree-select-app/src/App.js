import { Card, Alert, TreeSelect, Spin, Row, Col } from 'antd';
import HookButton from './components/HookButton';
import SagaButton from './components/SagaButton';
import { useSelector } from 'react-redux';

function App() {
  const { categories, tip, loading, error } = useSelector(state => state.categories);

  const onChange = (value) => {
    alert(`Selected category ID: ${value}`);
  };

  return (
    <>
      <Card title="Categories Selector" bordered={false} style={{ width: '50vw', justifyContent: 'center' }}>
        <Row>
          <Col span={24}>
            <Alert
              message="Tip:"
              description={tip}
              type="info"
            />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <SagaButton />
          </Col>
          <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <HookButton />
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          {!loading ? (
            !error ?
              (
                <TreeSelect
                  treeData={categories.children}
                  fieldNames={{ label: 'name', value: 'categoryId', children: 'children' }}
                  onChange={onChange}
                  treeDefaultExpandAll
                  style={{ width: '100%' }}
                />
              ) : (
                <Alert message="Failed to fetch, did you start the server?" type="error" showIcon />
              )
          ) : (
            <Spin />
          )}
        </Row>
      </Card>
    </>
  );
}

export default App;
