'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Input,
  Select,
  Tag,
  Button,
  Pagination,
  Empty,
  Divider,
  Space,
  Alert,
  Tooltip,
  Drawer,
  Slider,
  Badge,
  Progress,
  Tabs,
  Skeleton,
  Modal,
  Collapse,
  Switch,
  Radio,
  Popover,
  notification,
  List,
  Avatar,
  Statistic,
  FloatButton,
  BackTop,
  Affix,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  BookOutlined,
  RiseOutlined,
  BarChartOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  StarFilled,
  CloseOutlined,
  PushpinOutlined,
  PushpinFilled,
  CheckCircleOutlined,
  PlusOutlined,
  FireOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  RocketOutlined,
  CrownOutlined,
  GiftOutlined,
  SettingOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  SunOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useInView } from 'react-intersection-observer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Import the API services
import {
  fetchCareers,
  fetchUserProfile,
  updateUserPreferences,
  fetchRelatedCareers,
  fetchCareerStatistics,
  fetchCareer,
  saveCareer,
  unsaveCareer,
  pinCareer,
  unpinCareer,
  rateCareer,
  viewCareer,
} from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Utility function to combine Tailwind classes
const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};

// Color palette for charts
const CHART_COLORS = [
  '#0080ff',
  '#1a9dff',
  '#52c41a',
  '#faad14',
  '#f5222d',
  '#722ed1',
  '#13c2c2',
  '#eb2f96',
];

// Custom hook for persisting filters to URL
const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const getParam = (key, defaultValue) => {
    return searchParams.get(key) || defaultValue;
  };

  const setParam = useCallback(
    (key, value) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const setMultipleParams = useCallback(
    (paramsObject) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(paramsObject).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  return { getParam, setParam, setMultipleParams };
};

// Custom hook for viewport detection
const useElementOnScreen = (options) => {
  const [ref, inView] = useInView(options);
  return [ref, inView];
};

// Helper functions moved outside component
const getDemandColor = (demand) => {
  switch (demand) {
    case 'Very High':
      return '#f5222d';
    case 'High':
      return '#faad14';
    case 'Medium':
      return '#52c41a';
    case 'Low':
      return '#d9d9d9';
    default:
      return '#0080ff';
  }
};

const getDemandGradient = (demand) => {
  switch (demand) {
    case 'Very High':
      return 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)';
    case 'High':
      return 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)';
    case 'Medium':
      return 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)';
    case 'Low':
      return 'linear-gradient(135deg, #d9d9d9 0%, #f0f0f0 100%)';
    default:
      return 'linear-gradient(135deg, #0080ff 0%, #1a9dff 100%)';
  }
};

const getDemandPercentage = (demand) => {
  switch (demand) {
    case 'Very High':
      return 90;
    case 'High':
      return 75;
    case 'Medium':
      return 50;
    case 'Low':
      return 25;
    default:
      return 0;
  }
};

const getDemandIcon = (demand) => {
  switch (demand) {
    case 'Very High':
      return <FireOutlined />;
    case 'High':
      return <RocketOutlined />;
    case 'Medium':
      return <ThunderboltOutlined />;
    case 'Low':
      return <BulbOutlined />;
    default:
      return <StarOutlined />;
  }
};

// Enhanced Career card component with stunning visuals
const CareerCard = ({
  career,
  savedCareers,
  pinnedCareers,
  handleSaveToggle,
  handlePinToggle,
  handleRateCareer,
  isAuthenticated,
  handleShare,
  handleViewDetails,
  userRatings,
  viewMode,
}) => {
  const { theme } = useTheme();
  const isSaved = savedCareers.includes(career._id);
  const isPinned = pinnedCareers.includes(career._id);
  const userRating = userRatings[career._id] || 0;
  const [cardRef, isVisible] = useElementOnScreen({
    threshold: 0.1,
    triggerOnce: true,
  });
  const [isHovered, setIsHovered] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 100,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  // Calculate salary range display
  const salaryDisplay = career.salary ? (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700">
      <div className="p-2 rounded-full bg-green-100 dark:bg-green-800">
        <DollarOutlined className="text-green-600 dark:text-green-400" />
      </div>
      <div>
        <Text className="text-xs text-green-600 dark:text-green-400 font-medium">
          Salary Range
        </Text>
        <div className="font-semibold text-green-700 dark:text-green-300">
          {career.salary.entry && career.salary.senior
            ? `${career.salary.entry} - ${career.salary.senior}`
            : 'Competitive'}
        </div>
      </div>
    </div>
  ) : null;

  // Compact view for list mode
  if (viewMode === 'list') {
    return (
      <motion.div
        ref={cardRef}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={cardVariants}
        className="w-full"
      >
        <Card
          className="mb-4 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500"
          styles={{ body: { padding: '16px' } }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Avatar
                size={48}
                style={{
                  background: getDemandGradient(career.marketDemand),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                icon={getDemandIcon(career.marketDemand)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Title level={5} className="mb-0">
                    {career.title}
                  </Title>
                  {isPinned && <PushpinFilled className="text-blue-500" />}
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                  <Tag color="blue">{career.category}</Tag>
                  {career.marketDemand && (
                    <Tag
                      color={getDemandColor(career.marketDemand)}
                      style={{
                        background: getDemandGradient(career.marketDemand),
                        border: 'none',
                        color: 'white',
                      }}
                    >
                      {getDemandIcon(career.marketDemand)} {career.marketDemand}
                    </Tag>
                  )}
                  {career.minimumMeanGrade && (
                    <Tag color="purple">Grade: {career.minimumMeanGrade}</Tag>
                  )}
                </div>
                <Text type="secondary" ellipsis>
                  {career.description ||
                    'Explore this exciting career path and discover opportunities in this field.'}
                </Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip title={`${career.views || 0} views`}>
                <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700">
                  <EyeOutlined className="text-gray-500" />
                  <span className="text-xs">{career.views || 0}</span>
                </div>
              </Tooltip>
              {isAuthenticated && (
                <Tooltip title={isSaved ? 'Remove from saved' : 'Save career'}>
                  <Button
                    type="text"
                    shape="circle"
                    icon={
                      isSaved ? (
                        <HeartFilled className="text-red-500" />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveToggle(career._id);
                    }}
                  />
                </Tooltip>
              )}
              <Button
                type="primary"
                onClick={() => handleViewDetails(career._id)}
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Enhanced Grid view
  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      whileHover="hover"
      variants={cardVariants}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        hoverable
        className={cn(
          'h-full transition-all duration-500 overflow-hidden relative group',
          'shadow-md hover:shadow-2xl',
          'border-0 rounded-2xl',
          isPinned &&
            'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800'
        )}
        style={{
          background:
            theme === 'dark'
              ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
        }}
        styles={{ body: { padding: 0 } }}
        onClick={() => handleViewDetails(career._id)}
      >
        {/* Header with gradient background */}
        <div
          className="relative p-6 text-white"
          style={{
            background: getDemandGradient(career.marketDemand),
            borderRadius: '16px 16px 0 0',
          }}
        >
          {/* Floating action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isAuthenticated && (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    className="bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                    icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePinToggle(career._id);
                    }}
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    className="bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                    icon={
                      isSaved ? (
                        <HeartFilled className="text-red-300" />
                      ) : (
                        <HeartOutlined />
                      )
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveToggle(career._id);
                    }}
                  />
                </motion.div>
              </>
            )}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="text"
                shape="circle"
                size="small"
                className="bg-white/20 backdrop-blur-sm border-0 text-white hover:bg-white/30"
                icon={<ShareAltOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleShare(career);
                }}
              />
            </motion.div>
          </div>

          {/* Career category and demand indicator */}
          <div className="flex items-center justify-between mb-4">
            <Tag
              className="border-0 text-white font-medium px-3 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              {career.category}
            </Tag>
            <div className="flex items-center gap-1 text-white/90">
              {getDemandIcon(career.marketDemand)}
              <span className="text-sm font-medium">{career.marketDemand}</span>
            </div>
          </div>

          {/* Career title */}
          <Title level={4} className="text-white mb-2 font-bold">
            {career.title}
          </Title>

          {/* Rating stars for authenticated users */}
          {isAuthenticated && (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  className="p-0 border-0 bg-transparent cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRateCareer(career._id, star);
                  }}
                >
                  {star <= userRating ? (
                    <StarFilled className="text-yellow-300 text-lg" />
                  ) : (
                    <StarOutlined className="text-white/60 text-lg hover:text-yellow-300" />
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-6">
          {/* Description */}
          <Paragraph
            className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
            ellipsis={{ rows: 3 }}
          >
            {career.description ||
              'Explore this exciting career path and discover opportunities in this field.'}
          </Paragraph>

          {/* Key information grid */}
          <div className="space-y-4">
            {/* Market demand progress */}
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex justify-between items-center mb-2">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Market Demand
                </Text>
                <Text
                  className="text-sm font-bold"
                  style={{ color: getDemandColor(career.marketDemand) }}
                >
                  {career.marketDemand}
                </Text>
              </div>
              <Progress
                percent={getDemandPercentage(career.marketDemand)}
                showInfo={false}
                strokeColor={getDemandColor(career.marketDemand)}
                trailColor={theme === 'dark' ? '#374151' : '#f3f4f6'}
                strokeWidth={8}
                className="mb-0"
              />
            </div>

            {/* Salary display */}
            {salaryDisplay}

            {/* Key subjects */}
            {career.keySubjects && career.keySubjects.length > 0 && (
              <div>
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 block">
                  Key Subjects
                </Text>
                <div className="flex flex-wrap gap-1">
                  {career.keySubjects.slice(0, 3).map((subject, index) => (
                    <Tag
                      key={index}
                      className="rounded-full border-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      {subject}
                    </Tag>
                  ))}
                  {career.keySubjects.length > 3 && (
                    <Tag className="rounded-full border-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      +{career.keySubjects.length - 3} more
                    </Tag>
                  )}
                </div>
              </div>
            )}

            {/* Bottom info row */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-4">
                {career.minimumMeanGrade && (
                  <div className="flex items-center gap-1">
                    <TrophyOutlined className="text-purple-500" />
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      Grade:{' '}
                      <span className="font-medium">
                        {career.minimumMeanGrade}
                      </span>
                    </Text>
                  </div>
                )}
                {career.programDuration && (
                  <div className="flex items-center gap-1">
                    <ClockCircleOutlined className="text-blue-500" />
                    <Text className="text-sm text-gray-600 dark:text-gray-300">
                      {career.programDuration}
                    </Text>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <EyeOutlined />
                <span className="text-sm">{career.views || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl"
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

// Enhanced Statistics Card Component
const StatsCard = ({ title, value, icon, color, trend, trendValue }) => {
  const { theme } = useTheme();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="text-center h-full border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        style={{
          background:
            theme === 'dark'
              ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
        }}
      >
        <div className="flex flex-col items-center">
          <div
            className="p-4 rounded-full mb-4"
            style={{ background: `${color}20` }}
          >
            <div style={{ color, fontSize: '2rem' }}>{icon}</div>
          </div>
          <Statistic
            title={
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {title}
              </span>
            }
            value={value}
            valueStyle={{
              color: theme === 'dark' ? '#e2e8f0' : '#1a202c',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}
          />
          {trend && (
            <div
              className={`flex items-center gap-1 mt-2 ${
                trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {trend === 'up' ? '↗' : '↘'}
              <span className="text-sm font-medium">{trendValue}%</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

// Main Careers component
const Careers = () => {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();
  const { getParam, setParam, setMultipleParams } = useFilterParams();

  // State from URL parameters
  const [searchTerm, setSearchTerm] = useState(getParam('search', ''));
  const [category, setCategory] = useState(getParam('category', ''));
  const [marketDemand, setMarketDemand] = useState(getParam('demand', ''));
  const [sortBy, setSortBy] = useState(getParam('sort', 'title'));
  const [currentPage, setCurrentPage] = useState(
    Number.parseInt(getParam('page', '1'))
  );
  const [pageSize, setPageSize] = useState(
    Number.parseInt(getParam('limit', '9'))
  );

  // Additional state
  const [savedCareers, setSavedCareers] = useState([]);
  const [pinnedCareers, setPinnedCareers] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);
  const [salaryRange, setSalaryRange] = useState([0, 500000]);
  const [viewMode, setViewMode] = useState(getParam('view', 'grid'));
  const [compareList, setCompareList] = useState([]);
  const [compareDrawerVisible, setCompareDrawerVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [currentShareCareer, setCurrentShareCareer] = useState(null);
  const [careerDetailsDrawerVisible, setCareerDetailsDrawerVisible] =
    useState(false);
  const [currentCareerDetails, setCurrentCareerDetails] = useState(null);
  const [userPreferences, setUserPreferences] = useState({
    preferredCategories: [],
    preferredLocations: [],
    skillsInterests: [],
  });
  const [showRecommended, setShowRecommended] = useState(
    getParam('recommended', '') === 'true'
  );
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);

  // Refs
  const careerListRef = useRef(null);
  const searchInputRef = useRef(null);

  // Fetch careers with filters
  const {
    data: careersData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'careers',
      searchTerm,
      category,
      marketDemand,
      sortBy,
      currentPage,
      pageSize,
      salaryRange,
      showRecommended,
    ],
    queryFn: () =>
      fetchCareers({
        search: searchTerm,
        category,
        marketDemand,
        sort: sortBy,
        page: currentPage,
        limit: pageSize,
        populate: 'institutions',
      }),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  // Fetch user's profile if authenticated
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => (isAuthenticated ? fetchUserProfile() : null),
    enabled: isAuthenticated,
  });

  // Fetch career statistics
  const { data: careerStats } = useQuery({
    queryKey: ['careerStats'],
    queryFn: fetchCareerStatistics,
    staleTime: 10 * 60 * 1000,
  });

  // Mutations for user interactions
  const saveMutation = useMutation({
    mutationFn: saveCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const pinMutation = useMutation({
    mutationFn: pinCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const unpinMutation = useMutation({
    mutationFn: unpinCareer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const rateMutation = useMutation({
    mutationFn: ({ careerId, rating }) => rateCareer(careerId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const viewMutation = useMutation({
    mutationFn: viewCareer,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (preferences) => updateUserPreferences(preferences),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      notification.success({
        message: 'Preferences Updated',
        description: 'Your career preferences have been updated successfully.',
      });
    },
  });

  // Fetch related careers for the current career details
  const { data: relatedCareers } = useQuery({
    queryKey: ['relatedCareers', currentCareerDetails?._id],
    queryFn: () => fetchRelatedCareers(currentCareerDetails?._id),
    enabled: !!currentCareerDetails,
  });

  // Effect to update state from user profile
  useEffect(() => {
    if (userProfile?.data) {
      const profile = userProfile.data;

      if (profile.savedCareers) {
        setSavedCareers(
          profile.savedCareers.map((career) => career._id || career)
        );
      }

      if (profile.pinnedCareers) {
        setPinnedCareers(
          profile.pinnedCareers.map((career) => career._id || career)
        );
      }

      if (profile.careerRatings) {
        const ratings = {};
        profile.careerRatings.forEach((rating) => {
          ratings[rating.careerId] = rating.rating;
        });
        setUserRatings(ratings);
      }

      if (profile.preferences) {
        setUserPreferences(profile.preferences);
      }
    }
  }, [userProfile]);

  // Effect to sync URL params with state
  useEffect(() => {
    setMultipleParams({
      search: searchTerm,
      category,
      demand: marketDemand,
      sort: sortBy,
      page: currentPage.toString(),
      limit: pageSize.toString(),
      view: viewMode,
      recommended: showRecommended ? 'true' : '',
    });
  }, [
    searchTerm,
    category,
    marketDemand,
    sortBy,
    currentPage,
    pageSize,
    viewMode,
    showRecommended,
    setMultipleParams,
  ]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Handle search
  const handleSearch = (value) => {
    debouncedSearch(value);
  };

  // Handle filter changes
  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1);
  };

  const handleDemandChange = (value) => {
    setMarketDemand(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (careerListRef.current) {
      careerListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle save/unsave career
  const handleSaveToggle = async (careerId) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to save careers.',
      });
      return;
    }

    try {
      if (savedCareers.includes(careerId)) {
        await unsaveMutation.mutateAsync(careerId);
        setSavedCareers(savedCareers.filter((id) => id !== careerId));
      } else {
        await saveMutation.mutateAsync(careerId);
        setSavedCareers([...savedCareers, careerId]);
        notification.success({
          message: 'Career Saved',
          description: 'This career has been added to your saved list.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update saved careers.',
      });
    }
  };

  // Handle pin/unpin career
  const handlePinToggle = async (careerId) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to pin careers.',
      });
      return;
    }

    try {
      if (pinnedCareers.includes(careerId)) {
        await unpinMutation.mutateAsync(careerId);
        setPinnedCareers(pinnedCareers.filter((id) => id !== careerId));
      } else {
        await pinMutation.mutateAsync(careerId);
        setPinnedCareers([...pinnedCareers, careerId]);
        notification.success({
          message: 'Career Pinned',
          description: 'This career will now appear at the top of your list.',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to update pinned careers.',
      });
    }
  };

  // Handle rating a career
  const handleRateCareer = async (careerId, rating) => {
    if (!isAuthenticated) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to rate careers.',
      });
      return;
    }

    try {
      await rateMutation.mutateAsync({ careerId, rating });
      setUserRatings({
        ...userRatings,
        [careerId]: rating,
      });
      notification.success({
        message: 'Rating Submitted',
        description: 'Thank you for rating this career!',
      });
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to submit rating.',
      });
    }
  };

  // Handle sharing a career
  const handleShare = (career) => {
    setCurrentShareCareer(career);
    setShareModalVisible(true);
  };

  // Handle view career details
  const handleViewDetails = async (careerId) => {
    try {
      if (isAuthenticated) {
        viewMutation.mutate(careerId);
      }

      const careerDetails = await fetchCareer(careerId);
      setCurrentCareerDetails(careerDetails.data);
      setCareerDetailsDrawerVisible(true);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to load career details.',
      });
    }
  };

  // Handle adding/removing from compare list
  const handleCompareToggle = (career) => {
    if (compareList.some((c) => c._id === career._id)) {
      setCompareList(compareList.filter((c) => c._id !== career._id));
    } else {
      if (compareList.length >= 3) {
        notification.warning({
          message: 'Compare Limit Reached',
          description: 'You can compare up to 3 careers at once.',
        });
        return;
      }
      setCompareList([...compareList, career]);
      notification.success({
        message: 'Added to Compare',
        description: `${career.title} added to comparison list.`,
      });
    }
  };

  // Handle export careers list
  const handleExport = async () => {
    if (!careersData?.data?.length) {
      notification.warning({
        message: 'No Data',
        description: 'There are no careers to export.',
      });
      return;
    }

    setIsExporting(true);

    try {
      if (exportFormat === 'pdf') {
        const element = careerListRef.current;
        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('careers-list.pdf');
      }

      notification.success({
        message: 'Export Successful',
        description: `Careers list exported as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      notification.error({
        message: 'Export Failed',
        description: 'There was an error exporting the careers list.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle updating user preferences
  const handleUpdatePreferences = (newPreferences) => {
    updatePreferencesMutation.mutate({
      ...userPreferences,
      ...newPreferences,
    });
  };

  // Prepare data for CSV export
  const csvData = useMemo(() => {
    if (!careersData?.data) return [];

    return [
      ['Title', 'Category', 'Market Demand', 'Minimum Grade', 'Description'],
      ...careersData.data.map((career) => [
        career.title,
        career.category,
        career.marketDemand || 'N/A',
        career.minimumMeanGrade || 'N/A',
        career.description || 'No description available',
      ]),
    ];
  }, [careersData?.data]);

  // Prepare sorted careers with pinned items first
  const sortedCareers = useMemo(() => {
    if (!careersData?.data) return [];

    return [...careersData.data].sort((a, b) => {
      const aIsPinned = pinnedCareers.includes(a._id);
      const bIsPinned = pinnedCareers.includes(b._id);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  }, [careersData?.data, pinnedCareers]);

  // Categories for filter
  const categories = [
    'Technology',
    'Engineering',
    'Healthcare',
    'Business',
    'Finance',
    'Education',
    'Arts',
    'Science',
    'Legal',
    'Social Sciences',
    'Agriculture',
    'Hospitality',
    'Media',
    'Construction',
    'Manufacturing',
    'Transportation',
    'Other',
  ];

  // Prepare stats data for charts
  const statsData = useMemo(() => {
    if (!careerStats?.data) return [];

    const { careersByCategory } = careerStats.data;
    return (
      careersByCategory?.map((item, index) => ({
        name: item._id,
        value: item.count,
        color: CHART_COLORS[index % CHART_COLORS.length],
      })) || []
    );
  }, [careerStats]);

  const demandData = useMemo(() => {
    if (!careerStats?.data) return [];

    const { careersByDemand } = careerStats.data;
    return (
      careersByDemand?.map((item, index) => ({
        name: item._id,
        value: item.count,
        color: getDemandColor(item._id),
      })) || []
    );
  }, [careerStats]);

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Floating Action Buttons */}
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24 }}
        icon={<SettingOutlined />}
      >
        <FloatButton
          icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
          tooltip={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleTheme}
        />
        <FloatButton
          icon={
            viewMode === 'grid' ? (
              <UnorderedListOutlined />
            ) : (
              <AppstoreOutlined />
            )
          }
          tooltip={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        />
        {compareList.length > 0 && (
          <FloatButton
            icon={
              <Badge count={compareList.length}>
                <CheckCircleOutlined />
              </Badge>
            }
            tooltip="View comparison"
            onClick={() => setCompareDrawerVisible(true)}
          />
        )}
      </FloatButton.Group>

      <BackTop />

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center mb-16"
        >
          <div className="relative">
            <Title
              className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
            >
              Explore Your Future
            </Title>
            <div className="absolute -top-4 -right-4 text-6xl opacity-10">
              <RocketOutlined />
            </div>
          </div>

          <Paragraph className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Discover extraordinary career paths, unlock your potential, and
            shape your destiny. Find the perfect career that matches your
            passion, skills, and academic achievements.
          </Paragraph>

          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 max-w-md mx-auto"
            >
              <GiftOutlined className="text-2xl text-blue-500" />
              <div className="flex items-center gap-2">
                <Switch
                  checked={showRecommended}
                  onChange={(checked) => {
                    setShowRecommended(checked);
                    setCurrentPage(1);
                  }}
                />
                <Text className="font-medium">
                  Personalized Recommendations
                </Text>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Statistics Section */}
        {careerStats?.data && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={6}>
                <StatsCard
                  title="Total Careers"
                  value={careerStats.data.totalCareers}
                  icon={<RocketOutlined />}
                  color="#0080ff"
                  trend="up"
                  trendValue="12"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatsCard
                  title="High Demand"
                  value={
                    careerStats.data.careersByDemand?.find(
                      (d) => d._id === 'Very High'
                    )?.count || 0
                  }
                  icon={<FireOutlined />}
                  color="#f5222d"
                  trend="up"
                  trendValue="8"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatsCard
                  title="Categories"
                  value={careerStats.data.careersByCategory?.length || 0}
                  icon={<AppstoreOutlined />}
                  color="#52c41a"
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <StatsCard
                  title="Most Viewed"
                  value={careerStats.data.mostViewedCareers?.[0]?.views || 0}
                  icon={<EyeOutlined />}
                  color="#faad14"
                  trend="up"
                  trendValue="25"
                />
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Affix offsetTop={20}>
            <Card
              className="mb-8 shadow-2xl border-0 rounded-2xl backdrop-blur-sm"
              style={{
                background:
                  theme === 'dark'
                    ? 'rgba(45, 55, 72, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-grow">
                    <Search
                      placeholder="🔍 Search careers by title, skills, or keywords..."
                      allowClear
                      enterButton={
                        <Button
                          type="primary"
                          className="h-12 px-8 rounded-xl font-medium"
                        >
                          <SearchOutlined /> Search
                        </Button>
                      }
                      size="large"
                      className="search-input"
                      style={{
                        borderRadius: '12px',
                      }}
                      onSearch={handleSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      ref={searchInputRef}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Select
                      placeholder="📂 Category"
                      style={{ minWidth: 140 }}
                      size="large"
                      onChange={handleCategoryChange}
                      value={category || undefined}
                      allowClear
                      className="rounded-xl"
                    >
                      {categories.map((cat) => (
                        <Option key={cat} value={cat}>
                          {cat}
                        </Option>
                      ))}
                    </Select>
                    <Select
                      placeholder="🔥 Market Demand"
                      style={{ minWidth: 160 }}
                      size="large"
                      onChange={handleDemandChange}
                      value={marketDemand || undefined}
                      allowClear
                      className="rounded-xl"
                    >
                      <Option value="Very High">🔥 Very High</Option>
                      <Option value="High">🚀 High</Option>
                      <Option value="Medium">⚡ Medium</Option>
                      <Option value="Low">💡 Low</Option>
                    </Select>
                    <Select
                      placeholder="📊 Sort By"
                      style={{ minWidth: 140 }}
                      size="large"
                      onChange={handleSortChange}
                      value={sortBy}
                      defaultValue="title"
                      className="rounded-xl"
                    >
                      <Option value="title">Name (A-Z)</Option>
                      <Option value="-title">Name (Z-A)</Option>
                      <Option value="-views">Most Viewed</Option>
                      <Option value="-saves">Most Saved</Option>
                      <Option value="minimumMeanGrade">
                        Min. Grade (Low-High)
                      </Option>
                      <Option value="-minimumMeanGrade">
                        Min. Grade (High-Low)
                      </Option>
                      <Option value="-createdAt">Newest First</Option>
                      <Option value="createdAt">Oldest First</Option>
                    </Select>
                    <Button
                      type={advancedFiltersVisible ? 'primary' : 'default'}
                      icon={<FilterOutlined />}
                      size="large"
                      className="rounded-xl font-medium"
                      onClick={() =>
                        setAdvancedFiltersVisible(!advancedFiltersVisible)
                      }
                    >
                      Advanced
                    </Button>
                  </div>
                </div>

                {/* Enhanced Advanced filters */}
                <AnimatePresence>
                  {advancedFiltersVisible && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-6 border-t border-gray-200 dark:border-gray-600"
                    >
                      <Row gutter={[24, 24]}>
                        <Col xs={24} md={12}>
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <Text strong className="block mb-4 text-lg">
                              💰 Salary Range (Entry Level)
                            </Text>
                            <Slider
                              range
                              min={0}
                              max={500000}
                              step={10000}
                              value={salaryRange}
                              onChange={(value) => setSalaryRange(value)}
                              tipFormatter={(value) =>
                                `KSh ${value.toLocaleString()}`
                              }
                              trackStyle={[
                                {
                                  background:
                                    'linear-gradient(90deg, #52c41a, #73d13d)',
                                },
                              ]}
                              handleStyle={[
                                {
                                  borderColor: '#52c41a',
                                  backgroundColor: '#52c41a',
                                },
                                {
                                  borderColor: '#52c41a',
                                  backgroundColor: '#52c41a',
                                },
                              ]}
                            />
                            <div className="flex justify-between mt-2">
                              <Text type="secondary" className="font-medium">
                                KSh {salaryRange[0].toLocaleString()}
                              </Text>
                              <Text type="secondary" className="font-medium">
                                KSh {salaryRange[1].toLocaleString()}
                              </Text>
                            </div>
                          </div>
                        </Col>
                        <Col xs={24} md={12}>
                          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                            <Text strong className="block mb-4 text-lg">
                              👁️ View Mode
                            </Text>
                            <Radio.Group
                              value={viewMode}
                              onChange={(e) => setViewMode(e.target.value)}
                              buttonStyle="solid"
                              size="large"
                              className="w-full"
                            >
                              <Radio.Button
                                value="grid"
                                className="flex-1 text-center rounded-l-xl"
                              >
                                <AppstoreOutlined /> Grid
                              </Radio.Button>
                              <Radio.Button
                                value="list"
                                className="flex-1 text-center rounded-r-xl"
                              >
                                <UnorderedListOutlined /> List
                              </Radio.Button>
                            </Radio.Group>
                          </div>
                        </Col>
                      </Row>

                      <div className="mt-6 flex justify-between items-center">
                        <Button
                          size="large"
                          className="rounded-xl"
                          onClick={() => {
                            setSearchTerm('');
                            setCategory('');
                            setMarketDemand('');
                            setSalaryRange([0, 500000]);
                            setCurrentPage(1);
                          }}
                        >
                          🔄 Clear Filters
                        </Button>

                        <Popover
                          content={
                            <div className="flex flex-col gap-3 p-2">
                              <Radio.Group
                                value={exportFormat}
                                onChange={(e) =>
                                  setExportFormat(e.target.value)
                                }
                              >
                                <Radio value="pdf">📄 PDF</Radio>
                                <Radio value="csv">📊 CSV</Radio>
                              </Radio.Group>
                              {exportFormat === 'pdf' ? (
                                <Button
                                  type="primary"
                                  icon={<DownloadOutlined />}
                                  onClick={handleExport}
                                  loading={isExporting}
                                  className="rounded-xl"
                                >
                                  Export as PDF
                                </Button>
                              ) : (
                                <CSVLink
                                  data={csvData}
                                  filename="careers-list.csv"
                                  className="ant-btn ant-btn-primary rounded-xl"
                                >
                                  <DownloadOutlined /> Export as CSV
                                </CSVLink>
                              )}
                            </div>
                          }
                          title="📥 Export Options"
                          trigger="click"
                          placement="topRight"
                        >
                          <Button
                            icon={<DownloadOutlined />}
                            size="large"
                            className="rounded-xl"
                          >
                            Export
                          </Button>
                        </Popover>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </Affix>
        </motion.div>

        {/* Enhanced Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Link to="/trends">
                <motion.div whileHover={{ y: -4, scale: 1.02 }}>
                  <Card
                    hoverable
                    className="text-center h-full transition-all duration-300 border-0 rounded-2xl shadow-lg hover:shadow-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                    }}
                  >
                    <RiseOutlined className="text-5xl mb-4 opacity-90" />
                    <Title level={4} className="text-white mb-2">
                      Career Trends
                    </Title>
                    <Text className="text-white/90">
                      Explore emerging and high-demand careers
                    </Text>
                  </Card>
                </motion.div>
              </Link>
            </Col>
            <Col xs={24} sm={8}>
              <Link to="/guides">
                <motion.div whileHover={{ y: -4, scale: 1.02 }}>
                  <Card
                    hoverable
                    className="text-center h-full transition-all duration-300 border-0 rounded-2xl shadow-lg hover:shadow-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                    }}
                  >
                    <BookOutlined className="text-5xl mb-4 opacity-90" />
                    <Title level={4} className="text-white mb-2">
                      Career Guides
                    </Title>
                    <Text className="text-white/90">
                      In-depth guides to help you make informed decisions
                    </Text>
                  </Card>
                </motion.div>
              </Link>
            </Col>
            <Col xs={24} sm={8}>
              <Link to="/institutions">
                <motion.div whileHover={{ y: -4, scale: 1.02 }}>
                  <Card
                    hoverable
                    className="text-center h-full transition-all duration-300 border-0 rounded-2xl shadow-lg hover:shadow-2xl"
                    style={{
                      background:
                        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: 'white',
                    }}
                  >
                    <BarChartOutlined className="text-5xl mb-4 opacity-90" />
                    <Title level={4} className="text-white mb-2">
                      Institutions
                    </Title>
                    <Text className="text-white/90">
                      Find universities and colleges offering your desired
                      program
                    </Text>
                  </Card>
                </motion.div>
              </Link>
            </Col>
          </Row>
        </motion.div>

        {/* Enhanced Career Stats Charts */}
        {statsData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-12"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card
                  className="h-full border-0 rounded-2xl shadow-lg"
                  title={
                    <div className="flex items-center gap-2">
                      <BarChartOutlined className="text-blue-500" />
                      <span>Career Distribution by Category</span>
                    </div>
                  }
                >
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={statsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                        />
                        <XAxis
                          dataKey="name"
                          tick={{
                            fill: theme === 'dark' ? '#e5e7eb' : '#374151',
                          }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis
                          tick={{
                            fill: theme === 'dark' ? '#e5e7eb' : '#374151',
                          }}
                        />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor:
                              theme === 'dark' ? '#1f2937' : '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          }}
                        />
                        <Bar
                          dataKey="value"
                          fill="#0080ff"
                          radius={[4, 4, 0, 0]}
                        >
                          {statsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card
                  className="h-full border-0 rounded-2xl shadow-lg"
                  title={
                    <div className="flex items-center gap-2">
                      <FireOutlined className="text-red-500" />
                      <span>Market Demand Distribution</span>
                    </div>
                  }
                >
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demandData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {demandData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor:
                              theme === 'dark' ? '#1f2937' : '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Enhanced Career Listings */}
        <div className="mb-8" ref={careerListRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Divider className="border-gray-300 dark:border-gray-600">
              <Space className="text-xl font-semibold">
                <FilterOutlined className="text-blue-500" />
                <span>Career Opportunities</span>
                {careersData?.total > 0 && (
                  <Badge
                    count={careersData.total}
                    overflowCount={999}
                    style={{
                      backgroundColor: '#0080ff',
                      boxShadow: '0 2px 8px rgba(0,128,255,0.3)',
                    }}
                  />
                )}
              </Space>
            </Divider>
          </motion.div>

          {isLoading ? (
            <div className="py-12">
              {viewMode === 'grid' ? (
                <Row gutter={[24, 24]}>
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <Col xs={24} sm={12} lg={8} key={index}>
                        <Card className="h-full border-0 rounded-2xl">
                          <Skeleton active avatar paragraph={{ rows: 6 }} />
                        </Card>
                      </Col>
                    ))}
                </Row>
              ) : (
                <div className="space-y-4">
                  {Array(6)
                    .fill(null)
                    .map((_, index) => (
                      <Card key={index} className="border-0 rounded-2xl">
                        <Skeleton active avatar paragraph={{ rows: 2 }} />
                      </Card>
                    ))}
                </div>
              )}
            </div>
          ) : isError ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert
                type="error"
                message="Oops! Something went wrong"
                description="We couldn't load the career data. Please check your connection and try again."
                className="mb-4 border-0 rounded-2xl"
                action={
                  <Button
                    size="large"
                    type="primary"
                    className="rounded-xl"
                    onClick={() => refetch()}
                  >
                    🔄 Retry
                  </Button>
                }
                showIcon
              />
            </motion.div>
          ) : !sortedCareers || sortedCareers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 120 }}
                description={
                  <div className="space-y-4">
                    <Title
                      level={3}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      No careers found
                    </Title>
                    <Paragraph className="text-gray-400 dark:text-gray-500">
                      We couldn't find any careers matching your criteria. Try
                      adjusting your filters or search terms.
                    </Paragraph>
                    <Button
                      type="primary"
                      size="large"
                      className="rounded-xl"
                      onClick={() => {
                        setSearchTerm('');
                        setCategory('');
                        setMarketDemand('');
                        setSalaryRange([0, 500000]);
                        setCurrentPage(1);
                      }}
                    >
                      🔄 Clear All Filters
                    </Button>
                  </div>
                }
              />
            </motion.div>
          ) : (
            <>
              {/* Compare careers banner */}
              <AnimatePresence>
                {compareList.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800">
                          <CheckCircleOutlined className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <Text strong className="text-lg">
                            {compareList.length} careers selected for comparison
                          </Text>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Compare salaries, requirements, and opportunities
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="primary"
                          size="large"
                          className="rounded-xl"
                          onClick={() => setCompareDrawerVisible(true)}
                          disabled={compareList.length < 2}
                        >
                          📊 Compare Careers
                        </Button>
                        <Button
                          size="large"
                          className="rounded-xl"
                          onClick={() => setCompareList([])}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Career cards */}
              {viewMode === 'grid' ? (
                <Row gutter={[24, 24]}>
                  {sortedCareers.map((career, index) => (
                    <Col xs={24} sm={12} lg={8} key={career._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <CareerCard
                          career={career}
                          savedCareers={savedCareers}
                          pinnedCareers={pinnedCareers}
                          handleSaveToggle={handleSaveToggle}
                          handlePinToggle={handlePinToggle}
                          handleRateCareer={handleRateCareer}
                          isAuthenticated={isAuthenticated}
                          handleShare={handleShare}
                          handleViewDetails={handleViewDetails}
                          userRatings={userRatings}
                          viewMode={viewMode}
                        />
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="space-y-4">
                  {sortedCareers.map((career, index) => (
                    <motion.div
                      key={career._id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <CareerCard
                        career={career}
                        savedCareers={savedCareers}
                        pinnedCareers={pinnedCareers}
                        handleSaveToggle={handleSaveToggle}
                        handlePinToggle={handlePinToggle}
                        handleRateCareer={handleRateCareer}
                        isAuthenticated={isAuthenticated}
                        handleShare={handleShare}
                        handleViewDetails={handleViewDetails}
                        userRatings={userRatings}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Enhanced Pagination */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-12 flex justify-center"
              >
                <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={careersData?.total || 0}
                    onChange={handlePageChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) => (
                      <span className="text-gray-600 dark:text-gray-300 font-medium">
                        Showing {range[0]}-{range[1]} of {total} careers
                      </span>
                    )}
                    pageSizeOptions={['9', '18', '36', '72']}
                    className="custom-pagination"
                  />
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Enhanced Career Categories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <Title level={2} className="text-4xl font-bold mb-4">
              Explore by Category
            </Title>
            <Paragraph className="text-xl text-gray-600 dark:text-gray-300">
              Discover careers across different industries and sectors
            </Paragraph>
          </div>

          <Row gutter={[24, 24]}>
            {categories.slice(0, 8).map((categoryItem, index) => (
              <Col xs={24} sm={12} md={6} key={categoryItem}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card
                    hoverable
                    className="text-center h-full transition-all duration-300 border-0 rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer"
                    style={{
                      background:
                        theme === 'dark'
                          ? 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
                          : 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
                    }}
                    onClick={() => {
                      setCategory(categoryItem);
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="p-6">
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl"
                        style={{
                          background: `linear-gradient(135deg, ${
                            CHART_COLORS[index % CHART_COLORS.length]
                          }20, ${CHART_COLORS[index % CHART_COLORS.length]}40)`,
                          color: CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      >
                        {categoryItem === 'Technology' && '💻'}
                        {categoryItem === 'Engineering' && '⚙️'}
                        {categoryItem === 'Healthcare' && '🏥'}
                        {categoryItem === 'Business' && '💼'}
                        {categoryItem === 'Finance' && '💰'}
                        {categoryItem === 'Education' && '📚'}
                        {categoryItem === 'Arts' && '🎨'}
                        {categoryItem === 'Science' && '🔬'}
                      </div>
                      <Title level={4} className="mb-2">
                        {categoryItem}
                      </Title>
                      <Paragraph className="text-gray-500 dark:text-gray-400 mb-0">
                        Explore careers in the {categoryItem.toLowerCase()}{' '}
                        sector
                      </Paragraph>
                      <div className="mt-4">
                        <Text
                          className="text-sm font-medium"
                          style={{
                            color: CHART_COLORS[index % CHART_COLORS.length],
                          }}
                        >
                          {statsData.find((s) => s.name === categoryItem)
                            ?.value || 0}{' '}
                          careers available
                        </Text>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>

        {/* Enhanced Call-to-Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="text-center p-12 rounded-3xl"
          style={{
            background:
              theme === 'dark'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto text-white">
            <Title level={2} className="text-white text-4xl font-bold mb-6">
              🚀 Ready to Launch Your Career?
            </Title>
            <Paragraph className="text-xl text-white/90 mb-8 leading-relaxed">
              Take our comprehensive career assessment to get personalized
              recommendations based on your academic performance, interests, and
              skills. Your dream career awaits!
            </Paragraph>
            <Space size="large" className="flex-wrap justify-center">
              <Link to="/input-results">
                <Button
                  type="primary"
                  size="large"
                  className="h-14 px-8 rounded-2xl font-semibold text-lg border-0"
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                  }}
                >
                  🎯 Get Career Recommendations
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="large"
                  className="h-14 px-8 rounded-2xl font-semibold text-lg border-2 border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  📖 Learn More
                </Button>
              </Link>
            </Space>
          </div>
        </motion.div>

        {/* Enhanced Career Details Drawer */}
        <Drawer
          title={
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: getDemandGradient(
                      currentCareerDetails?.marketDemand
                    ),
                  }}
                >
                  {getDemandIcon(currentCareerDetails?.marketDemand)}
                </div>
                <div>
                  <Title level={4} className="mb-0">
                    {currentCareerDetails?.title}
                  </Title>
                  <Text type="secondary">{currentCareerDetails?.category}</Text>
                </div>
              </div>
              {isAuthenticated && currentCareerDetails && (
                <Button
                  type="text"
                  icon={
                    compareList.some(
                      (c) => c._id === currentCareerDetails._id
                    ) ? (
                      <CheckCircleOutlined className="text-green-500" />
                    ) : (
                      <PlusOutlined />
                    )
                  }
                  onClick={() => handleCompareToggle(currentCareerDetails)}
                  className="rounded-xl"
                >
                  {compareList.some((c) => c._id === currentCareerDetails._id)
                    ? 'Added to Compare'
                    : 'Add to Compare'}
                </Button>
              )}
            </div>
          }
          placement="right"
          width={700}
          onClose={() => setCareerDetailsDrawerVisible(false)}
          open={careerDetailsDrawerVisible}
          className="career-details-drawer"
          extra={
            <Space>
              {isAuthenticated && currentCareerDetails && (
                <Button
                  type="text"
                  icon={
                    savedCareers.includes(currentCareerDetails._id) ? (
                      <HeartFilled className="text-red-500" />
                    ) : (
                      <HeartOutlined />
                    )
                  }
                  onClick={() => handleSaveToggle(currentCareerDetails._id)}
                  className="rounded-xl"
                >
                  {savedCareers.includes(currentCareerDetails._id)
                    ? 'Saved'
                    : 'Save'}
                </Button>
              )}
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                onClick={() => {
                  if (currentCareerDetails) {
                    handleShare(currentCareerDetails);
                  }
                }}
                className="rounded-xl"
              >
                Share
              </Button>
            </Space>
          }
        >
          {currentCareerDetails ? (
            <div className="space-y-6">
              {/* Header with demand indicator */}
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: getDemandGradient(
                    currentCareerDetails.marketDemand
                  ),
                }}
              >
                <div className="flex justify-between items-start text-white">
                  <div>
                    <Tag
                      className="border-0 text-white font-medium mb-3"
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                    >
                      {currentCareerDetails.category}
                    </Tag>
                    <div className="flex items-center gap-2 mb-2">
                      {getDemandIcon(currentCareerDetails.marketDemand)}
                      <Text className="text-white font-semibold">
                        {currentCareerDetails.marketDemand} Demand
                      </Text>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/80 text-sm">Market Demand</div>
                    <Progress
                      percent={getDemandPercentage(
                        currentCareerDetails.marketDemand
                      )}
                      showInfo={false}
                      strokeColor="rgba(255,255,255,0.8)"
                      trailColor="rgba(255,255,255,0.2)"
                      strokeWidth={6}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>

              <Paragraph className="text-lg leading-relaxed">
                {currentCareerDetails.description}
              </Paragraph>

              <Tabs defaultActiveKey="1" className="career-details-tabs">
                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <BulbOutlined />
                      Overview
                    </span>
                  }
                  key="1"
                >
                  <div className="space-y-6">
                    {currentCareerDetails.minimumMeanGrade && (
                      <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center gap-3">
                          <TrophyOutlined className="text-2xl text-purple-500" />
                          <div>
                            <Text strong className="block">
                              Minimum Grade Required
                            </Text>
                            <Tag
                              color="purple"
                              className="mt-1 text-lg px-3 py-1"
                            >
                              {currentCareerDetails.minimumMeanGrade}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentCareerDetails.salary && (
                      <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-3 mb-3">
                          <DollarOutlined className="text-2xl text-green-500" />
                          <Text strong className="text-lg">
                            Salary Range
                          </Text>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <Text type="secondary" className="block text-sm">
                              Entry Level
                            </Text>
                            <Tag
                              color="green"
                              className="mt-1 text-base px-3 py-1"
                            >
                              {currentCareerDetails.salary.entry}
                            </Tag>
                          </div>
                          <div className="text-center">
                            <Text type="secondary" className="block text-sm">
                              Mid-Career
                            </Text>
                            <Tag
                              color="blue"
                              className="mt-1 text-base px-3 py-1"
                            >
                              {currentCareerDetails.salary.mid}
                            </Tag>
                          </div>
                          <div className="text-center">
                            <Text type="secondary" className="block text-sm">
                              Senior Level
                            </Text>
                            <Tag
                              color="gold"
                              className="mt-1 text-base px-3 py-1"
                            >
                              {currentCareerDetails.salary.senior}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentCareerDetails.programDuration && (
                      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-3">
                          <ClockCircleOutlined className="text-2xl text-blue-500" />
                          <div>
                            <Text strong className="block">
                              Program Duration
                            </Text>
                            <Tag
                              color="blue"
                              className="mt-1 text-lg px-3 py-1"
                            >
                              {currentCareerDetails.programDuration}
                            </Tag>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentCareerDetails.keySubjects &&
                      currentCareerDetails.keySubjects.length > 0 && (
                        <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
                          <div className="flex items-center gap-3 mb-3">
                            <BookOutlined className="text-2xl text-orange-500" />
                            <Text strong className="text-lg">
                              Key Subjects
                            </Text>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {currentCareerDetails.keySubjects.map(
                              (subject, index) => (
                                <Tag
                                  key={index}
                                  className="text-base px-3 py-1 rounded-full"
                                >
                                  {subject}
                                </Tag>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <CheckCircleOutlined />
                      Requirements
                    </span>
                  }
                  key="2"
                >
                  <Collapse
                    defaultActiveKey={['1']}
                    className="border-0"
                    expandIconPosition="end"
                  >
                    <Panel
                      header={
                        <div className="flex items-center gap-2 font-semibold">
                          <BookOutlined className="text-blue-500" />
                          Education Requirements
                        </div>
                      }
                      key="1"
                      className="mb-4 rounded-xl"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Text strong>Minimum Grade:</Text>
                          <Tag color="purple">
                            {currentCareerDetails.minimumMeanGrade ||
                              'Not specified'}
                          </Tag>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Text strong>Program Duration:</Text>
                          <Tag color="blue">
                            {currentCareerDetails.programDuration ||
                              'Not specified'}
                          </Tag>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Text strong className="block mb-2">
                            Key Subjects:
                          </Text>
                          <div className="flex flex-wrap gap-1">
                            {currentCareerDetails.keySubjects?.map(
                              (subject, index) => (
                                <Tag key={index}>{subject}</Tag>
                              )
                            ) || <Text type="secondary">Not specified</Text>}
                          </div>
                        </div>
                      </div>
                    </Panel>

                    <Panel
                      header={
                        <div className="flex items-center gap-2 font-semibold">
                          <RocketOutlined className="text-green-500" />
                          Skills Required
                        </div>
                      }
                      key="2"
                      className="mb-4 rounded-xl"
                    >
                      <div className="space-y-2">
                        {currentCareerDetails.skillsRequired &&
                        currentCareerDetails.skillsRequired.length > 0 ? (
                          currentCareerDetails.skillsRequired.map(
                            (skill, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <CheckCircleOutlined className="text-green-500" />
                                <Text>{skill}</Text>
                              </div>
                            )
                          )
                        ) : (
                          <Text type="secondary">
                            Skills information not available
                          </Text>
                        )}
                      </div>
                    </Panel>

                    <Panel
                      header={
                        <div className="flex items-center gap-2 font-semibold">
                          <CrownOutlined className="text-gold" />
                          Certifications
                        </div>
                      }
                      key="3"
                      className="rounded-xl"
                    >
                      <div className="space-y-3">
                        {currentCareerDetails.certifications &&
                        currentCareerDetails.certifications.length > 0 ? (
                          currentCareerDetails.certifications.map(
                            (cert, index) => (
                              <div
                                key={index}
                                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                              >
                                <Text strong className="block">
                                  {cert.name}
                                </Text>
                                {cert.provider && (
                                  <Text type="secondary" className="block">
                                    Provider: {cert.provider}
                                  </Text>
                                )}
                                {cert.description && (
                                  <Paragraph className="mt-2 mb-0 text-sm">
                                    {cert.description}
                                  </Paragraph>
                                )}
                              </div>
                            )
                          )
                        ) : (
                          <Text type="secondary">
                            Certification information not available
                          </Text>
                        )}
                      </div>
                    </Panel>
                  </Collapse>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <RiseOutlined />
                      Career Path
                    </span>
                  }
                  key="3"
                >
                  <div className="space-y-6">
                    {currentCareerDetails.careerPath && (
                      <>
                        {currentCareerDetails.careerPath.entryLevel && (
                          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500">
                            <Title
                              level={5}
                              className="text-green-700 dark:text-green-400 mb-3"
                            >
                              🌱 Entry Level
                            </Title>
                            <div className="space-y-2">
                              <div>
                                <Text strong>Roles: </Text>
                                <Text>
                                  {currentCareerDetails.careerPath.entryLevel.roles?.join(
                                    ', '
                                  ) || 'Not specified'}
                                </Text>
                              </div>
                              <div>
                                <Text strong>Experience: </Text>
                                <Text>
                                  {currentCareerDetails.careerPath.entryLevel
                                    .experience || 'Not specified'}
                                </Text>
                              </div>
                              <div>
                                <Text strong>Description: </Text>
                                <Paragraph className="mb-0">
                                  {currentCareerDetails.careerPath.entryLevel
                                    .description || 'Not available'}
                                </Paragraph>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentCareerDetails.careerPath.midLevel && (
                          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
                            <Title
                              level={5}
                              className="text-blue-700 dark:text-blue-400 mb-3"
                            >
                              🚀 Mid Level
                            </Title>
                            <div className="space-y-2">
                              <div>
                                <Text strong>Roles: </Text>
                                <Text>
                                  {currentCareerDetails.careerPath.midLevel.roles?.join(
                                    ', '
                                  ) || 'Not specified'}
                                </Text>
                              </div>
                              <div>
                                <Text strong>Experience: </Text>
                                <Text>
                                  {currentCareerDetails.careerPath.midLevel
                                    .experience || 'Not specified'}
                                </Text>
                              </div>
                              <div>
                                <Text strong>Description: </Text>
                                <Paragraph className="mb-0">
                                  {currentCareerDetails.careerPath.midLevel
                                    .description || 'Not available'}
                                </Paragraph>
                              </div>
                            </div>
                          </div>
                        )}

                        {currentCareerDetails.careerPath.seniorLevel && (
                          <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500">
                            <Title
                              level={5}
                              className="text-purple-700 dark:text-purple-400 mb-3"
                            >
                              👑 Senior Level
                            </Title>
                            <div className="space-y-2">
                              <div>
                                <Text strong>Roles: </Text>
                                <Text>
                                  {currentCareerDetails.careerPath.seniorLevel.roles?.join(
                                    ', '
                                  ) || 'Not specified'}
                                </Text>
                              </div>
                              <div>
                                <Text strong>Experience: </Text>
                                <Text>
                                  {currentCareerDetails.careerPath.seniorLevel
                                    .experience || 'Not specified'}
                                </Text>
                              </div>
                              <div>
                                <Text strong>Description: </Text>
                                <Paragraph className="mb-0">
                                  {currentCareerDetails.careerPath.seniorLevel
                                    .description || 'Not available'}
                                </Paragraph>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </TabPane>

                <TabPane
                  tab={
                    <span className="flex items-center gap-2">
                      <FireOutlined />
                      Job Prospects
                    </span>
                  }
                  key="4"
                >
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
                      <div className="flex items-center gap-3 mb-4">
                        <FireOutlined className="text-2xl text-red-500" />
                        <Text strong className="text-lg">
                          Market Demand Analysis
                        </Text>
                      </div>
                      <Progress
                        percent={getDemandPercentage(
                          currentCareerDetails.marketDemand
                        )}
                        status="active"
                        strokeColor={getDemandColor(
                          currentCareerDetails.marketDemand
                        )}
                        trailColor={theme === 'dark' ? '#374151' : '#f3f4f6'}
                        strokeWidth={12}
                        format={(percent) => (
                          <span
                            style={{
                              color: getDemandColor(
                                currentCareerDetails.marketDemand
                              ),
                              fontWeight: 'bold',
                            }}
                          >
                            {currentCareerDetails.marketDemand}
                          </span>
                        )}
                      />
                    </div>

                    {currentCareerDetails.jobProspects &&
                      currentCareerDetails.jobProspects.length > 0 && (
                        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                          <div className="flex items-center gap-3 mb-4">
                            <RocketOutlined className="text-2xl text-blue-500" />
                            <Text strong className="text-lg">
                              Job Opportunities
                            </Text>
                          </div>
                          <div className="space-y-2">
                            {currentCareerDetails.jobProspects.map(
                              (prospect, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg"
                                >
                                  <CheckCircleOutlined className="text-green-500 mt-1" />
                                  <Text>{prospect}</Text>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {currentCareerDetails.industryTrends &&
                      currentCareerDetails.industryTrends.length > 0 && (
                        <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                          <div className="flex items-center gap-3 mb-4">
                            <RiseOutlined className="text-2xl text-purple-500" />
                            <Text strong className="text-lg">
                              Industry Trends
                            </Text>
                          </div>
                          <div className="space-y-2">
                            {currentCareerDetails.industryTrends.map(
                              (trend, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg"
                                >
                                  <ThunderboltOutlined className="text-yellow-500 mt-1" />
                                  <Text>{trend}</Text>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </TabPane>

                {currentCareerDetails.institutions &&
                  currentCareerDetails.institutions.length > 0 && (
                    <TabPane
                      tab={
                        <span className="flex items-center gap-2">
                          <BookOutlined />
                          Institutions
                        </span>
                      }
                      key="5"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <BookOutlined className="text-2xl text-blue-500" />
                          <Text strong className="text-lg">
                            Universities and Colleges offering this program
                          </Text>
                        </div>
                        <List
                          dataSource={currentCareerDetails.institutions}
                          renderItem={(institution) => (
                            <List.Item className="border-0 p-4 mb-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    size={48}
                                    style={{ backgroundColor: '#0080ff' }}
                                    icon={<BookOutlined />}
                                  />
                                }
                                title={
                                  <Text strong className="text-lg">
                                    {institution.name}
                                  </Text>
                                }
                                description={
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <Tag color="blue">{institution.type}</Tag>
                                    </div>
                                    <Text type="secondary">
                                      📍 {institution.location?.city},{' '}
                                      {institution.location?.country}
                                    </Text>
                                    {institution.website && (
                                      <div className="mt-2">
                                        <Button
                                          type="link"
                                          href={institution.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="p-0 h-auto"
                                        >
                                          🌐 Visit Website
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                    </TabPane>
                  )}
              </Tabs>

              {/* Related Careers */}
              {relatedCareers?.data?.relatedCareers &&
                relatedCareers.data.relatedCareers.length > 0 && (
                  <div className="mt-8">
                    <Divider>
                      <div className="flex items-center gap-2">
                        <RocketOutlined className="text-blue-500" />
                        <span className="font-semibold">Related Careers</span>
                      </div>
                    </Divider>
                    <Row gutter={[16, 16]}>
                      {relatedCareers.data.relatedCareers.map((career) => (
                        <Col xs={24} sm={12} key={career._id}>
                          <Card
                            hoverable
                            size="small"
                            className="border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                            onClick={() => handleViewDetails(career._id)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <Text strong className="text-base">
                                {career.title}
                              </Text>
                              <Tag color="blue">{career.category}</Tag>
                            </div>
                            {career.marketDemand && (
                              <div className="flex items-center gap-2">
                                {getDemandIcon(career.marketDemand)}
                                <Tag
                                  style={{
                                    background: getDemandGradient(
                                      career.marketDemand
                                    ),
                                    border: 'none',
                                    color: 'white',
                                  }}
                                  size="small"
                                >
                                  {career.marketDemand}
                                </Tag>
                              </div>
                            )}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
            </div>
          ) : (
            <div className="p-8">
              <Skeleton active avatar paragraph={{ rows: 10 }} />
            </div>
          )}
        </Drawer>

        {/* Enhanced Compare Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-3">
              <CheckCircleOutlined className="text-blue-500 text-xl" />
              <span className="text-xl font-bold">Compare Careers</span>
            </div>
          }
          placement="bottom"
          height="80vh"
          onClose={() => setCompareDrawerVisible(false)}
          open={compareDrawerVisible}
          className="compare-drawer"
        >
          {compareList.length >= 2 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <th className="p-4 text-left font-bold">Feature</th>
                    {compareList.map((career) => (
                      <th key={career._id} className="p-4 text-center min-w-64">
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                            style={{
                              background: getDemandGradient(
                                career.marketDemand
                              ),
                            }}
                          >
                            {getDemandIcon(career.marketDemand)}
                          </div>
                          <Text strong className="text-white text-base">
                            {career.title}
                          </Text>
                          <Button
                            size="small"
                            type="text"
                            danger
                            icon={<CloseOutlined />}
                            onClick={() =>
                              setCompareList(
                                compareList.filter((c) => c._id !== career._id)
                              )
                            }
                            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full"
                          >
                            Remove
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold">
                      Category
                    </td>
                    {compareList.map((career) => (
                      <td key={career._id} className="p-4 text-center">
                        <Tag color="blue" className="text-base px-3 py-1">
                          {career.category}
                        </Tag>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold">
                      Market Demand
                    </td>
                    {compareList.map((career) => (
                      <td key={career._id} className="p-4 text-center">
                        <Tag
                          style={{
                            background: getDemandGradient(career.marketDemand),
                            border: 'none',
                            color: 'white',
                          }}
                          className="text-base px-3 py-1"
                        >
                          {getDemandIcon(career.marketDemand)}{' '}
                          {career.marketDemand || 'N/A'}
                        </Tag>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold">
                      Minimum Grade
                    </td>
                    {compareList.map((career) => (
                      <td key={career._id} className="p-4 text-center">
                        <Tag color="purple" className="text-base px-3 py-1">
                          {career.minimumMeanGrade || 'N/A'}
                        </Tag>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold">
                      Entry Salary
                    </td>
                    {compareList.map((career) => (
                      <td key={career._id} className="p-4 text-center">
                        {career.salary?.entry ? (
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Text className="font-semibold text-green-700 dark:text-green-400">
                              {career.salary.entry}
                            </Text>
                          </div>
                        ) : (
                          <Text type="secondary">N/A</Text>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold">
                      Program Duration
                    </td>
                    {compareList.map((career) => (
                      <td key={career._id} className="p-4 text-center">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <Text className="font-semibold text-blue-700 dark:text-blue-400">
                            {career.programDuration || 'N/A'}
                          </Text>
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <td className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold">
                      Key Subjects
                    </td>
                    {compareList.map((career) => (
                      <td key={career._id} className="p-4">
                        {career.keySubjects && career.keySubjects.length > 0 ? (
                          <div className="flex flex-wrap gap-1 justify-center">
                            {career.keySubjects
                              .slice(0, 4)
                              .map((subject, index) => (
                                <Tag key={index} size="small" className="mb-1">
                                  {subject}
                                </Tag>
                              ))}
                            {career.keySubjects.length > 4 && (
                              <Tag size="small" className="mb-1">
                                +{career.keySubjects.length - 4} more
                              </Tag>
                            )}
                          </div>
                        ) : (
                          <Text type="secondary" className="text-center block">
                            N/A
                          </Text>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 bg-gray-50 dark:bg-gray-700 font-semibold">
                      Description
                    </td>
                    {compareList.map((career) => (
                      <td key={career._id} className="p-4">
                        <div className="p-3 bg-gray-100 dark:bg-gray-600 rounded-lg">
                          <Paragraph
                            ellipsis={{ rows: 4 }}
                            className="mb-0 text-sm"
                          >
                            {career.description || 'No description available'}
                          </Paragraph>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Empty
                description={
                  <div className="text-center">
                    <Title
                      level={3}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      Select at least 2 careers to compare
                    </Title>
                    <Paragraph className="text-gray-400 dark:text-gray-500">
                      Browse careers and click the compare button to add them
                      here
                    </Paragraph>
                  </div>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </Drawer>

        {/* Enhanced Share Modal */}
        <Modal
          title={
            <div className="flex items-center gap-3">
              <ShareAltOutlined className="text-blue-500 text-xl" />
              <span className="text-xl font-bold">Share Career</span>
            </div>
          }
          open={shareModalVisible}
          onCancel={() => setShareModalVisible(false)}
          footer={null}
          className="share-modal"
          width={500}
        >
          {currentShareCareer && (
            <div className="space-y-6">
              <div className="text-center p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <div
                  className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                  style={{
                    background: getDemandGradient(
                      currentShareCareer.marketDemand
                    ),
                  }}
                >
                  {getDemandIcon(currentShareCareer.marketDemand)}
                </div>
                <Title level={4} className="mb-2">
                  Share {currentShareCareer.title}
                </Title>
                <Paragraph type="secondary">
                  Share this amazing career opportunity with friends and
                  colleagues
                </Paragraph>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    className="w-16 h-16 text-2xl"
                    onClick={() => {
                      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.origin +
                          '/career/' +
                          currentShareCareer._id
                      )}`;
                      window.open(url, '_blank');
                      setShareModalVisible(false);
                    }}
                    style={{
                      backgroundColor: '#1877f2',
                      borderColor: '#1877f2',
                    }}
                  >
                    f
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    className="w-16 h-16 text-2xl"
                    onClick={() => {
                      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        'Check out this career: ' + currentShareCareer.title
                      )}&url=${encodeURIComponent(
                        window.location.origin +
                          '/career/' +
                          currentShareCareer._id
                      )}`;
                      window.open(url, '_blank');
                      setShareModalVisible(false);
                    }}
                    style={{
                      backgroundColor: '#1da1f2',
                      borderColor: '#1da1f2',
                    }}
                  >
                    𝕏
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    className="w-16 h-16 text-2xl"
                    onClick={() => {
                      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                        window.location.origin +
                          '/career/' +
                          currentShareCareer._id
                      )}`;
                      window.open(url, '_blank');
                      setShareModalVisible(false);
                    }}
                    style={{
                      backgroundColor: '#0077b5',
                      borderColor: '#0077b5',
                    }}
                  >
                    in
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="primary"
                    shape="circle"
                    size="large"
                    className="w-16 h-16 text-2xl"
                    onClick={() => {
                      const subject = `Career Opportunity: ${currentShareCareer.title}`;
                      const body = `I found this interesting career opportunity: ${currentShareCareer.title}\n\nCheck it out: ${window.location.origin}/career/${currentShareCareer._id}`;
                      window.location.href = `mailto:?subject=${encodeURIComponent(
                        subject
                      )}&body=${encodeURIComponent(body)}`;
                      setShareModalVisible(false);
                    }}
                    style={{
                      backgroundColor: '#ea4335',
                      borderColor: '#ea4335',
                    }}
                  >
                    @
                  </Button>
                </motion.div>
              </div>

              <Divider />

              <div>
                <Text strong className="block mb-3">
                  📋 Share Link
                </Text>
                <div className="flex gap-2">
                  <Input
                    value={`${window.location.origin}/career/${currentShareCareer._id}`}
                    readOnly
                    className="rounded-xl"
                  />
                  <Button
                    type="primary"
                    className="rounded-xl"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/career/${currentShareCareer._id}`
                      );
                      notification.success({
                        message: 'Link Copied! 📋',
                        description:
                          'Career link has been copied to clipboard.',
                      });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .search-input .ant-input-group-addon {
          border-radius: 0 12px 12px 0 !important;
        }

        .search-input .ant-input {
          border-radius: 12px 0 0 12px !important;
          height: 48px !important;
          font-size: 16px !important;
        }

        .custom-pagination .ant-pagination-item {
          border-radius: 8px !important;
          border: 2px solid transparent !important;
        }

        .custom-pagination .ant-pagination-item-active {
          background: linear-gradient(
            135deg,
            #0080ff 0%,
            #1a9dff 100%
          ) !important;
          border-color: #0080ff !important;
        }

        .custom-pagination .ant-pagination-item-active a {
          color: white !important;
        }

        .career-details-drawer .ant-drawer-body {
          padding: 0 !important;
        }

        .career-details-tabs .ant-tabs-tab {
          padding: 12px 16px !important;
          font-weight: 500 !important;
        }

        .compare-drawer .ant-drawer-body {
          padding: 24px !important;
        }

        .share-modal .ant-modal-body {
          padding: 24px !important;
        }

        @media (max-width: 768px) {
          .search-input .ant-input {
            height: 44px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Careers;
