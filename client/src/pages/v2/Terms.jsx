'use client';

import {
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Button,
  Space,
  BackTop,
} from 'antd';
import {
  FileTextOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Paragraph, Text } = Typography;

const Terms = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BackTop />
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-500 mb-4">
          <FileTextOutlined style={{ fontSize: 24 }} />
        </div>
        <Title level={1} className="mb-2">
          Terms and Conditions
        </Title>
        <Text type="secondary" className="text-lg">
          Last updated: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack}
          className="mb-4"
        >
          Go Back
        </Button>
      </div>

      <Card className="shadow-md">
        <Space direction="vertical" size="large" className="w-full">
          
          {/* Introduction */}
          <div>
            <Title level={2} className="flex items-center gap-2">
              <InfoCircleOutlined className="text-blue-500" />
              Introduction
            </Title>
            <Paragraph className="text-lg">
              Welcome to our Career Management System. These Terms and Conditions ("Terms") govern your use of our 
              career guidance and management platform. By accessing or using our service, you agree to be bound by 
              these Terms.
            </Paragraph>
          </div>

          <Divider />

          {/* Acceptance of Terms */}
          <div>
            <Title level={2} className="flex items-center gap-2">
              <CheckCircleOutlined className="text-green-500" />
              Acceptance of Terms
            </Title>
            <Paragraph>
              By creating an account, accessing our platform, or using any of our services, you acknowledge that 
              you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do 
              not agree to these Terms, please do not use our service.
            </Paragraph>
          </div>

          <Divider />

          {/* Service Description */}
          <div>
            <Title level={2}>Service Description</Title>
            <Paragraph>
              Our Career Management System provides:
            </Paragraph>
            <ul className="list-disc pl-6 space-y-2">
              <li>Career assessment and recommendation tools</li>
              <li>Educational institution information and guidance</li>
              <li>Academic performance tracking and analysis</li>
              <li>Personalized career development resources</li>
              <li>Access to career counselors and advisors</li>
              <li>Educational and career planning tools</li>
            </ul>
          </div>

          <Divider />

          {/* User Accounts */}
          <div>
            <Title level={2}>User Accounts</Title>
            <Paragraph>
              To access certain features of our service, you must create an account. You agree to:
            </Paragraph>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </div>

          <Divider />

          {/* User Responsibilities */}
          <div>
            <Title level={2}>User Responsibilities</Title>
            <Paragraph>
              As a user of our platform, you agree to:
            </Paragraph>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service only for lawful purposes</li>
              <li>Respect the rights and privacy of other users</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
              <li>Not use the service to transmit harmful or malicious content</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Provide honest and accurate information in assessments</li>
            </ul>
          </div>

          <Divider />

          {/* Privacy and Data Protection */}
          <div>
            <Title level={2}>Privacy and Data Protection</Title>
            <Paragraph>
              We are committed to protecting your privacy and personal information. Our collection, use, and 
              protection of your data is governed by our Privacy Policy, which is incorporated into these Terms 
              by reference.
            </Paragraph>
            <Paragraph>
              We collect and process personal information including:
            </Paragraph>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, user type)</li>
              <li>Academic performance data</li>
              <li>Career assessment responses</li>
              <li>Usage analytics and preferences</li>
            </ul>
          </div>

          <Divider />

          {/* Intellectual Property */}
          <div>
            <Title level={2}>Intellectual Property</Title>
            <Paragraph>
              The Career Management System and its original content, features, and functionality are owned by us 
              and are protected by international copyright, trademark, patent, trade secret, and other intellectual 
              property laws.
            </Paragraph>
            <Paragraph>
              You may not:
            </Paragraph>
            <ul className="list-disc pl-6 space-y-2">
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use our trademarks or logos without authorization</li>
              <li>Create derivative works based on our platform</li>
            </ul>
          </div>

          <Divider />

          {/* Service Availability */}
          <div>
            <Title level={2}>Service Availability</Title>
            <Paragraph>
              We strive to provide continuous service availability, but we do not guarantee uninterrupted access. 
              We may temporarily suspend or restrict access for maintenance, updates, or other operational reasons.
            </Paragraph>
          </div>

          <Divider />

          {/* Limitation of Liability */}
          <div>
            <Title level={2} className="flex items-center gap-2">
              <ExclamationCircleOutlined className="text-orange-500" />
              Limitation of Liability
            </Title>
            <Paragraph>
              Our service is provided for informational and guidance purposes. While we strive to provide accurate 
              and helpful information, we cannot guarantee the accuracy, completeness, or suitability of our 
              recommendations for your specific situation.
            </Paragraph>
            <Paragraph>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages resulting from your use of our service.
            </Paragraph>
          </div>

          <Divider />

          {/* Termination */}
          <div>
            <Title level={2}>Termination</Title>
            <Paragraph>
              We may terminate or suspend your account and access to our service immediately, without prior notice, 
              for any reason, including breach of these Terms.
            </Paragraph>
            <Paragraph>
              You may terminate your account at any time by contacting us or using the account deletion feature 
              in your profile settings.
            </Paragraph>
          </div>

          <Divider />

          {/* Changes to Terms */}
          <div>
            <Title level={2}>Changes to Terms</Title>
            <Paragraph>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes 
              via email or through our platform. Your continued use of the service after changes constitutes 
              acceptance of the new Terms.
            </Paragraph>
          </div>

          <Divider />

          {/* Contact Information */}
          <div>
            <Title level={2}>Contact Information</Title>
            <Paragraph>
              If you have any questions about these Terms and Conditions, please contact us:
            </Paragraph>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <Paragraph className="mb-2">
                <strong>Email:</strong> support@careermanagementsystem.com
              </Paragraph>
              <Paragraph className="mb-2">
                <strong>Phone:</strong> +1 (555) 123-4567
              </Paragraph>
              <Paragraph>
                <strong>Address:</strong> 123 Career Street, Education City, EC 12345
              </Paragraph>
            </div>
          </div>

          <Divider />

          {/* Governing Law */}
          <div>
            <Title level={2}>Governing Law</Title>
            <Paragraph>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
              in which our company is incorporated, without regard to conflict of law principles.
            </Paragraph>
          </div>

          {/* Footer Actions */}
          <div className="text-center pt-6">
            <Space size="large">
              <Button type="primary" size="large" onClick={handleGoBack}>
                <ArrowLeftOutlined /> Go Back
              </Button>
              <Button size="large">
                <Link to="/register">Continue Registration</Link>
              </Button>
            </Space>
          </div>

        </Space>
      </Card>
    </div>
  );
};

export default Terms;
