'use client';

import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Table,
  Tag,
  Space,
  Alert,
  Modal,
  Tooltip,
  message,
  Divider,
  Tabs,
  Statistic,
  Badge,
  Progress,
  Empty,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  EditOutlined,
  HistoryOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { ClipboardList, GraduationCap, Award } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  getMLEnhancedRecommendations,
  fetchRecommendationHistoryForUser,
  updateMLEnhancedRecommendations,
} from '../../services/recommendationService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../../services/authService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// KCSE Grading System
const KCSE_GRADES = [
  { value: 'A', points: 12 },
  { value: 'A-', points: 11 },
  { value: 'B+', points: 10 },
  { value: 'B', points: 9 },
  { value: 'B-', points: 8 },
  { value: 'C+', points: 7 },
  { value: 'C', points: 6 },
  { value: 'C-', points: 5 },
  { value: 'D+', points: 4 },
  { value: 'D', points: 3 },
  { value: 'D-', points: 2 },
  { value: 'E', points: 1 },
];

// Available KCSE Subjects
const KCSE_SUBJECTS = [
  { id: 'english', name: 'English', category: 'Compulsory' },
  { id: 'kiswahili', name: 'Kiswahili', category: 'Compulsory' },
  { id: 'mathematics', name: 'Mathematics', category: 'Compulsory' },
  { id: 'biology', name: 'Biology', category: 'Sciences' },
  { id: 'chemistry', name: 'Chemistry', category: 'Sciences' },
  { id: 'physics', name: 'Physics', category: 'Sciences' },
  { id: 'history', name: 'History & Government', category: 'Humanities' },
  { id: 'geography', name: 'Geography', category: 'Humanities' },
  { id: 'cre', name: 'Christian Religious Education', category: 'Humanities' },
  { id: 'ire', name: 'Islamic Religious Education', category: 'Humanities' },
  { id: 'hre', name: 'Hindu Religious Education', category: 'Humanities' },
  { id: 'agriculture', name: 'Agriculture', category: 'Technical' },
  { id: 'business', name: 'Business Studies', category: 'Technical' },
  { id: 'computer', name: 'Computer Studies', category: 'Technical' },
  { id: 'homescience', name: 'Home Science', category: 'Technical' },
  { id: 'art', name: 'Art & Design', category: 'Creative Arts' },
  { id: 'music', name: 'Music', category: 'Creative Arts' },
  { id: 'french', name: 'French', category: 'Languages' },
  { id: 'german', name: 'German', category: 'Languages' },
  { id: 'arabic', name: 'Arabic', category: 'Languages' },
];

const ResultsInput = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isAddSubjectModalVisible, setIsAddSubjectModalVisible] =
    useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([
    { key: 'english', subject: 'english', grade: '' },
    { key: 'kiswahili', subject: 'kiswahili', grade: '' },
    { key: 'mathematics', subject: 'mathematics', grade: '' },
  ]);
  const [meanGrade, setMeanGrade] = useState({ grade: 'N/A', points: 0 });
  const [activeTab, setActiveTab] = useState('input');
  const [isEditMode, setIsEditMode] = useState(false);
  const [recommendationId, setRecommendationId] = useState(null);

  // Get current user data
  const { data: currentUserData, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const user = currentUserData?.user || authUser;
  console.log('User In ResultInput:', user);

  // Get recommendation history
  const {
    data: recommendationHistoryResponse = {},
    isLoading: historyLoading,
  } = useQuery({
    queryKey: ['recommendationHistory'],
    queryFn: fetchRecommendationHistoryForUser,
  });

  // Initialize form with user's KCSE results if available
  useEffect(() => {
    if (user?.kcseResults?.subjects && user.kcseResults.subjects.length > 0) {
      setIsEditMode(true);

      // Set form values
      form.setFieldsValue({
        year: user.kcseResults.year,
      });

      // Set subjects
      const userSubjects = user.kcseResults.subjects.map((subject) => ({
        key: subject.subject
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/&/g, ''),
        subject: subject.subject
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/&/g, ''),
        grade: subject.grade,
      }));

      setSubjects(userSubjects);

      // Calculate mean grade
      const calculatedMeanGrade = {
        grade: user.kcseResults.meanGrade,
        points: user.kcseResults.meanPoints,
      };

      setMeanGrade(calculatedMeanGrade);
    }
  }, [user, form]);

  // Calculate mean grade
  const calculateMeanGrade = (subjects) => {
    if (!subjects || subjects.length === 0) return { grade: 'N/A', points: 0 };

    const subjectsWithGrades = subjects.filter((subj) => subj.grade);
    if (subjectsWithGrades.length === 0) return { grade: 'N/A', points: 0 };

    const totalPoints = subjectsWithGrades.reduce((sum, subj) => {
      const grade = subj.grade;
      const points = KCSE_GRADES.find((g) => g.value === grade)?.points || 0;
      return sum + points;
    }, 0);

    const meanPoints = totalPoints / subjectsWithGrades.length;

    // Find the closest grade
    let meanGrade = 'E';
    for (const grade of KCSE_GRADES) {
      if (meanPoints >= grade.points) {
        meanGrade = grade.value;
        break;
      }
    }

    return { grade: meanGrade, points: meanPoints.toFixed(2) };
  };

  // Update mean grade when subjects change
  const updateMeanGrade = () => {
    const newMeanGrade = calculateMeanGrade(subjects);
    setMeanGrade(newMeanGrade);
  };

  // Handle grade change
  const handleGradeChange = (key, value) => {
    const updatedSubjects = subjects.map((subject) =>
      subject.key === key ? { ...subject, grade: value } : subject
    );
    setSubjects(updatedSubjects);

    // Update mean grade
    const newMeanGrade = calculateMeanGrade(updatedSubjects);
    setMeanGrade(newMeanGrade);
  };

  // Handle adding a new subject
  const handleAddSubject = () => {
    if (!selectedSubject) {
      messageApi.warning('Please select a subject');
      return;
    }

    // Check if subject already exists
    const exists = subjects.some((s) => s.subject === selectedSubject);
    if (exists) {
      messageApi.warning('You have already added this subject');
      return;
    }

    const newSubject = {
      key: selectedSubject,
      subject: selectedSubject,
      grade: '',
    };

    setSubjects([...subjects, newSubject]);
    setSelectedSubject('');
    setIsAddSubjectModalVisible(false);
  };

  // Handle removing a subject
  const handleRemoveSubject = (key) => {
    // Check if it's a compulsory subject
    const subjectInfo = KCSE_SUBJECTS.find((s) => s.id === key);
    if (subjectInfo?.category === 'Compulsory') {
      messageApi.error('You cannot remove compulsory subjects');
      return;
    }

    const updatedSubjects = subjects.filter((subject) => subject.key !== key);
    setSubjects(updatedSubjects);

    // Update mean grade
    const newMeanGrade = calculateMeanGrade(updatedSubjects);
    setMeanGrade(newMeanGrade);
  };

  // Get available subjects (not already selected)
  const getAvailableSubjects = () => {
    const selectedSubjects = subjects.map((s) => s.subject);
    return KCSE_SUBJECTS.filter((s) => !selectedSubjects.includes(s.id));
  };

  // Create new recommendations mutation
  const createMutation = useMutation({
    mutationFn: (data) => getMLEnhancedRecommendations(data),
    onSuccess: (data) => {
      messageApi.success({
        content:
          'Results submitted successfully. Redirecting to your career recommendations.',
        duration: 3,
      });
      console.log('Recommendations:', data);

      // Navigate to recommendations page
      navigate('/recommendations', { state: { recommendations: data } });
    },
    onError: (error) => {
      messageApi.error({
        content:
          error.message || 'Error submitting results. Please try again later.',
        duration: 5,
      });
    },
  });

  // Update recommendations mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateMLEnhancedRecommendations(data),
    onSuccess: (data) => {
      messageApi.success({
        content:
          'Results updated successfully. Redirecting to your career recommendations.',
        duration: 3,
      });

      // Navigate to recommendations page
      navigate('/recommendations', { state: { recommendations: data } });
    },
    onError: (error) => {
      messageApi.error({
        content:
          error.message || 'Error updating results. Please try again later.',
        duration: 5,
      });
    },
  });

  const onFinish = (values) => {
    // Validate that at least 7 subjects are provided
    const subjectsWithGrades = subjects.filter((s) => s.grade);
    if (subjectsWithGrades.length < 7) {
      messageApi.warning('Please provide grades for at least 7 subjects');
      return;
    }

    // Format data for API
    const formattedData = {
      year: values.year,
      subjects: subjects
        .filter((s) => s.grade)
        .map((s) => ({
          subject:
            KCSE_SUBJECTS.find((subj) => subj.id === s.subject)?.name ||
            s.subject,
          grade: s.grade,
          points: KCSE_GRADES.find((g) => g.value === s.grade)?.points || 0,
        })),
      meanGrade: meanGrade.grade,
      meanPoints: Number.parseFloat(meanGrade.points),
    };

    // Submit data based on mode (create or update)
    if (isEditMode) {
      updateMutation.mutate({
        id: recommendationId || 'current', // Use 'current' if no specific ID
        results: formattedData,
      });
    } else {
      createMutation.mutate({ results: formattedData });
    }
  };

  // Get subject name from ID
  const getSubjectName = (subjectId) => {
    const subject = KCSE_SUBJECTS.find((s) => s.id === subjectId);
    return subject ? subject.name : subjectId;
  };

  // Get subject category from ID
  const getSubjectCategory = (subjectId) => {
    const subject = KCSE_SUBJECTS.find((s) => s.id === subjectId);
    return subject ? subject.category : 'Other';
  };

  // Get color for grade
  const getGradeColor = (grade) => {
    if (grade?.startsWith('A')) return 'green';
    if (grade?.startsWith('B')) return 'blue';
    if (grade?.startsWith('C')) return 'orange';
    if (grade?.startsWith('D')) return 'volcano';
    return 'red';
  };

  // Calculate profile completion based on subjects
  const calculateProfileCompletion = () => {
    const subjectsWithGrades = subjects.filter((s) => s.grade);
    return Math.min(100, Math.round((subjectsWithGrades.length / 8) * 100));
  };

  // Group subjects by category
  const getSubjectsByCategory = () => {
    const categories = {};

    subjects.forEach((subject) => {
      if (!subject.grade) return;

      const category = getSubjectCategory(subject.subject);
      if (!categories[category]) {
        categories[category] = [];
      }

      categories[category].push({
        name: getSubjectName(subject.subject),
        grade: subject.grade,
        points: KCSE_GRADES.find((g) => g.value === subject.grade)?.points || 0,
      });
    });

    return categories;
  };

  // Calculate average points by category
  const getCategoryAverages = () => {
    const categories = getSubjectsByCategory();
    const averages = {};

    Object.keys(categories).forEach((category) => {
      const subjects = categories[category];
      const totalPoints = subjects.reduce((sum, subj) => sum + subj.points, 0);
      averages[category] = (totalPoints / subjects.length).toFixed(1);
    });

    return averages;
  };

  // Determine academic strengths
  const getAcademicStrengths = () => {
    const averages = getCategoryAverages();

    // Sort categories by average points
    return Object.keys(averages)
      .sort((a, b) => averages[b] - averages[a])
      .slice(0, 3)
      .map((category) => ({
        category,
        average: averages[category],
      }));
  };

  // Get recommendation history items
  const getRecommendationHistory = () => {
    return recommendationHistoryResponse?.data || [];
  };

  // Load a specific recommendation
  const loadRecommendation = (recommendation) => {
    if (!recommendation) return;

    setRecommendationId(recommendation._id);
    setIsEditMode(true);

    // Set form values
    form.setFieldsValue({
      year: recommendation.kcseResults.year,
    });

    // Set subjects
    const recommendationSubjects = recommendation.kcseResults.subjects.map(
      (subject) => ({
        key: subject.subject
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/&/g, ''),
        subject: subject.subject
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/&/g, ''),
        grade: subject.grade,
      })
    );

    setSubjects(recommendationSubjects);

    // Set mean grade
    setMeanGrade({
      grade: recommendation.kcseResults.meanGrade,
      points: recommendation.kcseResults.meanPoints,
    });

    // Switch to input tab
    setActiveTab('input');
  };

  // Table columns
  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text) => {
        const subjectInfo = KCSE_SUBJECTS.find((s) => s.id === text);
        const isCompulsory = subjectInfo?.category === 'Compulsory';

        return (
          <Space>
            {subjectInfo?.name || text}
            {isCompulsory && <Tag color="red">Required</Tag>}
          </Space>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'subject',
      key: 'category',
      render: (text) => {
        const subjectInfo = KCSE_SUBJECTS.find((s) => s.id === text);
        const category = subjectInfo?.category || 'Other';

        let color = 'default';
        switch (category) {
          case 'Compulsory':
            color = 'red';
            break;
          case 'Sciences':
            color = 'green';
            break;
          case 'Humanities':
            color = 'blue';
            break;
          case 'Technical':
            color = 'orange';
            break;
          case 'Creative Arts':
            color = 'purple';
            break;
          case 'Languages':
            color = 'cyan';
            break;
          default:
            color = 'default';
        }

        return <Tag color={color}>{category}</Tag>;
      },
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (text, record) => (
        <Select
          style={{ width: 120 }}
          value={text || undefined}
          onChange={(value) => handleGradeChange(record.key, value)}
          placeholder="Select grade"
        >
          {KCSE_GRADES.map((grade) => (
            <Option key={grade.value} value={grade.value}>
              {grade.value} ({grade.points} points)
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const subjectInfo = KCSE_SUBJECTS.find((s) => s.id === record.subject);
        const isCompulsory = subjectInfo?.category === 'Compulsory';

        return (
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            disabled={isCompulsory}
            onClick={() => handleRemoveSubject(record.key)}
          />
        );
      },
    },
  ];

  // Loading state
  const isLoading = userLoading || historyLoading;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            {/* Inner pulsing dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
          </div>

          {/* Loading text with fade animation */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-gray-700 animate-pulse">
              Loading Your Dashboard
            </h3>
            <p className="text-sm text-gray-500 animate-pulse">
              Preparing your career recommendations...
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex space-x-2">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 relative">
      {contextHolder}

      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl max-w-md w-full mx-4">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                {/* Outer rotating ring */}
                <div className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                {/* Inner pulsing dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-green-600 rounded-full animate-pulse"></div>
              </div>

              {/* Loading text with fade animation */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-gray-800 animate-pulse">
                  {isEditMode
                    ? 'Updating Your Results'
                    : 'Processing Your Results'}
                </h3>
                <p className="text-sm text-gray-600 animate-pulse">
                  {isEditMode
                    ? 'Refreshing your career recommendations...'
                    : 'Analyzing your grades and generating personalized recommendations...'}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex space-x-2">
                <div
                  className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full animate-pulse"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <Title level={2}>
          {isEditMode ? 'Update Your KCSE Results' : 'Input Your KCSE Results'}
        </Title>
        <Paragraph className="text-gray-500">
          {isEditMode
            ? 'Update your KCSE grades to get refreshed career recommendations based on your academic strengths.'
            : 'Enter your KCSE grades to get personalized career recommendations based on your academic strengths.'}
        </Paragraph>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <EditOutlined /> {isEditMode ? 'Update Results' : 'Input Results'}
            </span>
          }
          key="input"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ year: new Date().getFullYear() }}
          >
            <Row gutter={[24, 24]}>
              {/* Examination Details */}
              <Col xs={24}>
                <Card title="Examination Details">
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="year"
                        label="Year of Examination"
                        rules={[
                          { required: true, message: 'Year is required' },
                          {
                            type: 'number',
                            min: 1990,
                            max: new Date().getFullYear(),
                            message: `Year must be between 1990 and ${new Date().getFullYear()}`,
                            transform: (value) => Number(value),
                          },
                        ]}
                      >
                        <Input type="number" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={12}>
                      <Form.Item label="Mean Grade">
                        <Row gutter={8}>
                          <Col span={12}>
                            <Input
                              value={meanGrade.grade}
                              readOnly
                              addonAfter={
                                <Tag color={getGradeColor(meanGrade.grade)}>
                                  {meanGrade.grade}
                                </Tag>
                              }
                            />
                          </Col>
                          <Col span={8}>
                            <Input
                              value={meanGrade.points}
                              readOnly
                              addonAfter="pts"
                            />
                          </Col>
                          <Col span={4} className="flex items-center">
                            <Tooltip title="Mean grade is calculated automatically based on your subject grades">
                              <InfoCircleOutlined className="text-gray-500" />
                            </Tooltip>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Subject Grades */}
              <Col xs={24}>
                <Card
                  title="Subject Grades"
                  extra={
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsAddSubjectModalVisible(true)}
                    >
                      Add Subject
                    </Button>
                  }
                >
                  <Alert
                    message="Important!"
                    description="Please enter grades for at least 7 subjects, including the compulsory ones (English, Kiswahili, Mathematics)."
                    type="info"
                    showIcon
                    className="mb-4"
                  />

                  {subjects.length > 0 ? (
                    <Table
                      columns={columns}
                      dataSource={subjects}
                      pagination={false}
                      rowKey="key"
                    />
                  ) : (
                    <div className="text-center py-8">
                      <QuestionCircleOutlined
                        style={{ fontSize: 40, color: '#ccc' }}
                        className="mb-4"
                      />
                      <Paragraph className="text-gray-500">
                        No subjects added yet. Click "Add Subject" to begin.
                      </Paragraph>
                    </div>
                  )}

                  <Divider />

                  <div className="flex items-center">
                    <InfoCircleOutlined className="text-gray-500 mr-2" />
                    <Text type="secondary">
                      You need to enter at least 7 subjects to get accurate
                      career recommendations.
                    </Text>
                  </div>
                </Card>
              </Col>

              {/* Submit Button */}
              <Col xs={24} className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  disabled={isSubmitting}
                >
                  {isEditMode ? (
                    <>
                      <SaveOutlined style={{ marginRight: 8 }} />
                      Update Career Recommendations
                    </>
                  ) : (
                    <>
                      <ClipboardList size={16} style={{ marginRight: 8 }} />
                      Get Career Recommendations
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </TabPane>

        <TabPane
          tab={
            <span>
              <GraduationCap size={16} style={{ marginRight: 8 }} /> Academic
              Profile
            </span>
          }
          key="profile"
        >
          {subjects.some((s) => s.grade) ? (
            <Row gutter={[24, 24]}>
              {/* Profile Summary */}
              <Col xs={24}>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Statistic
                        title="Mean Grade"
                        value={meanGrade.grade}
                        suffix={`(${meanGrade.points} pts)`}
                        valueStyle={{
                          color:
                            getGradeColor(meanGrade.grade) === 'green'
                              ? '#52c41a'
                              : '#1890ff',
                        }}
                      />
                      <Divider />
                      <Statistic
                        title="Subjects Entered"
                        value={subjects.filter((s) => s.grade).length}
                        suffix={`/ ${subjects.length}`}
                      />
                      <Progress
                        percent={calculateProfileCompletion()}
                        status={
                          calculateProfileCompletion() >= 100
                            ? 'success'
                            : 'active'
                        }
                      />
                    </Col>

                    <Col xs={24} md={16}>
                      <Title level={5}>Academic Strengths</Title>
                      {getAcademicStrengths().length > 0 ? (
                        <Row gutter={[16, 16]}>
                          {getAcademicStrengths().map((strength, index) => (
                            <Col key={index} xs={24} sm={8}>
                              <Card size="small" className="text-center">
                                <Text strong>{strength.category}</Text>
                                <div>
                                  <Badge
                                    count={`${strength.average} pts`}
                                    style={{
                                      backgroundColor:
                                        strength.average >= 10
                                          ? '#52c41a'
                                          : strength.average >= 8
                                          ? '#1890ff'
                                          : strength.average >= 6
                                          ? '#faad14'
                                          : '#f5222d',
                                    }}
                                  />
                                </div>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <Empty description="Add more subjects with grades to see your academic strengths" />
                      )}
                    </Col>
                  </Row>
                </Card>
              </Col>

              {/* Subject Analysis */}
              <Col xs={24}>
                <Card title="Subject Analysis">
                  {Object.entries(getSubjectsByCategory()).length > 0 ? (
                    <Row gutter={[16, 24]}>
                      {Object.entries(getSubjectsByCategory()).map(
                        ([category, subjectList]) => (
                          <Col xs={24} md={12} lg={8} key={category}>
                            <Card
                              title={category}
                              size="small"
                              className="h-full"
                              extra={
                                <Tag color="blue">
                                  {getCategoryAverages()[category]} pts
                                </Tag>
                              }
                            >
                              <Table
                                dataSource={subjectList}
                                columns={[
                                  {
                                    title: 'Subject',
                                    dataIndex: 'name',
                                    key: 'name',
                                  },
                                  {
                                    title: 'Grade',
                                    dataIndex: 'grade',
                                    key: 'grade',
                                    render: (grade) => (
                                      <Tag color={getGradeColor(grade)}>
                                        {grade}
                                      </Tag>
                                    ),
                                  },
                                  {
                                    title: 'Points',
                                    dataIndex: 'points',
                                    key: 'points',
                                  },
                                ]}
                                pagination={false}
                                size="small"
                              />
                            </Card>
                          </Col>
                        )
                      )}
                    </Row>
                  ) : (
                    <Empty description="Add subjects with grades to see your analysis" />
                  )}
                </Card>
              </Col>

              {/* Performance Insights */}
              <Col xs={24}>
                <Card title="Performance Insights">
                  {subjects.filter((s) => s.grade).length >= 7 ? (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={8}>
                        <Card size="small" className="text-center">
                          <Title level={4}>
                            {meanGrade.points >= 10 ? (
                              <CheckCircleOutlined
                                style={{ color: '#52c41a' }}
                              />
                            ) : (
                              <CloseCircleOutlined
                                style={{ color: '#f5222d' }}
                              />
                            )}
                          </Title>
                          <Text>University Qualification</Text>
                          <div className="mt-2">
                            {meanGrade.points >= 10 ? (
                              <Tag color="success">Qualified</Tag>
                            ) : (
                              <Tag color="error">Not Qualified</Tag>
                            )}
                          </div>
                        </Card>
                      </Col>

                      <Col xs={24} md={8}>
                        <Card size="small" className="text-center">
                          <Title level={4}>
                            <Award
                              size={24}
                              color={
                                meanGrade.points >= 8 ? '#1890ff' : '#d9d9d9'
                              }
                            />
                          </Title>
                          <Text>College Qualification</Text>
                          <div className="mt-2">
                            {meanGrade.points >= 8 ? (
                              <Tag color="processing">Qualified</Tag>
                            ) : (
                              <Tag color="warning">Not Qualified</Tag>
                            )}
                          </div>
                        </Card>
                      </Col>

                      <Col xs={24} md={8}>
                        <Card size="small" className="text-center">
                          <Title level={4}>
                            <LineChartOutlined style={{ color: '#722ed1' }} />
                          </Title>
                          <Text>Performance Level</Text>
                          <div className="mt-2">
                            {meanGrade.points >= 10 ? (
                              <Tag color="success">Excellent</Tag>
                            ) : meanGrade.points >= 8 ? (
                              <Tag color="processing">Good</Tag>
                            ) : meanGrade.points >= 6 ? (
                              <Tag color="warning">Average</Tag>
                            ) : (
                              <Tag color="error">Below Average</Tag>
                            )}
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  ) : (
                    <Alert
                      message="Insufficient Data"
                      description="Enter at least 7 subjects with grades to see performance insights"
                      type="warning"
                      showIcon
                    />
                  )}
                </Card>
              </Col>
            </Row>
          ) : (
            <Card>
              <Empty
                description={
                  <span>
                    No academic data available. Please input your KCSE results
                    first.
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
              <div className="text-center mt-4">
                <Button type="primary" onClick={() => setActiveTab('input')}>
                  Input Results Now
                </Button>
              </div>
            </Card>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <HistoryOutlined /> Recommendation History
            </span>
          }
          key="history"
        >
          <Card>
            {getRecommendationHistory().length > 0 ? (
              <Table
                dataSource={getRecommendationHistory()}
                rowKey="_id"
                columns={[
                  {
                    title: 'Date',
                    dataIndex: 'createdAt',
                    key: 'createdAt',
                    render: (date) => new Date(date).toLocaleDateString(),
                  },
                  {
                    title: 'Mean Grade',
                    dataIndex: ['kcseResults', 'meanGrade'],
                    key: 'meanGrade',
                    render: (grade) => (
                      <Tag color={getGradeColor(grade)}>{grade}</Tag>
                    ),
                  },
                  {
                    title: 'Mean Points',
                    dataIndex: ['kcseResults', 'meanPoints'],
                    key: 'meanPoints',
                  },
                  {
                    title: 'Strengths',
                    dataIndex: 'strengths',
                    key: 'strengths',
                    render: (strengths) => (
                      <Space>
                        {strengths.map((strength, index) => (
                          <Tag key={index} color="blue">
                            {strength}
                          </Tag>
                        ))}
                      </Space>
                    ),
                  },
                  {
                    title: 'Actions',
                    key: 'actions',
                    render: (_, record) => (
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => loadRecommendation(record)}
                        >
                          Load & Edit
                        </Button>
                        <Button
                          type="default"
                          size="small"
                          onClick={() =>
                            navigate(`/recommendations/${record._id}`)
                          }
                        >
                          View Results
                        </Button>
                      </Space>
                    ),
                  },
                ]}
              />
            ) : (
              <Empty description="No recommendation history found" />
            )}
          </Card>
        </TabPane>
      </Tabs>

      {/* Add Subject Modal */}
      <Modal
        title="Add Subject"
        open={isAddSubjectModalVisible}
        onOk={handleAddSubject}
        onCancel={() => setIsAddSubjectModalVisible(false)}
        okButtonProps={{ disabled: !selectedSubject }}
      >
        <Form layout="vertical">
          <Form.Item label="Select Subject">
            <Select
              placeholder="Choose a subject"
              value={selectedSubject}
              onChange={(value) => setSelectedSubject(value)}
              style={{ width: '100%' }}
            >
              {getAvailableSubjects().map((subject) => (
                <Option key={subject.id} value={subject.id}>
                  {subject.name} ({subject.category})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ResultsInput;
