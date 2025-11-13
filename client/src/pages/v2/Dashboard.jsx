import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Statistic,
  Progress,
  List,
  Tag,
  Space,
  Divider,
  Avatar,
  Skeleton,
  Empty,
  Tooltip,
  Badge,
  Tabs,
} from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import {
  GraduationCap,
  Briefcase,
  TrendingUp,
  School,
  ClipboardList,
  BookOpen,
  LightbulbIcon,
  User,
  Award,
  BarChart3,
  BookMarked,
  Clock,
  Settings,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import {
  getCareerStatistics,
  getJobMarketInsights,
  fetchRecommendationsForUser,
  fetchRecommendationHistoryForUser,
} from '../../services/recommendationService';
import { getCurrentUser } from '../../services/authService';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  const { user: authUser } = useAuth();
  const [profileCompletionPercentage, setProfileCompletionPercentage] =
    useState(0);

  // Get current user data
  const { data: currentUserData, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });

  const user = currentUserData?.user || authUser;

  // Get career statistics
  const { data: statisticsResponse = {}, isLoading: statsLoading } = useQuery({
    queryKey: ['careerStatistics'],
    queryFn: () => getCareerStatistics(),
  });

  // Get job market insights
  const { data: jobMarketResponse = {}, isLoading: jobMarketLoading } =
    useQuery({
      queryKey: ['jobMarketInsights'],
      queryFn: () => getJobMarketInsights(),
    });

  // Get user recommendations
  const {
    data: recommendationsResponse = {},
    isLoading: recommendationsLoading,
  } = useQuery({
    queryKey: ['userRecommendations'],
    queryFn: fetchRecommendationsForUser,
  });

  // Get recommendation history
  const {
    data: recommendationHistoryResponse = {},
    isLoading: historyLoading,
  } = useQuery({
    queryKey: ['recommendationHistory'],
    queryFn: fetchRecommendationHistoryForUser,
  });

  // Calculate profile completion percentage based on user data
  useEffect(() => {
    if (user) {
      let completedFields = 0;
      let totalFields = 0;

      // Basic profile fields
      const basicFields = ['name', 'email', 'avatar'];
      totalFields += basicFields.length;
      completedFields += basicFields.filter((field) => !!user[field]).length;

      // KCSE results
      if (user.kcseResults) {
        totalFields += 1;
        completedFields += 1;

        // Check subjects
        if (user.kcseResults.subjects && user.kcseResults.subjects.length > 0) {
          totalFields += 1;
          completedFields += 1;
        }
      }

      // Preferences
      if (user.preferences) {
        // Interests
        totalFields += 1;
        if (
          user.preferences.interests &&
          user.preferences.interests.length > 0
        ) {
          completedFields += 1;
        }

        // Skills
        totalFields += 1;
        if (user.preferences.skills && user.preferences.skills.length > 0) {
          completedFields += 1;
        }

        // Locations
        totalFields += 1;
        if (
          user.preferences.locations &&
          user.preferences.locations.length > 0
        ) {
          completedFields += 1;
        }

        // Notification settings
        totalFields += 1;
        if (user.preferences.notificationSettings) {
          completedFields += 1;
        }
      }

      const percentage = Math.round((completedFields / totalFields) * 100);
      setProfileCompletionPercentage(percentage);
    }
  }, [user]);

  // Extract statistics data from the response
  const statistics = {
    profileCompletion: profileCompletionPercentage,
    recommendedCareers: recommendationsResponse?.recommendations?.length || 0,
    savedCareers: user?.savedCareers?.length || 0,
    assessmentsCompleted: recommendationHistoryResponse?.count || 0,
    careersByCategory: statisticsResponse?.data?.careersByCategory || [],
    mostViewedCareers: statisticsResponse?.data?.mostViewedCareers || [],
    mostSavedCareers: statisticsResponse?.data?.mostSavedCareers || [],
    careersByDemand: statisticsResponse?.data?.careersByDemand || [],
  };

  // Extract job market data from the response
  const jobMarket = {
    // Map high demand careers to trending careers
    trendingCareers:
      jobMarketResponse?.data?.highDemandCareers?.slice(0, 4).map((career) => ({
        id: career.id,
        name: career.title,
        growth:
          career.marketDemand === 'Very High'
            ? '+15%'
            : career.marketDemand === 'High'
            ? '+10%'
            : '+5%',
        category: career.category,
      })) || [],

    // Use top recommendations from user's recommendations
    recentRecommendations:
      recommendationsResponse?.recommendations?.slice(0, 3).map((career) => ({
        id: career.id,
        name: career.title,
        match: `${career.match}%`,
        category: career.category,
      })) || [],

    // Use dummy data for upcoming events as it's not in the API response
    upcomingEvents: [
      {
        id: 1,
        title: 'Career Fair 2023',
        date: 'Oct 15, 2023',
        location: 'Nairobi',
      },
      {
        id: 2,
        title: 'Tech Summit',
        date: 'Nov 5, 2023',
        location: 'Mombasa',
      },
    ],

    // Add top salary careers from the API
    topSalaryCareers: jobMarketResponse?.data?.careersBySalary || [],

    // Add careers with most prospects
    careersWithMostProspects:
      jobMarketResponse?.data?.careersWithMostProspects || [],
  };

  // Get user's academic strengths based on KCSE results
  const getAcademicStrengths = () => {
    if (!user?.kcseResults?.subjects) return [];

    // Sort subjects by points in descending order
    const sortedSubjects = [...user.kcseResults.subjects].sort(
      (a, b) => b.points - a.points
    );

    // Return top 3 subjects
    return sortedSubjects.slice(0, 3).map((subject) => ({
      name: subject.subject,
      grade: subject.grade,
      points: subject.points,
    }));
  };

  const academicStrengths = getAcademicStrengths();

  // Loading state
  const isLoading =
    userLoading ||
    statsLoading ||
    jobMarketLoading ||
    recommendationsLoading ||
    historyLoading;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-6 px-4">
        <Skeleton active />
        <Row gutter={[16, 16]} className="mt-6">
          <Col span={24}>
            <Skeleton active />
          </Col>
          <Col xs={24} md={12}>
            <Skeleton active />
          </Col>
          <Col xs={24} md={12}>
            <Skeleton active />
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Welcome Section */}
      <Card className="mb-6 bg-[#0080ff] text-white">
        <Row justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Title level={3} className="text-white mb-2">
              Welcome back, {user?.name || 'Student'}!
            </Title>
            <Paragraph className="text-white opacity-90 mb-0">
              {user?.kcseResults?.meanGrade
                ? `With a mean grade of ${user.kcseResults.meanGrade} (${user.kcseResults.meanPoints} points), you have great career options.`
                : 'Continue exploring career paths that match your academic strengths and interests.'}
            </Paragraph>
          </Col>
          <Col xs={24} md={8} className="mt-4 md:mt-0 text-right">
            <Button
              type="default"
              size="large"
              className="bg-white text-[#0080ff] border-white hover:bg-gray-100"
            >
              <ClipboardList size={16} style={{ marginRight: 8 }} />
              <Link to="/input-results">
                {user?.kcseResults?.subjects.length > 0
                  ? 'Update Results'
                  : 'Input KCSE Results'}
              </Link>
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Stats Section */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Profile Completion"
            value={`${statistics.profileCompletion}%`}
            icon={<User size={24} />}
            color="#1890ff"
            showProgress
            progressValue={statistics.profileCompletion}
            link="/profile"
            linkText="Complete Profile"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Recommended Careers"
            value={statistics.recommendedCareers}
            icon={<Briefcase size={24} />}
            color="#52c41a"
            link="/recommendations"
            linkText="View all"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Saved Careers"
            value={statistics.savedCareers}
            icon={<BookOpen size={24} />}
            color="#722ed1"
            link="/saved-careers"
            linkText="View saved"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Assessments"
            value={statistics.assessmentsCompleted}
            icon={<ClipboardList size={24} />}
            color="#fa8c16"
            link="/assessments"
            linkText="Take more"
          />
        </Col>
      </Row>

      {/* Academic Profile Summary */}
      {user?.kcseResults && (
        <Card className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Title level={4}>Academic Profile</Title>
              <Space direction="vertical" size="small">
                <Text>Year: {user.kcseResults.year}</Text>
                <Text>
                  Mean Grade: <Text strong>{user.kcseResults.meanGrade}</Text>
                </Text>
                <Text>
                  Mean Points: <Text strong>{user.kcseResults.meanPoints}</Text>
                </Text>
              </Space>
            </Col>
            <Col xs={24} md={16}>
              <Title level={5}>Academic Strengths</Title>
              <Row gutter={[16, 16]}>
                {academicStrengths.map((subject, index) => (
                  <Col key={index} xs={24} sm={8}>
                    <Card size="small" className="text-center">
                      <Text strong>{subject.name}</Text>
                      <div>
                        <Badge
                          count={subject.grade}
                          style={{
                            backgroundColor: subject.grade.startsWith('A')
                              ? '#52c41a'
                              : subject.grade.startsWith('B')
                              ? '#1890ff'
                              : subject.grade.startsWith('C')
                              ? '#faad14'
                              : '#f5222d',
                          }}
                        />
                        <Text className="ml-2">({subject.points} pts)</Text>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="mt-3 text-right">
                <Button type="link">
                  <Link to="/input-results">View Full Academic Profile</Link>
                </Button>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* Main Dashboard Content */}
      <Tabs defaultActiveKey="1" className="mb-6">
        <TabPane
          tab={
            <span>
              <Briefcase size={16} style={{ marginRight: 8 }} />
              Career Recommendations
            </span>
          }
          key="1"
        >
          <Row gutter={[16, 16]}>
            {/* Trending Careers */}
            <Col xs={24} lg={16}>
              <Card
                title={<Title level={4}>Trending Careers in Kenya</Title>}
                className="h-full"
                extra={
                  <Button type="link">
                    <TrendingUp size={16} style={{ marginRight: 4 }} />
                    <Link to="/trends">View All Trends</Link>
                  </Button>
                }
              >
                <Row gutter={[16, 16]}>
                  {jobMarket?.trendingCareers?.map((career) => (
                    <Col xs={24} sm={12} key={career.id}>
                      <Card
                        className="h-full hover:shadow-md transition-shadow"
                        bordered
                      >
                        <div className="flex justify-between items-start">
                          <Title level={5} className="mb-1">
                            {career.name}
                          </Title>
                          <Tag color="green">{career.growth}</Tag>
                        </div>
                        <Text type="secondary">{career.category}</Text>
                        <div className="mt-2">
                          <Tag color="blue">High Demand</Tag>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>

            {/* Recent Recommendations */}
            <Col xs={24} lg={8}>
              <Card
                title={<Title level={4}>Your Top Matches</Title>}
                className="h-full"
              >
                {jobMarket.recentRecommendations.length > 0 ? (
                  <>
                    <List
                      itemLayout="horizontal"
                      dataSource={jobMarket.recentRecommendations}
                      renderItem={(rec) => (
                        <List.Item
                          key={rec.id}
                          actions={[
                            <Button type="link" size="small" key="view-action">
                              <Link to={`/career/${rec.id}`}>View</Link>
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#0080ff] text-white">
                                <GraduationCap size={20} />
                              </div>
                            }
                            title={<Text strong>{rec.name}</Text>}
                            description={
                              <Space direction="vertical" size={0}>
                                <Text type="secondary">Match: {rec.match}</Text>
                                <Text type="secondary">{rec.category}</Text>
                              </Space>
                            }
                          />
                        </List.Item>
                      )}
                    />
                    <Divider />
                    <Button type="primary" block>
                      <Link to="/recommendations">See All Recommendations</Link>
                    </Button>
                  </>
                ) : (
                  <Empty
                    description={
                      <span>
                        No recommendations yet.
                        <br />
                        <Link to="/input-results">
                          Input your KCSE results
                        </Link>{' '}
                        to get personalized recommendations.
                      </span>
                    }
                  />
                )}
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BarChart3 size={16} style={{ marginRight: 8 }} />
              Market Insights
            </span>
          }
          key="2"
        >
          <Row gutter={[16, 16]}>
            {/* Career Categories */}
            <Col xs={24} md={12}>
              <Card title={<Title level={4}>Career Categories</Title>}>
                <List
                  dataSource={statistics.careersByCategory || []}
                  renderItem={(category) => (
                    <List.Item
                      key={category._id}
                      actions={[
                        <Button type="link" size="small" key="view-action">
                          <Link to={`/careers/category/${category._id}`}>
                            View
                          </Link>
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={<Text strong>{category._id}</Text>}
                        description={
                          <Text type="secondary">{category.count} careers</Text>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Top Salary Careers */}
            <Col xs={24} md={12}>
              <Card title={<Title level={4}>Top Salary Careers</Title>}>
                <List
                  dataSource={jobMarket.topSalaryCareers?.slice(0, 5) || []}
                  renderItem={(career) => (
                    <List.Item
                      key={career._id}
                      actions={[
                        <Button type="link" size="small" key="view-action">
                          <Link to={`/career/${career._id}`}>View</Link>
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        title={<Text strong>{career.title}</Text>}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">{career.category}</Text>
                            <Text type="success">
                              Entry: {career.entrySalary} | Senior:{' '}
                              {career.seniorSalary}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Market Demand */}
            <Col xs={24}>
              <Card title={<Title level={4}>Market Demand Overview</Title>}>
                <Row gutter={[16, 16]}>
                  {statistics.careersByDemand?.map((demand) => (
                    <Col xs={24} sm={8} key={demand._id}>
                      <Card className="text-center">
                        <Statistic
                          title={demand._id}
                          value={demand.count}
                          suffix="careers"
                          valueStyle={{
                            color:
                              demand._id === 'Very High'
                                ? '#52c41a'
                                : demand._id === 'High'
                                ? '#1890ff'
                                : demand._id === 'Medium'
                                ? '#faad14'
                                : '#f5222d',
                          }}
                          prefix={
                            demand._id === 'Very High' ||
                            demand._id === 'High' ? (
                              <RiseOutlined />
                            ) : (
                              <FallOutlined />
                            )
                          }
                        />
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <Calendar size={16} style={{ marginRight: 8 }} />
              Events & Resources
            </span>
          }
          key="3"
        >
          {/* Upcoming Events */}
          <Card
            title={<Title level={4}>Upcoming Career Events</Title>}
            className="mb-6"
          >
            <Row gutter={[16, 16]}>
              {jobMarket?.upcomingEvents?.map((event) => (
                <Col xs={24} sm={12} md={8} key={event.id}>
                  <Card
                    className="h-full hover:shadow-md transition-shadow"
                    bordered
                  >
                    <Title level={5} className="mb-2">
                      {event.title}
                    </Title>
                    <Space className="mb-4">
                      <CalendarOutlined />
                      <Text type="secondary">{event.date}</Text>
                      <EnvironmentOutlined />
                      <Text type="secondary">{event.location}</Text>
                    </Space>
                    <Button block>Register</Button>
                  </Card>
                </Col>
              ))}
              <Col xs={24} sm={12} md={8}>
                <Card
                  className="h-full flex flex-col items-center justify-center text-center bg-gray-50 hover:shadow-md transition-shadow"
                  bordered
                >
                  <LightbulbIcon size={40} className="text-gray-400 mb-4" />
                  <Title level={5}>Discover More Events</Title>
                  <Button type="link">
                    <Link to="/events">View All Events</Link>
                  </Button>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* Educational Resources */}
          <Card title={<Title level={4}>Educational Resources</Title>}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <BookMarked size={24} className="mb-2 text-blue-500" />
                  <Title level={5}>Career Guides</Title>
                  <Text type="secondary">
                    Comprehensive guides to help you understand different career
                    paths
                  </Text>
                  <Button type="link" block className="mt-3">
                    <Link to="/resources/guides">Browse Guides</Link>
                  </Button>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <Award size={24} className="mb-2 text-purple-500" />
                  <Title level={5}>Scholarship Opportunities</Title>
                  <Text type="secondary">
                    Find scholarships to fund your education
                  </Text>
                  <Button type="link" block className="mt-3">
                    <Link to="/resources/scholarships">Find Scholarships</Link>
                  </Button>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <School size={24} className="mb-2 text-green-500" />
                  <Title level={5}>Institution Directory</Title>
                  <Text type="secondary">
                    Explore universities and colleges offering your desired
                    courses
                  </Text>
                  <Button type="link" block className="mt-3">
                    <Link to="/institutions">Browse Institutions</Link>
                  </Button>
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-6">
        <Title level={4} className="mb-4">
          Quick Actions
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6} md={4}>
            <ActionButton
              icon={<ClipboardList size={24} />}
              text="Input KCSE Results"
              link="/input-results"
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ActionButton
              icon={<GraduationCap size={24} />}
              text="Explore Careers"
              link="/careers"
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ActionButton
              icon={<School size={24} />}
              text="Browse Institutions"
              link="/institutions"
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ActionButton
              icon={<TrendingUp size={24} />}
              text="Career Assessment"
              link="/assessment"
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ActionButton
              icon={<BookMarked size={24} />}
              text="Saved Careers"
              link="/saved-careers"
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <ActionButton
              icon={<Settings size={24} />}
              text="Profile Settings"
              link="/profile"
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  color,
  showProgress,
  progressValue,
  link,
  linkText,
}) => {
  return (
    <Card className="h-full">
      <div className="flex items-start mb-2">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-md mr-3"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>
        <div>
          <Text type="secondary">{title}</Text>
        </div>
      </div>

      <Statistic
        value={value}
        valueStyle={{ fontSize: '2rem', fontWeight: 'bold' }}
      />

      {showProgress && (
        <Progress
          percent={progressValue}
          status={progressValue < 100 ? 'active' : 'success'}
          strokeColor={color}
          className="mt-2"
        />
      )}

      {link && (
        <Button type="link" style={{ color: color, paddingLeft: 0 }}>
          <Link to={link}>{linkText}</Link>
        </Button>
      )}
    </Card>
  );
};

// Action Button Component
const ActionButton = ({ icon, text, link }) => {
  return (
    <Link to={link}>
      <Card
        hoverable
        className="h-full text-center py-4"
        styles={{ body: { padding: '12px' } }}
      >
        <div className="flex flex-col items-center">
          <div className="mb-2">{icon}</div>
          <Text>{text}</Text>
        </div>
      </Card>
    </Link>
  );
};

export default Dashboard;
