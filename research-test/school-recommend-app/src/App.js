import React from 'react';
import { Card, Button, Form, Input, Select, Space, Table} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolSaga } from './redux/action';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <b>{text}</b>,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Postcode',
    dataIndex: 'postcode',
    key: 'postcode',
  },
  {
    title: 'Distance(km)',
    dataIndex: 'distance',
    key: 'distance',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: 'Students',
    dataIndex: 'num_student',
    key: 'num_student',
  },
  {
    title: 'ICSEA',
    dataIndex: 'icsea',
    key: 'icsea',
  },
  {
    title: 'ATAR',
    dataIndex: 'atar',
    key: 'atar',
  }
]

const App = () => {
  const dispatch = useDispatch();
  const {schools} = useSelector(state => state.school);
  const [form] = Form.useForm();
  const default_school = {
    lat: '-35.02044765',
    lon: '117.8917733',
    num_student: '750',
    atar: '70',
    icsea: '1200',
    order: 'distance',
  }
  
  const onFinish = (values) => {
    dispatch(fetchSchoolSaga(values));
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue(default_school);
  };

  return (
    <Card title="Find Your Favorite School" style={{ width: '70%' }}>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{
          maxWidth: '80%',
        }}
      >

        <Form.Item name="lat" label="Latitude" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="lon" label="Longitude" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="num_student" label="Student Number" rules={[{ required: true }]}>
          {/* <Input /> */}
          <Select defaultValue="500-1000" >
            <Option value="125">0-250</Option>
            <Option value="375">250-500</Option>
            <Option value="750">500-1000</Option>
            <Option value="1500">1000+</Option>
          </Select>
        </Form.Item>

        <Form.Item name="icsea" label="ICSEA" rules={[{ required: true }]}>
          <Select defaultValue="500-1000" >
            <Option value="800">0-1000</Option>
            <Option value="1200">1000+</Option>
          </Select>
        </Form.Item>

        <Form.Item name="atar" label="ATAR" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="order" label="Order By" rules={[{ required: true }]}>
          <Select defaultValue="Distance" >
            <Option value="distance">Distance</Option>
            <Option value="num_student">Student Number</Option>
            <Option value="icsea">ICSEA</Option>
            <Option value="atar">ATAR</Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="link" htmlType="button" onClick={onFill}>
              Fill form
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={schools} />
    </Card>
  );
};
export default App;