'use client';

import { Modal, Form, Input, Select, Button, Divider, Spin, Alert } from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchCareers } from '../../../../services/api';
import { useEffect } from 'react';

const { Option } = Select;
const { TextArea } = Input;

const ProgramForm = ({
  visible,
  onCancel,
  onSubmit,
  currentInstitution,
  currentProgram,
  loading,
}) => {
  const [form] = Form.useForm();

  // Fetch careers for selection
  const {
    data: careersResponse,
    isLoading: careersLoading,
    error: careersError,
  } = useQuery({
    queryKey: ['careers-for-program'],
    queryFn: () => fetchCareers({ limit: 1000 }), // Get all careers for selection
    enabled: visible, // Only fetch when modal is visible
  });

  const careers = careersResponse?.data || [];

  // Sort careers alphabetically by title for better UX
  const sortedCareers = [...careers].sort((a, b) => 
    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
  );

  // Group careers by category for better organization
  const careersByCategory = sortedCareers.reduce((acc, career) => {
    const category = career.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(career);
    return acc;
  }, {});

  // Initialize form with proper values when modal opens or program changes
  useEffect(() => {
    if (visible) {
      if (currentProgram) {
        // Edit mode - populate form with existing program data
        form.setFieldsValue({
          name: currentProgram.name,
          level: currentProgram.level,
          duration: currentProgram.duration,
          description: currentProgram.description,
          tuitionFees: currentProgram.tuitionFees,
          careers: currentProgram.careers || [],
          minimumGrade: currentProgram.entryRequirements?.minimumGrade,
          specificSubjects: currentProgram.entryRequirements?.specificSubjects || [],
          additionalRequirements: currentProgram.entryRequirements?.additionalRequirements || [],
        });
      } else {
        // Add mode - reset form to default values
        form.resetFields();
        form.setFieldsValue({
          level: 'Bachelors',
          specificSubjects: [],
          additionalRequirements: [],
          careers: [],
        });
      }
    }
  }, [visible, currentProgram, form]);

  // Debug logging
  console.log('ProgramForm Debug:', {
    visible,
    currentProgram: currentProgram?.name,
    careersLoading,
    careersError,
    careersCount: careers.length,
    careersResponse
  });

  return (
    <Modal
      title={
        <div className="flex items-center">
          {currentProgram ? (
            <>
              <EditOutlined className="mr-2 text-blue-500" />
              <span>Edit Program: {currentProgram?.name}</span>
            </>
          ) : (
            <>
              <PlusOutlined className="mr-2 text-green-500" />
              <span>Add New Program to {currentInstitution?.name}</span>
            </>
          )}
        </div>
      }
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          level: 'Bachelors',
          specificSubjects: [],
          additionalRequirements: [],
          careers: [],
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="name"
          label="Program Name"
          rules={[
            { required: true, message: 'Please enter program name' },
            { min: 3, message: 'Program name must be at least 3 characters' },
            { max: 100, message: 'Program name must be less than 100 characters' }
          ]}
        >
          <Input placeholder="e.g. Bachelor of Science in Computer Science" />
        </Form.Item>

          <Form.Item
            name="level"
            label="Program Level"
            rules={[{ required: true, message: 'Please select program level' }]}
          >
            <Select placeholder="Select level">
              <Option value="Certificate">Certificate</Option>
              <Option value="Diploma">Diploma</Option>
              <Option value="Bachelors">Bachelors</Option>
              <Option value="Masters">Masters</Option>
              <Option value="Doctorate">Doctorate</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="duration"
            label="Duration"
            rules={[
              { required: true, message: 'Please enter program duration' },
              { min: 2, message: 'Duration must be at least 2 characters' },
              { max: 20, message: 'Duration must be less than 20 characters' }
            ]}
          >
            <Input placeholder="e.g. 4 years" />
          </Form.Item>

          <Form.Item name="tuitionFees" label="Tuition Fees">
            <Input placeholder="e.g. KES 120,000 per semester" />
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea rows={3} placeholder="Describe the program..." />
        </Form.Item>

        <Form.Item
          name="careers"
          label="Related Careers"
          extra="Select the careers that this program prepares students for. Use search to find specific careers quickly."
          rules={[
            { required: true, message: 'Please select at least one career' },
            { type: 'array', min: 1, message: 'Please select at least one career' }
          ]}
        >
          {careersLoading ? (
            <div className="text-center py-4">
              <Spin size="small" />
              <div className="mt-2 text-gray-500">Loading careers...</div>
            </div>
          ) : careersError ? (
            <Alert
              message="Error loading careers"
              description={careersError?.message || "Please try again later"}
              type="error"
              size="small"
            />
          ) : (
            <Select
              mode="multiple"
              placeholder="🔍 Search and select careers..."
              showSearch
              allowClear
              maxTagCount="responsive"
              maxTagTextLength={20}
              filterOption={(input, option) => {
                const searchText = input.toLowerCase();
                const careerTitle = option?.title?.toLowerCase() || '';
                const careerCategory = option?.category?.toLowerCase() || '';
                const careerDescription = option?.description?.toLowerCase() || '';
                
                return careerTitle.includes(searchText) || 
                       careerCategory.includes(searchText) ||
                       careerDescription.includes(searchText);
              }}
              optionFilterProp="children"
              notFoundContent={
                <div className="text-center py-4 text-gray-500">
                  <SearchOutlined className="text-2xl mb-2" />
                  <div>No careers found matching your search</div>
                  <div className="text-sm mt-1">Try a different search term</div>
                </div>
              }
              dropdownRender={(menu) => (
                <div>
                  <div className="px-3 py-2 text-xs text-gray-500 border-b">
                    📚 {sortedCareers.length} careers available • Grouped by category
                  </div>
                  {menu}
                </div>
              )}
            >
              {Object.entries(careersByCategory).map(([category, categoryCareers]) => (
                <Select.OptGroup key={category} label={`📁 ${category} (${categoryCareers.length})`}>
                  {categoryCareers.map((career) => (
                    <Option 
                      key={career._id} 
                      value={career._id}
                      title={career.title}
                      category={career.category}
                      description={career.description}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{career.title}</span>
                        <span className="text-xs text-gray-500">
                          {career.description?.substring(0, 60)}
                          {career.description?.length > 60 ? '...' : ''}
                        </span>
                      </div>
                    </Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          )}
        </Form.Item>

        <Divider orientation="left">Entry Requirements</Divider>

        <Form.Item name="minimumGrade" label="Minimum Grade">
          <Select placeholder="Select minimum grade">
            <Option value="A">A</Option>
            <Option value="A-">A-</Option>
            <Option value="B+">B+</Option>
            <Option value="B">B</Option>
            <Option value="B-">B-</Option>
            <Option value="C+">C+</Option>
            <Option value="C">C</Option>
            <Option value="C-">C-</Option>
            <Option value="D+">D+</Option>
            <Option value="D">D</Option>
          </Select>
        </Form.Item>

        <Form.List name="specificSubjects">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <div
                  key={key}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'subject']}
                    rules={[
                      { required: true, message: 'Please enter subject' },
                    ]}
                  >
                    <Input placeholder="Subject (e.g. Mathematics)" />
                  </Form.Item>
                  <div className="flex items-center gap-2">
                    <Form.Item
                      {...restField}
                      name={[name, 'grade']}
                      className="flex-1"
                      rules={[
                        { required: true, message: 'Please enter grade' },
                      ]}
                    >
                      <Select placeholder="Grade">
                        <Option value="A">A</Option>
                        <Option value="A-">A-</Option>
                        <Option value="B+">B+</Option>
                        <Option value="B">B</Option>
                      </Select>
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                    />
                  </div>
                </div>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Subject Requirement
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item
          name="additionalRequirements"
          label="Additional Requirements"
          extra="Press Enter after each requirement"
        >
          <Select
            mode="tags"
            placeholder="Add additional requirements"
            style={{ width: '100%' }}
          />
        </Form.Item>

        <div className="flex justify-end mt-4">
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {currentProgram ? 'Update Program' : 'Add Program'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ProgramForm;
