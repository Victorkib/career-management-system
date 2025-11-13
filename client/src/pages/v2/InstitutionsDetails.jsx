'use client';

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Spin,
  Divider,
  Alert,
  Tabs,
  Tag,
  Avatar,
  Breadcrumb,
  Badge,
  Descriptions,
  Image,
  List,
  Modal,
  Empty,
  Input,
  ConfigProvider,
  Tooltip,
  message,
  Progress,
  Statistic,
  Timeline,
} from 'antd';
import {
  BankOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  BookOutlined,
  DollarOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  PrinterOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  BuildOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  EyeOutlined,
  CopyOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchInstitution } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const InstitutionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // Fetch institution details
  const {
    data: institutionData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['institution', id],
    queryFn: () => fetchInstitution(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  // Get institution data
  const institution = institutionData?.data;

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(
      isFavorite ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  // Show share modal
  const showShareModal = () => {
    setShareModalVisible(true);
  };

  // Hide share modal
  const handleShareModalCancel = () => {
    setShareModalVisible(false);
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Handle image preview
  const handleImagePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setImagePreviewVisible(true);
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      message.success('Link copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy link');
    }
  };

  // Share functions
  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out ${institution?.name} - ${institution?.description}`
    );
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      '_blank'
    );
  };

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `Check out ${institution?.name} - ${institution?.description}`
    );
    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      '_blank'
    );
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      '_blank'
    );
  };

  // Calculate institution age
  const getInstitutionAge = () => {
    if (!institution?.establishedYear) return null;
    return new Date().getFullYear() - institution.establishedYear;
  };

  // Get program levels distribution
  const getProgramLevelsDistribution = () => {
    if (!institution?.programs?.length) return {};
    return institution.programs.reduce((acc, program) => {
      acc[program.level] = (acc[program.level] || 0) + 1;
      return acc;
    }, {});
  };

  // Render social media links
  const renderSocialLinks = () => {
    const socialMedia = institution?.contact?.socialMedia || {};

    return (
      <div className="flex gap-3 mt-2">
        {socialMedia.facebook && (
          <Tooltip title="Facebook">
            <a
              href={socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 dark:bg-gray-700 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              <FacebookOutlined />
            </a>
          </Tooltip>
        )}
        {socialMedia.twitter && (
          <Tooltip title="Twitter">
            <a
              href={socialMedia.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300 dark:bg-gray-700 dark:text-blue-300 dark:hover:bg-blue-400 dark:hover:text-white"
            >
              <TwitterOutlined />
            </a>
          </Tooltip>
        )}
        {socialMedia.instagram && (
          <Tooltip title="Instagram">
            <a
              href={socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300 dark:bg-gray-700 dark:text-pink-400 dark:hover:from-pink-500 dark:hover:to-purple-500 dark:hover:text-white"
            >
              <InstagramOutlined />
            </a>
          </Tooltip>
        )}
        {socialMedia.linkedin && (
          <Tooltip title="LinkedIn">
            <a
              href={socialMedia.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300 dark:bg-gray-700 dark:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
            >
              <LinkedinOutlined />
            </a>
          </Tooltip>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Spin size="large" />
        <Text className="mt-4 dark:text-gray-300">
          Loading institution details...
        </Text>
      </div>
    );
  }

  if (isError || !institution) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Alert
          type="error"
          message="Error loading institution"
          description={
            error?.response?.data?.error ||
            'There was a problem fetching the institution details. Please try again later.'
          }
          className="w-full max-w-2xl mb-6"
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/institutions')}
        >
          Back to Institutions
        </Button>
      </div>
    );
  }

  const programLevelsDistribution = getProgramLevelsDistribution();
  const institutionAge = getInstitutionAge();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode
          ? ConfigProvider.darkAlgorithm
          : ConfigProvider.defaultAlgorithm,
      }}
    >
      <div className="transition-colors duration-300">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <Breadcrumb className="mb-2 md:mb-0">
            <Breadcrumb.Item>
              <Link
                to="/"
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Home
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link
                to="/institutions"
                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Institutions
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="dark:text-gray-300">
              {institution.name}
            </Breadcrumb.Item>
          </Breadcrumb>

          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/institutions')}
            className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Back to Institutions
          </Button>
        </div>

        {/* Institution Header */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row">
            {/* Institution Logo and Basic Info */}
            <div className="lg:w-1/3 mb-6 lg:mb-0 lg:pr-6">
              <div className="text-center lg:text-left">
                <Avatar
                  src={
                    institution.logo || '/placeholder.svg?height=120&width=120'
                  }
                  size={120}
                  icon={<BankOutlined />}
                  className="border-4 border-gray-200 dark:border-gray-700 mb-4"
                />
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                  <Tag color="blue" className="text-sm px-3 py-1">
                    {institution.type}
                  </Tag>
                  {institution.featured && (
                    <Tag
                      color="gold"
                      icon={<StarFilled />}
                      className="text-sm px-3 py-1"
                    >
                      FEATURED
                    </Tag>
                  )}
                  {institutionAge && (
                    <Tag color="green" className="text-sm px-3 py-1">
                      {institutionAge} years old
                    </Tag>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card
                  size="small"
                  className="text-center dark:bg-gray-700 dark:border-gray-600"
                >
                  <Statistic
                    title="Programs"
                    value={institution.programs?.length || 0}
                    prefix={<BookOutlined className="text-blue-500" />}
                    valueStyle={{
                      fontSize: '1.5rem',
                      color: isDarkMode ? '#fff' : undefined,
                    }}
                  />
                </Card>
                <Card
                  size="small"
                  className="text-center dark:bg-gray-700 dark:border-gray-600"
                >
                  <Statistic
                    title="Facilities"
                    value={institution.facilities?.length || 0}
                    prefix={<BuildOutlined className="text-green-500" />}
                    valueStyle={{
                      fontSize: '1.5rem',
                      color: isDarkMode ? '#fff' : undefined,
                    }}
                  />
                </Card>
                {institution.views && (
                  <Card
                    size="small"
                    className="text-center dark:bg-gray-700 dark:border-gray-600"
                  >
                    <Statistic
                      title="Views"
                      value={institution.views}
                      prefix={<EyeOutlined className="text-purple-500" />}
                      valueStyle={{
                        fontSize: '1.2rem',
                        color: isDarkMode ? '#fff' : undefined,
                      }}
                    />
                  </Card>
                )}
                {institution.establishedYear && (
                  <Card
                    size="small"
                    className="text-center dark:bg-gray-700 dark:border-gray-600"
                  >
                    <Statistic
                      title="Established"
                      value={institution.establishedYear}
                      prefix={<CalendarOutlined className="text-orange-500" />}
                      valueStyle={{
                        fontSize: '1.2rem',
                        color: isDarkMode ? '#fff' : undefined,
                      }}
                    />
                  </Card>
                )}
              </div>
            </div>

            {/* Institution Details */}
            <div className="lg:w-2/3">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                <div className="mb-4 lg:mb-0">
                  <Title level={1} className="mb-3 dark:text-white">
                    {institution.name}
                  </Title>

                  <div className="flex items-center mb-4 text-lg dark:text-gray-400">
                    <EnvironmentOutlined className="mr-2 text-blue-500" />
                    <span>
                      {institution.location?.city}
                      {institution.location?.county &&
                        `, ${institution.location.county}`}
                      {institution.location?.country &&
                        `, ${institution.location.country}`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Tooltip
                    title={
                      isFavorite ? 'Remove from favorites' : 'Add to favorites'
                    }
                  >
                    <Button
                      type="text"
                      size="large"
                      icon={
                        isFavorite ? (
                          <HeartFilled className="text-red-500" />
                        ) : (
                          <HeartOutlined />
                        )
                      }
                      onClick={toggleFavorite}
                      className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                    />
                  </Tooltip>
                  <Tooltip title="Share">
                    <Button
                      type="text"
                      size="large"
                      icon={<ShareAltOutlined />}
                      onClick={showShareModal}
                      className="dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                    />
                  </Tooltip>
                  <Tooltip title="Print">
                    <Button
                      type="text"
                      size="large"
                      icon={<PrinterOutlined />}
                      onClick={handlePrint}
                      className="print-button dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                    />
                  </Tooltip>
                </div>
              </div>

              <Paragraph className="dark:text-gray-300 text-lg leading-relaxed mb-6">
                {institution.description}
              </Paragraph>

              {/* Program Levels Distribution */}
              {Object.keys(programLevelsDistribution).length > 0 && (
                <div className="mb-6">
                  <Title level={5} className="dark:text-white mb-3">
                    Program Levels Distribution
                  </Title>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(programLevelsDistribution).map(
                      ([level, count]) => (
                        <div key={level} className="text-center">
                          <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
                            {count}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {level}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="primary"
                  size="large"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0"
                >
                  Apply Now
                </Button>
                <Button
                  size="large"
                  icon={<DownloadOutlined />}
                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Download Brochure
                </Button>
                <Button
                  size="large"
                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Request Information
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Row gutter={[24, 24]}>
          {/* Left Column - Main Information */}
          <Col xs={24} lg={16}>
            <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
              <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
                <TabPane
                  tab={
                    <span className="flex items-center">
                      <InfoCircleOutlined className="mr-2" /> Overview
                    </span>
                  }
                  key="overview"
                >
                  <div className="py-4">
                    <Descriptions
                      title={
                        <span className="dark:text-white text-xl">
                          Institution Information
                        </span>
                      }
                      bordered
                      column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
                      className="mb-8 dark:text-gray-300"
                      labelStyle={{
                        color: isDarkMode
                          ? 'rgba(255, 255, 255, 0.85)'
                          : undefined,
                        backgroundColor: isDarkMode ? '#1f2937' : undefined,
                        fontWeight: '600',
                      }}
                      contentStyle={{
                        color: isDarkMode
                          ? 'rgba(255, 255, 255, 0.65)'
                          : undefined,
                        backgroundColor: isDarkMode ? '#374151' : undefined,
                      }}
                    >
                      {institution.establishedYear && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <CalendarOutlined className="mr-2" /> Established
                            </span>
                          }
                        >
                          <div>
                            <div className="font-semibold">
                              {institution.establishedYear}
                            </div>
                            {institutionAge && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {institutionAge} years of excellence
                              </div>
                            )}
                          </div>
                        </Descriptions.Item>
                      )}

                      {institution.website && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <GlobalOutlined className="mr-2" /> Website
                            </span>
                          }
                        >
                          <a
                            href={institution.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            {institution.website.replace(/^https?:\/\//, '')}
                          </a>
                        </Descriptions.Item>
                      )}

                      {institution.location?.address && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <EnvironmentOutlined className="mr-2" /> Address
                            </span>
                          }
                        >
                          <div>
                            <div>{institution.location.address}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {institution.location.city}
                              {institution.location.county &&
                                `, ${institution.location.county}`}
                            </div>
                          </div>
                        </Descriptions.Item>
                      )}

                      {institution.contact?.email && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <MailOutlined className="mr-2" /> Email
                            </span>
                          }
                        >
                          <a
                            href={`mailto:${institution.contact.email}`}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            {institution.contact.email}
                          </a>
                        </Descriptions.Item>
                      )}

                      {institution.contact?.phone && (
                        <Descriptions.Item
                          label={
                            <span className="flex items-center">
                              <PhoneOutlined className="mr-2" /> Phone
                            </span>
                          }
                        >
                          <a
                            href={`tel:${institution.contact.phone}`}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                          >
                            {institution.contact.phone}
                          </a>
                        </Descriptions.Item>
                      )}

                      {institution.rankings &&
                        (institution.rankings.national ||
                          institution.rankings.international) && (
                          <Descriptions.Item
                            label={
                              <span className="flex items-center">
                                <TrophyOutlined className="mr-2" /> Rankings
                              </span>
                            }
                            span={2}
                          >
                            <div className="space-y-2">
                              {institution.rankings.national && (
                                <div className="flex items-center">
                                  <Badge status="success" />
                                  <span className="font-medium">
                                    National: #{institution.rankings.national}
                                  </span>
                                </div>
                              )}
                              {institution.rankings.international && (
                                <div className="flex items-center">
                                  <Badge status="processing" />
                                  <span className="font-medium">
                                    International: #
                                    {institution.rankings.international}
                                  </span>
                                </div>
                              )}
                              {institution.rankings.year && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  Rankings as of {institution.rankings.year}
                                </div>
                              )}
                            </div>
                          </Descriptions.Item>
                        )}
                    </Descriptions>

                    {institution.accreditation &&
                      institution.accreditation.length > 0 && (
                        <div className="mt-8">
                          <Title
                            level={4}
                            className="dark:text-white flex items-center mb-4"
                          >
                            <SafetyCertificateOutlined className="mr-2 text-green-500" />
                            Accreditation & Recognition
                          </Title>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {institution.accreditation.map((item, index) => (
                              <Card
                                key={index}
                                size="small"
                                className="dark:bg-gray-700 dark:border-gray-600"
                                styles={{ body: { padding: '12px' } }}
                              >
                                <div className="flex items-center">
                                  <CheckCircleOutlined className="text-green-500 mr-3 text-lg" />
                                  <span className="dark:text-gray-200 font-medium">
                                    {item}
                                  </span>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center">
                      <BookOutlined className="mr-2" /> Programs (
                      {institution.programs?.length || 0})
                    </span>
                  }
                  key="programs"
                >
                  <div className="py-4">
                    <div className="flex justify-between items-center mb-6">
                      <Title level={4} className="dark:text-white mb-0">
                        Academic Programs
                      </Title>
                      <Text className="text-gray-500 dark:text-gray-400">
                        {institution.programs?.length || 0} programs available
                      </Text>
                    </div>

                    {institution.programs && institution.programs.length > 0 ? (
                      <List
                        itemLayout="vertical"
                        dataSource={institution.programs}
                        renderItem={(program, index) => (
                          <List.Item
                            key={program._id || program.name}
                            className="border-2 border-gray-100 dark:border-gray-700 rounded-lg p-6 mb-6 hover:shadow-lg transition-shadow"
                          >
                            <div>
                              <div className="flex flex-wrap justify-between items-start mb-4">
                                <div className="flex-1">
                                  <Title
                                    level={3}
                                    className="mb-2 dark:text-white"
                                  >
                                    {program.name}
                                  </Title>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <Tag
                                      color="blue"
                                      className="px-3 py-1 text-sm"
                                    >
                                      {program.level}
                                    </Tag>
                                    {program.duration && (
                                      <Tag
                                        icon={<ClockCircleOutlined />}
                                        className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 px-3 py-1 text-sm"
                                      >
                                        {program.duration}
                                      </Tag>
                                    )}
                                    <Tag
                                      color="purple"
                                      className="px-3 py-1 text-sm"
                                    >
                                      Program #{index + 1}
                                    </Tag>
                                  </div>
                                </div>
                              </div>

                              {program.description && (
                                <Paragraph className="mb-6 dark:text-gray-300 text-base leading-relaxed">
                                  {program.description}
                                </Paragraph>
                              )}

                              <Row gutter={[24, 24]}>
                                {program.entryRequirements && (
                                  <Col xs={24} lg={12}>
                                    <Card
                                      size="small"
                                      title={
                                        <span className="flex items-center dark:text-white">
                                          <UserOutlined className="mr-2 text-blue-500" />
                                          Entry Requirements
                                        </span>
                                      }
                                      className="h-full dark:bg-gray-700 dark:border-gray-600"
                                    >
                                      <div className="space-y-3">
                                        {program.entryRequirements
                                          .minimumGrade && (
                                          <div>
                                            <Text
                                              strong
                                              className="dark:text-gray-200 block mb-1"
                                            >
                                              Minimum Grade:
                                            </Text>
                                            <Tag
                                              color="green"
                                              className="text-sm"
                                            >
                                              {
                                                program.entryRequirements
                                                  .minimumGrade
                                              }
                                            </Tag>
                                          </div>
                                        )}

                                        {program.entryRequirements
                                          .specificSubjects &&
                                          program.entryRequirements
                                            .specificSubjects.length > 0 && (
                                            <div>
                                              <Text
                                                strong
                                                className="dark:text-gray-200 block mb-2"
                                              >
                                                Required Subjects:
                                              </Text>
                                              <div className="flex flex-wrap gap-1">
                                                {program.entryRequirements.specificSubjects.map(
                                                  (subject, idx) => (
                                                    <Tag
                                                      key={idx}
                                                      className="dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 mb-1"
                                                    >
                                                      {subject.subject}
                                                      {subject.grade &&
                                                        ` (${subject.grade})`}
                                                    </Tag>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}

                                        {program.entryRequirements
                                          .additionalRequirements &&
                                          program.entryRequirements
                                            .additionalRequirements.length >
                                            0 && (
                                            <div>
                                              <Text
                                                strong
                                                className="dark:text-gray-200 block mb-2"
                                              >
                                                Additional Requirements:
                                              </Text>
                                              <Timeline
                                                size="small"
                                                items={program.entryRequirements.additionalRequirements.map(
                                                  (req, idx) => ({
                                                    children: (
                                                      <Text className="dark:text-gray-300 text-sm">
                                                        {req}
                                                      </Text>
                                                    ),
                                                  })
                                                )}
                                              />
                                            </div>
                                          )}
                                      </div>
                                    </Card>
                                  </Col>
                                )}

                                <Col xs={24} lg={12}>
                                  <div className="space-y-4">
                                    {program.tuitionFees && (
                                      <Card
                                        size="small"
                                        title={
                                          <span className="flex items-center dark:text-white">
                                            <DollarOutlined className="mr-2 text-green-500" />
                                            Tuition Fees
                                          </span>
                                        }
                                        className="dark:bg-gray-700 dark:border-gray-600"
                                      >
                                        <div className="text-center">
                                          <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                                            {program.tuitionFees}
                                          </div>
                                          <Text className="text-sm text-gray-500 dark:text-gray-400">
                                            Per academic period
                                          </Text>
                                        </div>
                                      </Card>
                                    )}

                                    {program.careers &&
                                      program.careers.length > 0 && (
                                        <Card
                                          size="small"
                                          title={
                                            <span className="flex items-center dark:text-white">
                                              <TeamOutlined className="mr-2 text-purple-500" />
                                              Career Opportunities
                                            </span>
                                          }
                                          className="dark:bg-gray-700 dark:border-gray-600"
                                        >
                                          <div className="flex flex-wrap gap-2">
                                            {program.careers
                                              .slice(0, 6)
                                              .map((career, idx) => (
                                                <Tag
                                                  key={idx}
                                                  color="purple"
                                                  className="dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 mb-1"
                                                >
                                                  {typeof career === 'string'
                                                    ? career
                                                    : career.name ||
                                                      'Career Option'}
                                                </Tag>
                                              ))}
                                            {program.careers.length > 6 && (
                                              <Tag className="dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500">
                                                +{program.careers.length - 6}{' '}
                                                more
                                              </Tag>
                                            )}
                                          </div>
                                        </Card>
                                      )}
                                  </div>
                                </Col>
                              </Row>

                              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                                <Button
                                  type="primary"
                                  size="large"
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0"
                                >
                                  Apply for {program.name}
                                </Button>
                                <Button
                                  size="large"
                                  icon={<InfoCircleOutlined />}
                                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                  More Details
                                </Button>
                                <Button
                                  size="large"
                                  icon={<DownloadOutlined />}
                                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                >
                                  Program Brochure
                                </Button>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Empty
                        description={
                          <span className="dark:text-gray-300">
                            No program information available
                          </span>
                        }
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center">
                      <BuildOutlined className="mr-2" /> Facilities & Campus
                    </span>
                  }
                  key="facilities"
                >
                  <div className="py-4">
                    <Title level={4} className="dark:text-white mb-6">
                      Campus Facilities & Infrastructure
                    </Title>

                    {institution.facilities &&
                    institution.facilities.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                          {institution.facilities.map((facility, index) => (
                            <Card
                              key={index}
                              hoverable
                              className="text-center h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-gray-700 dark:border-gray-600"
                              styles={{ body: { padding: '24px' } }}
                            >
                              <div className="mb-4">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                  <BuildOutlined className="text-2xl text-blue-500" />
                                </div>
                                <Title
                                  level={5}
                                  className="dark:text-gray-200 mb-2"
                                >
                                  {facility}
                                </Title>
                                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                                  Modern facility available for students
                                </Text>
                              </div>
                            </Card>
                          ))}
                        </div>

                        {/* Facilities Progress */}
                        <Card className="mb-6 dark:bg-gray-700 dark:border-gray-600">
                          <Title level={5} className="dark:text-white mb-4">
                            Facility Coverage
                          </Title>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Text className="dark:text-gray-300">
                                Academic Facilities
                              </Text>
                              <Text className="dark:text-gray-300">
                                {Math.round(
                                  (institution.facilities.length / 20) * 100
                                )}
                                %
                              </Text>
                            </div>
                            <Progress
                              percent={Math.min(
                                Math.round(
                                  (institution.facilities.length / 20) * 100
                                ),
                                100
                              )}
                              strokeColor="#52c41a"
                              className="mb-2"
                            />
                            <Text className="text-sm text-gray-500 dark:text-gray-400">
                              {institution.facilities.length} facilities
                              available on campus
                            </Text>
                          </div>
                        </Card>
                      </>
                    ) : (
                      <Empty
                        description={
                          <span className="dark:text-gray-300">
                            No facility information available
                          </span>
                        }
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                      />
                    )}

                    {institution.images && institution.images.length > 0 && (
                      <div className="mt-8">
                        <Title level={4} className="dark:text-white mb-6">
                          Campus Gallery
                        </Title>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {institution.images.map((image, index) => (
                            <div
                              key={index}
                              className="relative rounded-lg overflow-hidden h-64 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 group"
                              onClick={() => handleImagePreview(image)}
                            >
                              <Image
                                src={
                                  image ||
                                  '/placeholder.svg?height=256&width=384&text=Campus'
                                }
                                alt={`${institution.name} campus - ${
                                  index + 1
                                }`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                fallback="/placeholder.svg?height=256&width=384&text=Campus"
                                preview={false}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <EyeOutlined className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </Col>

          {/* Right Column - Sidebar */}
          <Col xs={24} lg={8}>
            {/* Contact Information */}
            <Card
              title={
                <span className="flex items-center dark:text-white">
                  <PhoneOutlined className="mr-2" /> Contact Information
                </span>
              }
              className="mb-6 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="space-y-6">
                {institution.contact?.email && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                      <MailOutlined className="text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Email Address
                      </div>
                      <a
                        href={`mailto:${institution.contact.email}`}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {institution.contact.email}
                      </a>
                    </div>
                  </div>
                )}

                {institution.contact?.phone && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                      <PhoneOutlined className="text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Phone Number
                      </div>
                      <a
                        href={`tel:${institution.contact.phone}`}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {institution.contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {institution.website && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                      <GlobalOutlined className="text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Official Website
                      </div>
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        {institution.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {institution.location?.address && (
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mr-4 mt-1">
                      <EnvironmentOutlined className="text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Campus Address
                      </div>
                      <div className="dark:text-gray-300">
                        <div>{institution.location.address}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {institution.location.city}
                          {institution.location.county &&
                            `, ${institution.location.county}`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {institution.contact?.socialMedia && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Follow Us
                    </div>
                    {renderSocialLinks()}
                  </div>
                )}
              </div>

              <Divider className="dark:border-gray-700" />

              <div className="space-y-3">
                <Button
                  type="primary"
                  block
                  size="large"
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0"
                >
                  Apply Now
                </Button>
                <Button
                  block
                  size="large"
                  icon={<DownloadOutlined />}
                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Download Brochure
                </Button>
                <Button
                  block
                  size="large"
                  className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Request Information
                </Button>
              </div>
            </Card>

            {/* Key Statistics */}
            <Card
              title={
                <span className="flex items-center dark:text-white">
                  <RiseOutlined className="mr-2" /> Institution Highlights
                </span>
              }
              className="mb-6 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="space-y-6">
                {institution.establishedYear && (
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {institutionAge}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Years of Excellence
                    </div>
                  </div>
                )}

                {institution.programs && (
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {institution.programs.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Academic Programs
                    </div>
                  </div>
                )}

                {institution.views && (
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {institution.views.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Profile Views
                    </div>
                  </div>
                )}

                {institution.featured && (
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <StarFilled className="text-4xl text-yellow-500 mb-2" />
                    <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      Featured Institution
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Popular Programs */}
            {institution.programs && institution.programs.length > 0 && (
              <Card
                title={
                  <span className="flex items-center dark:text-white">
                    <BookOutlined className="mr-2" /> Popular Programs
                  </span>
                }
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                <List
                  dataSource={institution.programs.slice(0, 5)}
                  renderItem={(program, index) => (
                    <List.Item
                      key={program._id || program.name}
                      className="border-b dark:border-gray-700 py-4"
                    >
                      <div className="flex justify-between items-start w-full">
                        <div className="flex-1">
                          <div className="font-medium dark:text-gray-300 mb-1">
                            {program.name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Tag color="blue" size="small">
                              {program.level}
                            </Tag>
                            {program.duration && (
                              <Text className="text-xs text-gray-500 dark:text-gray-400">
                                {program.duration}
                              </Text>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
                {institution.programs.length > 5 && (
                  <div className="text-center mt-4">
                    <Button
                      type="link"
                      onClick={() => setActiveTab('programs')}
                      className="dark:text-blue-400"
                    >
                      View all {institution.programs.length} programs →
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </Col>
        </Row>

        {/* Share Modal */}
        <Modal
          title="Share Institution"
          open={shareModalVisible}
          onCancel={handleShareModalCancel}
          footer={null}
          className="dark:bg-gray-800 dark:text-white"
        >
          <div className="space-y-4 py-4">
            <Button
              icon={<FacebookOutlined />}
              type="primary"
              className="w-full bg-[#1877F2] hover:bg-[#166FE5] border-0 h-12 text-base"
              onClick={shareOnFacebook}
            >
              Share on Facebook
            </Button>
            <Button
              icon={<TwitterOutlined />}
              type="primary"
              className="w-full bg-[#1DA1F2] hover:bg-[#1A94DA] border-0 h-12 text-base"
              onClick={shareOnTwitter}
            >
              Share on Twitter
            </Button>
            <Button
              icon={<LinkedinOutlined />}
              type="primary"
              className="w-full bg-[#0A66C2] hover:bg-[#0958A7] border-0 h-12 text-base"
              onClick={shareOnLinkedIn}
            >
              Share on LinkedIn
            </Button>
            <Divider className="dark:border-gray-700" />
            <div>
              <Text className="block mb-2 dark:text-gray-300">Share Link:</Text>
              <Input
                value={window.location.href}
                readOnly
                className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                addonAfter={
                  <Button
                    type="text"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={copyLink}
                    className="dark:text-gray-300 hover:dark:text-white"
                  >
                    Copy
                  </Button>
                }
              />
            </div>
          </div>
        </Modal>

        {/* Image Preview Modal */}
        <Modal
          open={imagePreviewVisible}
          footer={null}
          onCancel={() => setImagePreviewVisible(false)}
          width="90%"
          style={{ maxWidth: '1000px' }}
          className="image-preview-modal"
        >
          <Image
            src={previewImage || '/placeholder.svg'}
            alt="Campus preview"
            style={{ width: '100%' }}
            fallback="/placeholder.svg?height=600&width=800&text=Campus+Image"
          />
        </Modal>

        {/* Print styles */}
        <style jsx>{`
          @media print {
            .fixed,
            .institution-actions,
            .breadcrumb-container,
            .print-button,
            .ant-tabs-tab,
            .ant-modal-mask,
            .ant-modal-wrap,
            .ant-back-top {
              display: none !important;
            }

            .ant-card {
              box-shadow: none !important;
              border: 1px solid #d9d9d9 !important;
              break-inside: avoid;
            }

            .ant-card-body {
              padding: 16px !important;
            }

            h1,
            h2,
            h3,
            h4,
            h5,
            h6 {
              break-after: avoid;
            }

            .image-preview-modal {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default InstitutionDetails;
