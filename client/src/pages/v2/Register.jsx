'use client';

import { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
  Row,
  Col,
  Space,
  Select,
  Alert,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookOutlined,
  TwitterOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const Register = () => {
  const [form] = Form.useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [requireVerification, setRequireVerification] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerUser(values);

      // Check if email verification is required
      if (response.requireEmailVerification) {
        setRequireVerification(true);
        setRegistrationSuccess(true);
      } else {
        // If no verification required, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Register with ${provider}`);
    // In a real app, you would implement social registration here
  };

  if (registrationSuccess && requireVerification) {
    return (
      <Row
        justify="center"
        align="middle"
        style={{ minHeight: 'calc(100vh - 150px)' }}
      >
        <Col xs={22} sm={20} md={14} lg={10} xl={8}>
          <Card bordered={false} className="shadow-md p-8 text-center">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                <MailOutlined style={{ fontSize: 24 }} />
              </div>
              <Title level={2}>Verify Your Email</Title>
              <Paragraph className="text-gray-500">
                We've sent a verification link to your email address. Please
                check your inbox and click the link to verify your account.
              </Paragraph>
            </div>

            <Alert
              message="Registration Successful!"
              description="Your account has been created. Please verify your email to continue."
              type="success"
              showIcon
              className="mb-6"
            />

            <Space direction="vertical" className="w-full">
              <Button
                type="primary"
                size="large"
                block
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
              <Button
                type="link"
                onClick={() => navigate('/resend-verification')}
              >
                Didn't receive the email? Resend verification
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: 'calc(100vh - 150px)', padding: '40px 0' }}
    >
      <Col xs={22} sm={20} md={14} lg={10} xl={8}>
        <div className="text-center mb-8">
          <Title level={2}>Create an account</Title>
          <Text type="secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-[#0080ff]">
              Sign in
            </Link>
          </Text>
        </div>

        <Card bordered={false} className="shadow-md">
          {error && (
            <Alert
              message="Registration Failed"
              description={error}
              type="error"
              showIcon
              closable
              className="mb-6"
              onClose={() => setError(null)}
            />
          )}

          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Please input your full name!' },
                { min: 2, message: 'Name must be at least 2 characters!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Full Name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                {
                  type: 'email',
                  message: 'Please enter a valid email address!',
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="userType"
              label="I am a"
              rules={[
                { required: true, message: 'Please select a user type!' },
              ]}
            >
              <Select placeholder="Select user type" size="large">
                <Option value="student">Student</Option>
                <Option value="parent">Parent</Option>
                <Option value="teacher">Teacher</Option>
                <Option value="counselor">Career Counselor</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 8, message: 'Password must be at least 8 characters!' },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message:
                    'Password must include uppercase, lowercase, number and special character!',
                },
              ]}
              // extra="Password must be at least 8 characters and include uppercase, lowercase, number and special character."
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('The two passwords do not match!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item
              name="terms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            'You must agree to the terms and conditions'
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                I agree to the{' '}
                <Link to="/terms" className="text-[#0080ff]">
                  terms and conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#0080ff]">
                  privacy policy
                </Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Create Account
              </Button>
            </Form.Item>

            <Divider plain>or sign up with</Divider>

            <Space size="middle" className="w-full flex justify-center">
              <Button
                icon={<GoogleOutlined />}
                size="large"
                onClick={() => handleSocialLogin('Google')}
              >
                Google
              </Button>
              <Button
                icon={<FacebookOutlined />}
                size="large"
                onClick={() => handleSocialLogin('Facebook')}
              >
                Facebook
              </Button>
              <Button
                icon={<TwitterOutlined />}
                size="large"
                onClick={() => handleSocialLogin('Twitter')}
              >
                Twitter
              </Button>
            </Space>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
