'use client';

import { useState, useRef } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  Form,
  Select,
  Tooltip,
  Switch,
  Divider,
  Collapse,
  Typography,
  Badge,
  Card,
  Empty,
  Alert,
  Tabs,
  Skeleton,
  Statistic,
  Row,
  Col,
  Progress,
  Radio,
  Checkbox,
  Upload,
  Dropdown,
  Menu,
  Timeline,
  List,
  Avatar,
  notification,
  Image,
  Drawer,
  Spin,
  Segmented,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  StarFilled,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  DollarOutlined,
  TrophyOutlined,
  RiseOutlined,
  EnvironmentOutlined,
  CopyOutlined,
  PrinterOutlined,
  HeartOutlined,
  EllipsisOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  AppstoreOutlined,
  CrownOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  BarsOutlined,
  StarOutlined,
  SwapOutlined,
  DownloadOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  UploadOutlined,
  CloudUploadOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UploadWidget from '../../../components/v2/common/UploadWidget';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Pie, Column, Bar } from '@ant-design/charts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Slider } from '@mui/material';
import { CSVLink } from 'react-csv';
import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';

const { confirm } = Modal;
const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Dragger } = Upload;

const CareerManagement = () => {
  // State management
  const [searchText, setSearchText] = useState('');
  const [careerModalVisible, setCareerModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCareer, setCurrentCareer] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    marketDemand: [],
    featured: null,
    minimumMeanGrade: [],
    salary: null,
  });
  const [sortField, setSortField] = useState('title');
  const [sortOrder, setSortOrder] = useState('ascend');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [activeTabKey, setActiveTabKey] = useState('1');
  const formRef = useRef(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkActionMenuVisible, setBulkActionMenuVisible] = useState(false);
  const [careerDetailDrawer, setCareerDetailDrawer] = useState(false);
  const [careerDetailTabs, setCareerDetailTabs] = useState('overview');
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [compareDrawerVisible, setCompareDrawerVisible] = useState(false);
  const [careersToCompare, setCareersToCompare] = useState([]);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    salaryRange: [0, 1000000],
    experienceLevel: [],
    skills: [],
    subjects: [],
  });
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [careerToDuplicate, setCareerToDuplicate] = useState(null);
  const [batchUploadVisible, setBatchUploadVisible] = useState(false);
  const [batchTemplate, setBatchTemplate] = useState([]);
  const [careerStats, setCareerStats] = useState({
    totalCareers: 0,
    featuredCareers: 0,
    categoryCounts: {},
    demandDistribution: {},
    averageSalaries: {},
    popularSkills: [],
    topViewedCareers: [],
    topSavedCareers: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCareers, setTotalCareers] = useState(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const csvLinkRef = useRef(null);

  // Fetch careers with pagination
  const {
    data: careersResponse,
    isLoading,
    error: fetchError,
    refetch,
  } = useQuery({
    queryKey: ['admin-careers', currentPage, pageSize, searchText, filters, sortField, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      // Add search parameter if search text exists
      if (searchText.trim()) {
        params.append('search', searchText.trim());
      }

      // Add sort parameters
      if (sortField && sortOrder) {
        const sortDirection = sortOrder === 'ascend' ? '' : '-';
        params.append('sort', `${sortDirection}${sortField}`);
      }

      // Add filter parameters
      if (filters.category.length > 0) {
        filters.category.forEach(category => {
          params.append('category', category);
        });
      }
      if (filters.marketDemand.length > 0) {
        filters.marketDemand.forEach(demand => {
          params.append('marketDemand', demand);
        });
      }
      if (filters.featured !== null) {
        params.append('featured', filters.featured.toString());
      }
      if (filters.minimumMeanGrade.length > 0) {
        filters.minimumMeanGrade.forEach(grade => {
          params.append('minimumMeanGrade', grade);
        });
      }

      const response = await api.get(`/careers?${params.toString()}`);
      return response.data;
    },
    onSuccess: (data) => {
      // Update total careers count
      setTotalCareers(data.total || 0);
      
      // Calculate statistics for analytics (using all data for stats)
      if (data.data && data.data.length > 0) {
        calculateCareerStats(data.data);
      }
    },
  });

  // Extract careers data from response
  const careers = careersResponse?.data || [];

  // Fetch career analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['career-analytics'],
    queryFn: async () => {
      const response = await api.get('/admin/career-popularity');
      return response.data;
    },
    enabled: analyticsModalVisible,
  });

  // Calculate career statistics for analytics
  const calculateCareerStats = (careersData) => {
    // Total careers
    const totalCareers = careersData.length;

    // Featured careers
    const featuredCareers = careersData.filter((c) => c.featured).length;

    // Category distribution
    const categoryCounts = careersData.reduce((acc, career) => {
      acc[career.category] = (acc[career.category] || 0) + 1;
      return acc;
    }, {});

    // Market demand distribution
    const demandDistribution = careersData.reduce((acc, career) => {
      acc[career.marketDemand] = (acc[career.marketDemand] || 0) + 1;
      return acc;
    }, {});

    // Average salaries by category
    const salariesByCategory = careersData.reduce((acc, career) => {
      if (!acc[career.category]) {
        acc[career.category] = { total: 0, count: 0 };
      }

      const entrySalary =
        Number.parseFloat(career.salary?.entry?.replace(/[^0-9.]/g, '')) || 0;
      if (entrySalary > 0) {
        acc[career.category].total += entrySalary;
        acc[career.category].count += 1;
      }

      return acc;
    }, {});

    const averageSalaries = Object.keys(salariesByCategory).reduce(
      (acc, category) => {
        const { total, count } = salariesByCategory[category];
        acc[category] = count > 0 ? Math.round(total / count) : 0;
        return acc;
      },
      {}
    );

    // Popular skills
    const skillsCount = {};
    careersData.forEach((career) => {
      (career.skillsRequired || []).forEach((skill) => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });

    const popularSkills = Object.entries(skillsCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    // Top viewed and saved careers
    const topViewedCareers = [...careersData]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    const topSavedCareers = [...careersData]
      .sort((a, b) => (b.saves || 0) - (a.saves || 0))
      .slice(0, 5);

    setCareerStats({
      totalCareers,
      featuredCareers,
      categoryCounts,
      demandDistribution,
      averageSalaries,
      popularSkills,
      topViewedCareers,
      topSavedCareers,
    });
  };

  // Handle image upload success
  const handleImageUpload = (url) => {
    setImageUrl(url);
    form.setFieldsValue({ image: url });
  };

  // Create career mutation
  const createCareerMutation = useMutation({
    mutationFn: (careerData) => {
      // Transform the data to match the backend model structure
      const transformedData = {
        title: careerData.title,
        category: careerData.category,
        description: careerData.description,
        keySubjects: careerData.keySubjects || [],
        requiredGrades: careerData.requiredGrades || {},
        minimumMeanGrade: careerData.minimumMeanGrade,
        marketDemand: careerData.marketDemand,
        jobProspects: careerData.jobProspects || [],
        salary: {
          entry: careerData.entryLevelSalary,
          mid: careerData.midLevelSalary,
          senior: careerData.seniorLevelSalary,
        },
        programDuration: careerData.programDuration,
        skillsRequired: careerData.skillsRequired || [],
        careerPath: {
          entryLevel: {
            roles: careerData.entryLevelRoles || [],
            experience: careerData.entryLevelExperience || '',
            description: careerData.entryLevelDescription || '',
          },
          midLevel: {
            roles: careerData.midLevelRoles || [],
            experience: careerData.midLevelExperience || '',
            description: careerData.midLevelDescription || '',
          },
          seniorLevel: {
            roles: careerData.seniorLevelRoles || [],
            experience: careerData.seniorLevelExperience || '',
            description: careerData.seniorLevelDescription || '',
          },
          executiveLevel: {
            roles: careerData.executiveLevelRoles || [],
            experience: careerData.executiveLevelExperience || '',
            description: careerData.executiveLevelDescription || '',
          },
        },
        certifications: careerData.certifications || [],
        industryTrends: careerData.industryTrends || [],
        featured: careerData.featured || false,
        image: careerData.image, // Now this will be a Cloudinary URL
      };

      return api.post('/careers', transformedData);
    },
    onSuccess: () => {
      notification.success({
        message: 'Career Created',
        description: 'The career has been successfully created.',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setCareerModalVisible(false);
      form.resetFields();
      setImageUrl('');
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      notification.error({
        message: 'Creation Failed',
        description: error.response?.data?.message || 'Failed to create career',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Update career mutation
  const updateCareerMutation = useMutation({
    mutationFn: ({ id, careerData }) => {
      // Transform the data to match the backend model structure
      const transformedData = {
        title: careerData.title,
        category: careerData.category,
        description: careerData.description,
        keySubjects: careerData.keySubjects || [],
        requiredGrades: careerData.requiredGrades || {},
        minimumMeanGrade: careerData.minimumMeanGrade,
        marketDemand: careerData.marketDemand,
        jobProspects: careerData.jobProspects || [],
        salary: {
          entry: careerData.entryLevelSalary,
          mid: careerData.midLevelSalary,
          senior: careerData.seniorLevelSalary,
        },
        programDuration: careerData.programDuration,
        skillsRequired: careerData.skillsRequired || [],
        careerPath: {
          entryLevel: {
            roles: careerData.entryLevelRoles || [],
            experience: careerData.entryLevelExperience || '',
            description: careerData.entryLevelDescription || '',
          },
          midLevel: {
            roles: careerData.midLevelRoles || [],
            experience: careerData.midLevelExperience || '',
            description: careerData.midLevelDescription || '',
          },
          seniorLevel: {
            roles: careerData.seniorLevelRoles || [],
            experience: careerData.seniorLevelExperience || '',
            description: careerData.seniorLevelDescription || '',
          },
          executiveLevel: {
            roles: careerData.executiveLevelRoles || [],
            experience: careerData.executiveLevelExperience || '',
            description: careerData.executiveLevelDescription || '',
          },
        },
        certifications: careerData.certifications || [],
        industryTrends: careerData.industryTrends || [],
        featured: careerData.featured || false,
        image: careerData.image, // Now this will be a Cloudinary URL
      };

      return api.put(`/careers/${id}`, transformedData);
    },
    onSuccess: () => {
      notification.success({
        message: 'Career Updated',
        description: 'The career has been successfully updated.',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setCareerModalVisible(false);
      form.resetFields();
      setImageUrl('');
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      notification.error({
        message: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update career',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Delete career mutation
  const deleteCareerMutation = useMutation({
    mutationFn: (careerId) => api.delete(`/careers/${careerId}`),
    onSuccess: () => {
      notification.success({
        message: 'Career Deleted',
        description: 'The career has been successfully deleted.',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      notification.error({
        message: 'Deletion Failed',
        description: error.response?.data?.message || 'Failed to delete career',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Bulk delete careers mutation
  const bulkDeleteCareersMutation = useMutation({
    mutationFn: (careerIds) => api.post('/careers/bulk-delete', { careerIds }),
    onSuccess: () => {
      notification.success({
        message: 'Careers Deleted',
        description: `${selectedRowKeys.length} careers have been successfully deleted.`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setSelectedRowKeys([]);
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      notification.error({
        message: 'Bulk Deletion Failed',
        description:
          error.response?.data?.message || 'Failed to delete careers',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Bulk update featured status mutation
  const bulkUpdateFeaturedMutation = useMutation({
    mutationFn: ({ careerIds, featured }) =>
      api.post('/careers/bulk-update-featured', { careerIds, featured }),
    onSuccess: (_, variables) => {
      notification.success({
        message: 'Careers Updated',
        description: `${selectedRowKeys.length} careers have been ${
          variables.featured ? 'featured' : 'unfeatured'
        }.`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setSelectedRowKeys([]);
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      notification.error({
        message: 'Bulk Update Failed',
        description:
          error.response?.data?.message || 'Failed to update careers',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
  });

  // Import careers mutation
  const importCareersMutation = useMutation({
    mutationFn: (careersData) =>
      api.post('/careers/import', { careers: careersData }),
    onSuccess: (response) => {
      const { success, failed } = response.data.data; // Access data.data as per backend response
      notification.success({
        message: 'Import Successful',
        description: `Successfully imported ${success} careers. ${
          failed > 0 ? `Failed to import ${failed} careers.` : ''
        }`,
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setImportModalVisible(false);
      setImportFile(null);
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      notification.error({
        message: 'Import Failed',
        description:
          error.response?.data?.message || 'Failed to import careers',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
    onSettled: () => {
      setImportLoading(false);
    },
  });

  // Duplicate career mutation
  const duplicateCareerMutation = useMutation({
    mutationFn: ({ careerId, newTitle }) =>
      api.post(`/careers/${careerId}/duplicate`, { newTitle }),
    onSuccess: () => {
      notification.success({
        message: 'Career Duplicated',
        description: 'The career has been successfully duplicated.',
        icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      });
      setDuplicateModalVisible(false);
      setCareerToDuplicate(null);
      queryClient.invalidateQueries(['admin-careers']);
    },
    onError: (error) => {
      notification.error({
        message: 'Duplication Failed',
        description:
          error.response?.data?.message || 'Failed to duplicate career',
        icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      });
    },
    onSettled: () => {
      setDuplicateModalVisible(false);
      setCareerToDuplicate(null);
    },
  });

  // Enhanced delete confirmation with more details and warnings
  const showDeleteConfirm = (career) => {
    setCareerToDelete(career);
    setDeleteModalVisible(true);
  };

  const handleAddCareer = () => {
    setEditMode(false);
    setCurrentCareer(null);
    form.resetFields();
    setImageUrl('');
    setCareerModalVisible(true);
    setActiveTabKey('1');
  };

  const handleEditCareer = (career) => {
    setEditMode(true);
    setCurrentCareer(career);
    setImageUrl(career.image || '');
    setActiveTabKey('1');

    // Format the data for the form
    form.setFieldsValue({
      title: career.title,
      category: career.category,
      description: career.description,
      keySubjects: career.keySubjects || [],
      minimumMeanGrade: career.minimumMeanGrade,
      marketDemand: career.marketDemand,
      jobProspects: career.jobProspects || [],
      salary: {
        entry: career.salary?.entry,
        mid: career.salary?.mid,
        senior: career.salary?.senior,
      },
      programDuration: career.programDuration,
      skillsRequired: career.skillsRequired || [],
      entryLevelRoles: career.careerPath?.entryLevel?.roles || [],
      entryLevelExperience: career.careerPath?.entryLevel?.experience,
      entryLevelDescription: career.careerPath?.entryLevel?.description,
      midLevelRoles: career.careerPath?.midLevel?.roles || [],
      midLevelExperience: career.careerPath?.midLevel?.experience,
      midLevelDescription: career.careerPath?.midLevel?.description,
      seniorLevelRoles: career.careerPath?.seniorLevel?.roles || [],
      seniorLevelExperience: career.careerPath?.seniorLevel?.experience,
      seniorLevelDescription: career.careerPath?.seniorLevel?.description,
      executiveLevelRoles: career.careerPath?.executiveLevel?.roles || [],
      executiveLevelExperience: career.careerPath?.executiveLevel?.experience,
      executiveLevelDescription: career.careerPath?.executiveLevel?.description,
      industryTrends: career.industryTrends || [],
      featured: career.featured || false,
      image: career.image, // Now this will be a Cloudinary URL
    });

    setCareerModalVisible(true);
  };

  const handleFormSubmit = (values) => {
    if (editMode) {
      updateCareerMutation.mutate({
        id: currentCareer._id,
        careerData: values,
      });
    } else {
      createCareerMutation.mutate(values);
    }
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  const validateForm = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      const firstErrorField = error.errorFields[0]?.name[0];

      // Map field names to tab keys
      const fieldToTabMap = {
        title: '1',
        category: '1',
        description: '1',
        programDuration: '1',
        featured: '1',
        minimumMeanGrade: '2',
        keySubjects: '2',
        marketDemand: '3',
        jobProspects: '3',
        entryLevelSalary: '3',
        midLevelSalary: '3',
        seniorLevelSalary: '3',
        skillsRequired: '4',
        image: '5',
      };

      // Switch to the tab containing the first error
      if (firstErrorField && fieldToTabMap[firstErrorField]) {
        setActiveTabKey(fieldToTabMap[firstErrorField]);
      }

      return false;
    }
  };

  const handleNextTab = async () => {
    const isValid = await validateForm();
    if (isValid) {
      const nextTab = String(Number(activeTabKey) + 1);
      if (Number(nextTab) <= 5) {
        setActiveTabKey(nextTab);
      }
    }
  };

  const handlePrevTab = () => {
    const prevTab = String(Number(activeTabKey) - 1);
    if (Number(prevTab) >= 1) {
      setActiveTabKey(prevTab);
    }
  };

  // View career details
  const handleViewCareerDetails = (career) => {
    setCurrentCareer(career);
    setCareerDetailDrawer(true);
    setCareerDetailTabs('overview');
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    setBulkActionMenuVisible(false);

    switch (action) {
      case 'delete':
        Modal.confirm({
          title: `Delete ${selectedRowKeys.length} Careers`,
          content:
            'Are you sure you want to delete these careers? This action cannot be undone.',
          okText: 'Yes, Delete All',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            bulkDeleteCareersMutation.mutate(selectedRowKeys);
          },
        });
        break;
      case 'feature':
        bulkUpdateFeaturedMutation.mutate({
          careerIds: selectedRowKeys,
          featured: true,
        });
        break;
      case 'unfeature':
        bulkUpdateFeaturedMutation.mutate({
          careerIds: selectedRowKeys,
          featured: false,
        });
        break;
      case 'compare': {
        // Added block scope here to fix the error
        const selectedCareers = careers.filter((career) =>
          selectedRowKeys.includes(career._id)
        );
        if (selectedCareers.length > 1 && selectedCareers.length <= 3) {
          setCareersToCompare(selectedCareers);
          setCompareDrawerVisible(true);
        } else {
          notification.warning({
            message: 'Compare Limit',
            description: 'Please select 2 or 3 careers to compare.',
          });
        }
        break;
      }
      default:
        break;
    }
  };

  // Handle duplicate career
  const handleDuplicateCareer = (career) => {
    setCareerToDuplicate(career);
    setDuplicateModalVisible(true);
  };

  // Handle confirm duplicate
  const handleConfirmDuplicate = (values) => {
    if (careerToDuplicate) {
      duplicateCareerMutation.mutate({
        careerId: careerToDuplicate._id,
        newTitle: values.newTitle,
      });
    }
  };

  // Handle import file change
  const handleImportFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImportFile(file);
    }
  };

  // Handle import careers
  const handleImportCareers = () => {
    if (!importFile) {
      notification.warning({
        message: 'No File Selected',
        description: 'Please select a file to import.',
      });
      return;
    }

    setImportLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Process the data to match the expected format
        const processedData = jsonData.map((row) => ({
          title: row.Title,
          category: row.Category,
          description: row.Description,
          keySubjects: row.KeySubjects
            ? row.KeySubjects.split(',').map((s) => s.trim())
            : [],
          minimumMeanGrade: row.MinimumMeanGrade,
          marketDemand: row.MarketDemand,
          jobProspects: row.JobProspects
            ? row.JobProspects.split(',').map((s) => s.trim())
            : [],
          salary: {
            entry: row.EntryLevelSalary,
            mid: row.MidLevelSalary,
            senior: row.SeniorLevelSalary,
          },
          programDuration: row.ProgramDuration,
          skillsRequired: row.SkillsRequired
            ? row.SkillsRequired.split(',').map((s) => s.trim())
            : [],
          featured: row.Featured === 'Yes' || row.Featured === true,
          image: row.ImageURL,
        }));

        importCareersMutation.mutate(processedData);
      } catch (error) {
        notification.error({
          message: 'Import Error',
          description:
            'Failed to parse import file. Please check the file format.',
        });
        setImportLoading(false);
      }
    };

    reader.readAsArrayBuffer(importFile);
  };

  // Handle export careers
  const handleExportCareers = async (format) => {
    try {
      setExportLoading(true);

      // Prepare data for export
      const exportData = careers.map((career) => ({
        Title: career.title,
        Category: career.category,
        Description: career.description,
        KeySubjects: (career.keySubjects || []).join(', '),
        MinimumMeanGrade: career.minimumMeanGrade,
        MarketDemand: career.marketDemand,
        JobProspects: (career.jobProspects || []).join(', '),
        EntryLevelSalary: career.salary?.entry || '',
        MidLevelSalary: career.salary?.mid || '',
        SeniorLevelSalary: career.salary?.senior || '',
        ProgramDuration: career.programDuration,
        SkillsRequired: (career.skillsRequired || []).join(', '),
        Featured: career.featured ? 'Yes' : 'No',
        ImageURL: career.image || '',
        Views: career.views || 0,
        Saves: career.saves || 0,
      }));

      if (format === 'csv') {
        // CSV export is handled by CSVLink component
        setTimeout(() => {
          csvLinkRef.current.link.click();
          setExportLoading(false);
        }, 500);
      } else if (format === 'excel') {
        // Excel export
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Careers');
        XLSX.writeFile(workbook, 'careers_export.xlsx');
        setExportLoading(false);
      } else if (format === 'pdf') {
        // PDF export
        const doc = new jsPDF('landscape');
        doc.autoTable({
          head: [
            [
              'Title',
              'Category',
              'Market Demand',
              'Min. Grade',
              'Entry Salary',
              'Featured',
            ],
          ],
          body: exportData.map((career) => [
            career.Title,
            career.Category,
            career.MarketDemand,
            career.MinimumMeanGrade,
            career.EntryLevelSalary,
            career.Featured,
          ]),
        });
        doc.save('careers_export.pdf');
        setExportLoading(false);
      }
    } catch (error) {
      notification.error({
        message: 'Export Failed',
        description: 'Failed to export careers. Please try again.',
      });
      setExportLoading(false);
    }
  };

  // Generate batch template
  const generateBatchTemplate = () => {
    const template = [
      {
        Title: 'Software Engineer',
        Category: 'Technology',
        Description: 'Career description here',
        KeySubjects: 'Mathematics, Computer Science',
        MinimumMeanGrade: 'B',
        MarketDemand: 'High',
        JobProspects: 'Tech Companies, Startups',
        EntryLevelSalary: '50000',
        MidLevelSalary: '80000',
        SeniorLevelSalary: '120000',
        ProgramDuration: '4 years',
        SkillsRequired: 'Programming, Problem Solving',
        Featured: 'Yes',
        ImageURL: 'https://example.com/image.jpg',
      },
    ];

    setBatchTemplate(template);

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    XLSX.writeFile(workbook, 'career_import_template.xlsx');
  };

  // Since we're now doing server-side filtering and sorting,
  // we can directly use the careers data from the API response
  const getSortedCareers = () => {
    return careers || [];
  };

  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortOrder('ascend');
    }
    // Reset to first page when sorting changes
    setCurrentPage(1);
  };

  // Handle pagination changes
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    if (size !== pageSize) {
      setPageSize(size);
    }
  };

  // Handle search changes
  const handleSearchChange = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;

    return sortOrder === 'ascend' ? (
      <SortAscendingOutlined className="ml-1 text-blue-500" />
    ) : (
      <SortDescendingOutlined className="ml-1 text-blue-500" />
    );
  };

  const handleDeleteClick = (career) => {
    setCareerToDelete(career);
    setDeleteModalVisible(true);
  };

  // Add this function to handle confirmation
  const handleDeleteConfirm = () => {
    if (careerToDelete) {
      deleteCareerMutation.mutate(careerToDelete._id);
      setDeleteModalVisible(false);
      setCareerToDelete(null);
    }
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const columns = [
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('title')}
        >
          Title {renderSortIcon('title')}
        </div>
      ),
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div className="flex items-center">
          {record.image ? (
            <div
              className="mr-3 cursor-pointer"
              onClick={() => handlePreview(record.image)}
            >
              <img
                src={record.image || null}
                alt={text}
                className="w-12 h-12 object-cover rounded-md border border-gray-200"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
              <InfoCircleOutlined
                style={{ color: '#bfbfbf', fontSize: '20px' }}
              />
            </div>
          )}
          <div>
            <div className="font-medium text-blue-600">{text}</div>
            <div className="text-xs text-gray-500 mt-1">
              <Tag color="default">{record.category}</Tag>
            </div>
          </div>
          {record.featured && (
            <Badge
              count={<StarFilled style={{ color: '#faad14' }} />}
              offset={[5, 5]}
            />
          )}
        </div>
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('salary')}
        >
          Salary Range {renderSortIcon('salary')}
        </div>
      ),
      key: 'salary',
      render: (_, record) => (
        <div>
          <div className="text-green-600 font-medium">
            {record.salary?.entry}
          </div>
          <div className="text-xs text-gray-500">
            to {record.salary?.senior}
          </div>
        </div>
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('marketDemand')}
        >
          Market Demand {renderSortIcon('marketDemand')}
        </div>
      ),
      dataIndex: 'marketDemand',
      key: 'marketDemand',
      render: (demand) => {
        let color = 'green';
        if (demand === 'Low') color = 'red';
        else if (demand === 'Medium') color = 'orange';
        else if (demand === 'High') color = 'blue';
        else if (demand === 'Very High') color = 'purple';

        return (
          <Tag color={color} className="px-3 py-1 text-center">
            {demand}
          </Tag>
        );
      },
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('minimumMeanGrade')}
        >
          Min. Grade {renderSortIcon('minimumMeanGrade')}
        </div>
      ),
      dataIndex: 'minimumMeanGrade',
      key: 'minimumMeanGrade',
      render: (grade) => (
        <Badge
          count={grade}
          style={{
            backgroundColor:
              grade === 'A'
                ? '#52c41a'
                : grade.startsWith('B')
                ? '#1890ff'
                : grade.startsWith('C')
                ? '#faad14'
                : '#f5222d',
          }}
        />
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('views')}
        >
          Views {renderSortIcon('views')}
        </div>
      ),
      dataIndex: 'views',
      key: 'views',
      render: (views) => (
        <div className="flex items-center">
          <EyeOutlined className="mr-1 text-gray-500" />
          <span>{views || 0}</span>
        </div>
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('saves')}
        >
          Saves {renderSortIcon('saves')}
        </div>
      ),
      dataIndex: 'saves',
      key: 'saves',
      render: (saves) => (
        <div className="flex items-center">
          <HeartOutlined className="mr-1 text-red-500" />
          <span>{saves || 0}</span>
        </div>
      ),
    },
    {
      title: (
        <div
          className="cursor-pointer flex items-center"
          onClick={() => handleSort('featured')}
        >
          Status {renderSortIcon('featured')}
        </div>
      ),
      dataIndex: 'featured',
      key: 'featured',
      render: (featured) =>
        featured ? (
          <Tag color="gold" icon={<StarFilled />} className="px-2 py-1">
            FEATURED
          </Tag>
        ) : (
          <Tag color="default" className="px-2 py-1">
            STANDARD
          </Tag>
        ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              key="view-details"
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => handleViewCareerDetails(record)}
              size="small"
              aria-label={`View details for ${record.title}`}
            />
          </Tooltip>

          <Tooltip title="Edit Career">
            <Button
              key="edit-career"
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEditCareer(record)}
              size="small"
              aria-label={`Edit ${record.title}`}
            />
          </Tooltip>

          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="duplicate"
                  icon={<CopyOutlined />}
                  onClick={() => handleDuplicateCareer(record)}
                >
                  Duplicate
                </Menu.Item>
                <Menu.Item
                  key="feature"
                  icon={record.featured ? <StarFilled /> : <StarFilled />}
                  onClick={() => {
                    updateCareerMutation.mutate({
                      id: record._id,
                      careerData: { ...record, featured: !record.featured },
                    });
                  }}
                >
                  {record.featured ? 'Unfeature' : 'Feature'}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="delete"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(record)}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button icon={<EllipsisOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Card view rendering
  const renderCareerCard = (career) => (
    <Col xs={24} sm={12} md={8} lg={6} key={career._id}>
      <Card
        hoverable
        cover={
          career.image ? (
            <img
              alt={career.title}
              src={career.image || '/placeholder.svg'}
              className="h-48 object-cover"
              onClick={() => handlePreview(career.image)}
            />
          ) : (
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              <InfoCircleOutlined style={{ fontSize: 40, color: '#d9d9d9' }} />
            </div>
          )
        }
        actions={[
          <Tooltip title="View Details" key="view-details">
            <EyeOutlined
              key="view"
              onClick={() => handleViewCareerDetails(career)}
            />
          </Tooltip>,
          <Tooltip title="Edit" key="edit-career">
            <EditOutlined key="edit" onClick={() => handleEditCareer(career)} />
          </Tooltip>,
          <Dropdown
            key="more"
            overlay={
              <Menu>
                <Menu.Item
                  key="duplicate"
                  icon={<CopyOutlined />}
                  onClick={() => handleDuplicateCareer(career)}
                >
                  Duplicate
                </Menu.Item>
                <Menu.Item
                  key="feature"
                  icon={career.featured ? <StarFilled /> : <StarFilled />}
                  onClick={() => {
                    updateCareerMutation.mutate({
                      id: career._id,
                      careerData: { ...career, featured: !career.featured },
                    });
                  }}
                >
                  {career.featured ? 'Unfeature' : 'Feature'}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  key="delete"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(career)}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <EllipsisOutlined />
          </Dropdown>,
        ]}
        className="career-card"
        extra={career.featured && <StarFilled style={{ color: '#faad14' }} />}
      >
        <div className="mb-2">
          <div className="font-medium text-lg mb-1 truncate">
            {career.title}
          </div>
          <Tag color="default">{career.category}</Tag>
        </div>

        <div className="flex justify-between items-center mb-2">
          <div>
            <Text type="secondary">Demand:</Text>
            <Tag
              color={
                career.marketDemand === 'Low'
                  ? 'red'
                  : career.marketDemand === 'Medium'
                  ? 'orange'
                  : career.marketDemand === 'High'
                  ? 'blue'
                  : 'purple'
              }
              className="ml-1"
            >
              {career.marketDemand}
            </Tag>
          </div>
          <div>
            <Text type="secondary">Grade:</Text>
            <Badge
              count={career.minimumMeanGrade}
              className="ml-1"
              style={{
                backgroundColor:
                  career.minimumMeanGrade === 'A'
                    ? '#52c41a'
                    : career.minimumMeanGrade.startsWith('B')
                    ? '#1890ff'
                    : career.minimumMeanGrade.startsWith('C')
                    ? '#faad14'
                    : '#f5222d',
              }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-green-600">{career.salary?.entry}</div>
          <div className="flex items-center">
            <Tooltip title="Views">
              <div className="flex items-center mr-2">
                <EyeOutlined className="mr-1 text-gray-500" />
                <span>{career.views || 0}</span>
              </div>
            </Tooltip>
            <Tooltip title="Saves">
              <div className="flex items-center">
                <HeartOutlined className="mr-1 text-red-500" />
                <span>{career.saves || 0}</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </Card>
    </Col>
  );

  // Filter panel component
  const FilterPanel = () => (
    <Card className="mb-4">
      <Tabs defaultActiveKey="basic">
        <TabPane tab="Basic Filters" key="basic">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text strong>Category</Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="Filter by category"
                value={filters.category}
                onChange={(values) =>
                  handleFilterChange({ ...filters, category: values })
                }
                maxTagCount={2}
              >
                {Array.from(new Set(careers?.map((c) => c.category) || [])).map(
                  (category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  )
                )}
              </Select>
            </div>

            <div>
              <Text strong>Market Demand</Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="Filter by demand"
                value={filters.marketDemand}
                onChange={(values) =>
                  handleFilterChange({ ...filters, marketDemand: values })
                }
                maxTagCount={2}
              >
                {['Very High', 'High', 'Medium', 'Low'].map((demand) => (
                  <Option key={demand} value={demand}>
                    {demand}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Text strong>Minimum Grade</Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="Filter by grade"
                value={filters.minimumMeanGrade}
                onChange={(values) =>
                  handleFilterChange({ ...filters, minimumMeanGrade: values })
                }
                maxTagCount={2}
              >
                {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D'].map(
                  (grade) => (
                    <Option key={grade} value={grade}>
                      {grade}
                    </Option>
                  )
                )}
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Text strong>Status</Text>
            <div className="mt-2">
              <Radio.Group
                value={filters.featured}
                onChange={(e) =>
                  handleFilterChange({ ...filters, featured: e.target.value })
                }
                buttonStyle="solid"
              >
                <Radio.Button value={null}>All</Radio.Button>
                <Radio.Button value={true}>Featured</Radio.Button>
                <Radio.Button value={false}>Standard</Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </TabPane>

        <TabPane tab="Advanced Filters" key="advanced">
          <div className="mb-4">
            <Checkbox
              checked={advancedSearch}
              onChange={(e) => setAdvancedSearch(e.target.checked)}
            >
              Enable Advanced Filters
            </Checkbox>
          </div>

          <div
            className={`space-y-4 ${
              !advancedSearch && 'opacity-50 pointer-events-none'
            }`}
          >
            <div>
              <Text strong>Salary Range</Text>
              <div className="mt-2">
                <Slider
                  range
                  min={0}
                  max={200000}
                  step={5000}
                  value={advancedFilters.salaryRange}
                  onChange={(value) =>
                    setAdvancedFilters({
                      ...advancedFilters,
                      salaryRange: value,
                    })
                  }
                  tipFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$200,000</span>
                </div>
              </div>
            </div>

            <div>
              <Text strong>Skills</Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="Filter by skills"
                value={advancedFilters.skills}
                onChange={(values) =>
                  setAdvancedFilters({ ...advancedFilters, skills: values })
                }
              >
                {Array.from(
                  new Set(careers?.flatMap((c) => c.skillsRequired || []) || [])
                ).map((skill) => (
                  <Option key={skill} value={skill}>
                    {skill}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Text strong>Key Subjects</Text>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%', marginTop: '8px' }}
                placeholder="Filter by subjects"
                value={advancedFilters.subjects}
                onChange={(values) =>
                  setAdvancedFilters({ ...advancedFilters, subjects: values })
                }
              >
                {Array.from(
                  new Set(careers?.flatMap((c) => c.keySubjects || []) || [])
                ).map((subject) => (
                  <Option key={subject} value={subject}>
                    {subject}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </TabPane>
      </Tabs>

      <div className="flex justify-end mt-4">
        <Button
          onClick={() => {
            handleFilterChange({
              category: [],
              marketDemand: [],
              featured: null,
              minimumMeanGrade: [],
              salary: null,
            });
            setAdvancedFilters({
              salaryRange: [0, 1000000],
              experienceLevel: [],
              skills: [],
              subjects: [],
            });
            setAdvancedSearch(false);
          }}
          className="mr-2"
        >
          Reset All Filters
        </Button>
        <Button type="primary" onClick={() => setFilterVisible(false)}>
          Apply Filters
        </Button>
      </div>
    </Card>
  );

  // Form tabs for better organization
  const formTabs = [
    {
      key: '1',
      tab: 'Basic Information',
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="title"
              label="Career Title"
              rules={[{ required: true, message: 'Please enter career title' }]}
            >
              <Input placeholder="e.g. Software Engineer" />
            </Form.Item>

            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select placeholder="Select category">
                <Option value="Technology">Technology</Option>
                <Option value="Engineering">Engineering</Option>
                <Option value="Healthcare">Healthcare</Option>
                <Option value="Business">Business</Option>
                <Option value="Finance">Finance</Option>
                <Option value="Education">Education</Option>
                <Option value="Arts">Arts</Option>
                <Option value="Science">Science</Option>
                <Option value="Legal">Legal</Option>
                <Option value="Social Sciences">Social Sciences</Option>
                <Option value="Agriculture">Agriculture</Option>
                <Option value="Hospitality">Hospitality</Option>
                <Option value="Media">Media</Option>
                <Option value="Construction">Construction</Option>
                <Option value="Manufacturing">Manufacturing</Option>
                <Option value="Transportation">Transportation</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <Input.TextArea
              rows={6}
              placeholder="Describe the career in detail..."
            />
          </Form.Item>

          <Form.Item
            name="programDuration"
            label="Program Duration"
            rules={[
              { required: true, message: 'Please enter program duration' },
            ]}
          >
            <Input placeholder="e.g. 4 years" />
          </Form.Item>

          <Form.Item
            name="featured"
            valuePropName="checked"
            label="Featured Career"
            extra="Featured careers will be highlighted and shown at the top of recommendations"
          >
            <Switch />
          </Form.Item>
        </>
      ),
    },
    {
      key: '2',
      tab: 'Education Requirements',
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="minimumMeanGrade"
              label="Minimum Mean Grade"
              rules={[
                { required: true, message: 'Please select minimum grade' },
              ]}
            >
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
                <Option value="D-">D-</Option>
                <Option value="E">E</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="keySubjects"
              label="Key Subjects"
              rules={[{ required: true, message: 'Please add key subjects' }]}
              extra="Press Enter after each subject"
            >
              <Select
                mode="tags"
                placeholder="Add subjects"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <Alert
            message="Education Requirements"
            description="Specify the minimum academic qualifications needed for this career path. These requirements will be used to match students with appropriate career options based on their academic performance."
            type="info"
            showIcon
            className="mb-4"
          />

          <Collapse defaultActiveKey={[]}>
            <Panel header="Subject Grade Requirements (Optional)" key="1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name={['requiredGrades', 'mathematics']}
                  label="Mathematics"
                >
                  <Select placeholder="Select grade">
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="C">C</Option>
                    <Option value="D">D</Option>
                    <Option value="E">E</Option>
                  </Select>
                </Form.Item>

                <Form.Item name={['requiredGrades', 'english']} label="English">
                  <Select placeholder="Select grade">
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="C">C</Option>
                    <Option value="D">D</Option>
                    <Option value="E">E</Option>
                  </Select>
                </Form.Item>

                <Form.Item name={['requiredGrades', 'science']} label="Science">
                  <Select placeholder="Select grade">
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="C">C</Option>
                    <Option value="D">D</Option>
                    <Option value="E">E</Option>
                  </Select>
                </Form.Item>
              </div>
            </Panel>
          </Collapse>
        </>
      ),
    },
    {
      key: '3',
      tab: 'Market Information',
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="marketDemand"
              label="Market Demand"
              rules={[
                { required: true, message: 'Please select market demand' },
              ]}
            >
              <Select placeholder="Select market demand">
                <Option value="Very High">Very High</Option>
                <Option value="High">High</Option>
                <Option value="Medium">Medium</Option>
                <Option value="Low">Low</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="jobProspects"
              label="Job Prospects"
              rules={[{ required: true, message: 'Please add job prospects' }]}
              extra="Press Enter after each job prospect"
            >
              <Select
                mode="tags"
                placeholder="Add job prospects"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="entryLevelSalary"
              label="Entry Level Salary"
              rules={[
                {
                  required: true,
                  message: 'Please enter entry level salary',
                },
              ]}
            >
              <Input placeholder="e.g. $50,000 - $60,000" />
            </Form.Item>

            <Form.Item
              name="midLevelSalary"
              label="Mid-Career Salary"
              rules={[
                {
                  required: true,
                  message: 'Please enter mid-career salary',
                },
              ]}
            >
              <Input placeholder="e.g. $70,000 - $90,000" />
            </Form.Item>

            <Form.Item
              name="seniorLevelSalary"
              label="Senior Level Salary"
              rules={[
                {
                  required: true,
                  message: 'Please enter senior level salary',
                },
              ]}
            >
              <Input placeholder="e.g. $100,000 - $130,000" />
            </Form.Item>
          </div>

          <Form.Item
            name="industryTrends"
            label="Industry Trends"
            extra="Press Enter after each trend"
          >
            <Select
              mode="tags"
              placeholder="Add industry trends"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Alert
            message="Market Information Tips"
            description="Provide accurate and up-to-date salary information to help students make informed decisions. Industry trends help students understand the future outlook of this career path."
            type="info"
            showIcon
          />
        </>
      ),
    },
    {
      key: '4',
      tab: 'Skills & Career Path',
      content: (
        <>
          <Form.Item
            name="skillsRequired"
            label="Skills Required"
            rules={[{ required: true, message: 'Please add required skills' }]}
            extra="Press Enter after each skill"
          >
            <Select
              mode="tags"
              placeholder="Add skills"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Divider orientation="left">Entry Level</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="entryLevelRoles"
              label="Entry Level Roles"
              extra="Press Enter after each role"
            >
              <Select
                mode="tags"
                placeholder="Add roles"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="entryLevelExperience" label="Required Experience">
              <Input placeholder="e.g. 0-2 years" />
            </Form.Item>
          </div>
          <Form.Item name="entryLevelDescription" label="Description">
            <TextArea
              rows={2}
              placeholder="Describe entry level positions..."
            />
          </Form.Item>

          <Divider orientation="left">Mid Level</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="midLevelRoles"
              label="Mid Level Roles"
              extra="Press Enter after each role"
            >
              <Select
                mode="tags"
                placeholder="Add roles"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="midLevelExperience" label="Required Experience">
              <Input placeholder="e.g. 3-5 years" />
            </Form.Item>
          </div>
          <Form.Item name="midLevelDescription" label="Description">
            <TextArea rows={2} placeholder="Describe mid level positions..." />
          </Form.Item>

          <Divider orientation="left">Senior Level</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="seniorLevelRoles"
              label="Senior Level Roles"
              extra="Press Enter after each role"
            >
              <Select
                mode="tags"
                placeholder="Add roles"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item name="seniorLevelExperience" label="Required Experience">
              <Input placeholder="e.g. 6-10 years" />
            </Form.Item>
          </div>
          <Form.Item name="seniorLevelDescription" label="Description">
            <TextArea
              rows={2}
              placeholder="Describe senior level positions..."
            />
          </Form.Item>

          <Divider orientation="left">Executive Level</Divider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="executiveLevelRoles"
              label="Executive Level Roles"
              extra="Press Enter after each role"
            >
              <Select
                mode="tags"
                placeholder="Add roles"
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              name="executiveLevelExperience"
              label="Required Experience"
            >
              <Input placeholder="e.g. 10+ years" />
            </Form.Item>
          </div>
          <Form.Item name="executiveLevelDescription" label="Description">
            <TextArea
              rows={2}
              placeholder="Describe executive level positions..."
            />
          </Form.Item>
        </>
      ),
    },
    {
      key: '5',
      tab: 'Media',
      content: (
        <>
          <Form.Item name="image" label="Career Image" className="mb-2">
            <Input hidden />
            {imageUrl && (
              <div className="mb-3">
                <img
                  src={imageUrl || null}
                  alt="Career"
                  className="w-40 h-40 object-cover rounded border"
                />
              </div>
            )}
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'career-recommender',
                multiple: false,
                maxImageFileSize: 2000000,
                folder: 'cms/careers',
              }}
              onUploadSuccess={handleImageUpload}
              setLoading={setLoading}
              buttonText="Upload Image"
            />
            {loading && <div className="mt-2">Uploading image...</div>}
          </Form.Item>
          <Alert
            message="Image Guidelines"
            description={
              <ul className="list-disc pl-5 mt-2">
                <li>Use high-quality images that represent the career field</li>
                <li>Recommended size: 800x600 pixels or larger</li>
                <li>Maximum file size: 2MB</li>
                <li>Supported formats: JPG, PNG, GIF</li>
              </ul>
            }
            type="info"
            showIcon
          />
        </>
      ),
    },
  ];

  // Career detail tabs
  const renderCareerDetailContent = () => {
    if (!currentCareer) return null;

    switch (careerDetailTabs) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {currentCareer.image ? (
                  <img
                    src={currentCareer.image || '/placeholder.svg'}
                    alt={currentCareer.title}
                    className="w-full rounded-lg shadow-md object-cover"
                    style={{ maxHeight: '300px' }}
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <InfoCircleOutlined
                      style={{ fontSize: 40, color: '#d9d9d9' }}
                    />
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <Text type="secondary">Category:</Text>
                    <Tag color="default">{currentCareer.category}</Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text type="secondary">Market Demand:</Text>
                    <Tag
                      color={
                        currentCareer.marketDemand === 'Low'
                          ? 'red'
                          : currentCareer.marketDemand === 'Medium'
                          ? 'orange'
                          : currentCareer.marketDemand === 'High'
                          ? 'blue'
                          : 'purple'
                      }
                    >
                      {currentCareer.marketDemand}
                    </Tag>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text type="secondary">Min. Grade:</Text>
                    <Badge
                      count={currentCareer.minimumMeanGrade}
                      style={{
                        backgroundColor:
                          currentCareer.minimumMeanGrade === 'A'
                            ? '#52c41a'
                            : currentCareer.minimumMeanGrade.startsWith('B')
                            ? '#1890ff'
                            : currentCareer.minimumMeanGrade.startsWith('C')
                            ? '#faad14'
                            : '#f5222d',
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <Text type="secondary">Duration:</Text>
                    <Text>{currentCareer.programDuration}</Text>
                  </div>

                  <div className="flex justify-between items-center">
                    <Text type="secondary">Status:</Text>
                    {currentCareer.featured ? (
                      <Tag color="gold" icon={<StarFilled />}>
                        FEATURED
                      </Tag>
                    ) : (
                      <Tag color="default">STANDARD</Tag>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <Title level={4}>{currentCareer.title}</Title>
                <div className="mb-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: currentCareer.description,
                    }}
                  />
                </div>

                <Divider orientation="left">Key Information</Divider>

                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card size="small" title="Key Subjects">
                      {currentCareer.keySubjects &&
                      currentCareer.keySubjects.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {currentCareer.keySubjects.map((subject, index) => (
                            <Tag key={index} color="blue">
                              {subject}
                            </Tag>
                          ))}
                        </div>
                      ) : (
                        <Text type="secondary">No subjects specified</Text>
                      )}
                    </Card>
                  </Col>

                  <Col span={12}>
                    <Card size="small" title="Skills Required">
                      {currentCareer.skillsRequired &&
                      currentCareer.skillsRequired.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {currentCareer.skillsRequired.map((skill, index) => (
                            <Tag key={index} color="green">
                              {skill}
                            </Tag>
                          ))}
                        </div>
                      ) : (
                        <Text type="secondary">No skills specified</Text>
                      )}
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card size="small" title="Salary Range">
                      <div className="flex justify-between items-center">
                        <div>
                          <Text type="secondary">Entry Level:</Text>
                          <div className="text-lg font-medium text-green-600">
                            {currentCareer.salary?.entry || 'N/A'}
                          </div>
                        </div>

                        <div>
                          <Text type="secondary">Mid-Career:</Text>
                          <div className="text-lg font-medium text-green-600">
                            {currentCareer.salary?.mid || 'N/A'}
                          </div>
                        </div>

                        <div>
                          <Text type="secondary">Senior Level:</Text>
                          <div className="text-lg font-medium text-green-600">
                            {currentCareer.salary?.senior || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>

                <Divider orientation="left">Job Prospects</Divider>

                {currentCareer.jobProspects &&
                currentCareer.jobProspects.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentCareer.jobProspects.map((prospect, index) => (
                      <Tag
                        key={index}
                        color="purple"
                        icon={<EnvironmentOutlined />}
                      >
                        {prospect}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <Empty
                    description="No job prospects specified"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}

                <Divider orientation="left">Industry Trends</Divider>

                {currentCareer.industryTrends &&
                currentCareer.industryTrends.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {currentCareer.industryTrends.map((trend, index) => (
                      <Tag key={index} color="orange" icon={<RiseOutlined />}>
                        {trend}
                      </Tag>
                    ))}
                  </div>
                ) : (
                  <Empty
                    description="No industry trends specified"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  setCareerDetailDrawer(false);
                  handleEditCareer(currentCareer);
                }}
              >
                Edit Career
              </Button>
            </div>
          </div>
        );

      case 'career-path':
        return (
          <div className="space-y-6">
            <Alert
              message="Career Progression Path"
              description="This shows the typical career progression from entry level to executive positions."
              type="info"
              showIcon
              className="mb-4"
            />

            <Timeline mode="left">
              <Timeline.Item
                dot={<UserOutlined style={{ fontSize: '16px' }} />}
                color="blue"
                label="Entry Level"
              >
                <Card title="Entry Level Positions" className="mb-4">
                  <div className="mb-3">
                    <Text type="secondary">Required Experience:</Text>
                    <div>
                      {currentCareer.careerPath?.entryLevel?.experience ||
                        'No experience required'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <Text type="secondary">Typical Roles:</Text>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentCareer.careerPath?.entryLevel?.roles?.map(
                        (role, index) => <Tag key={index}>{role}</Tag>
                      ) || <Text type="secondary">No roles specified</Text>}
                    </div>
                  </div>

                  <div>
                    <Text type="secondary">Description:</Text>
                    <div>
                      {currentCareer.careerPath?.entryLevel?.description ||
                        'No description available'}
                    </div>
                  </div>
                </Card>
              </Timeline.Item>

              <Timeline.Item
                dot={<TeamOutlined style={{ fontSize: '16px' }} />}
                color="green"
                label="Mid Level"
              >
                <Card title="Mid-Level Positions" className="mb-4">
                  <div className="mb-3">
                    <Text type="secondary">Required Experience:</Text>
                    <div>
                      {currentCareer.careerPath?.midLevel?.experience ||
                        'Not specified'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <Text type="secondary">Typical Roles:</Text>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentCareer.careerPath?.midLevel?.roles?.map(
                        (role, index) => <Tag key={index}>{role}</Tag>
                      ) || <Text type="secondary">No roles specified</Text>}
                    </div>
                  </div>

                  <div>
                    <Text type="secondary">Description:</Text>
                    <div>
                      {currentCareer.careerPath?.midLevel?.description ||
                        'No description available'}
                    </div>
                  </div>
                </Card>
              </Timeline.Item>

              <Timeline.Item
                dot={<TrophyOutlined style={{ fontSize: '16px' }} />}
                color="orange"
                label="Senior Level"
              >
                <Card title="Senior-Level Positions" className="mb-4">
                  <div className="mb-3">
                    <Text type="secondary">Required Experience:</Text>
                    <div>
                      {currentCareer.careerPath?.seniorLevel?.experience ||
                        'Not specified'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <Text type="secondary">Typical Roles:</Text>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentCareer.careerPath?.seniorLevel?.roles?.map(
                        (role, index) => <Tag key={index}>{role}</Tag>
                      ) || <Text type="secondary">No roles specified</Text>}
                    </div>
                  </div>

                  <div>
                    <Text type="secondary">Description:</Text>
                    <div>
                      {currentCareer.careerPath?.seniorLevel?.description ||
                        'No description available'}
                    </div>
                  </div>
                </Card>
              </Timeline.Item>

              <Timeline.Item
                dot={<CrownOutlined style={{ fontSize: '16px' }} />}
                color="red"
                label="Executive Level"
              >
                <Card title="Executive-Level Positions">
                  <div className="mb-3">
                    <Text type="secondary">Required Experience:</Text>
                    <div>
                      {currentCareer.careerPath?.executiveLevel?.experience ||
                        'Not specified'}
                    </div>
                  </div>

                  <div className="mb-3">
                    <Text type="secondary">Typical Roles:</Text>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentCareer.careerPath?.executiveLevel?.roles?.map(
                        (role, index) => <Tag key={index}>{role}</Tag>
                      ) || <Text type="secondary">No roles specified</Text>}
                    </div>
                  </div>

                  <div>
                    <Text type="secondary">Description:</Text>
                    <div>
                      {currentCareer.careerPath?.executiveLevel?.description ||
                        'No description available'}
                    </div>
                  </div>
                </Card>
              </Timeline.Item>
            </Timeline>
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total Views"
                    value={currentCareer.views || 0}
                    prefix={<EyeOutlined />}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Total Saves"
                    value={currentCareer.saves || 0}
                    prefix={<HeartOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Popularity Rank"
                    value={
                      careers
                        ? careers
                            .sort((a, b) => (b.views || 0) - (a.views || 0))
                            .findIndex((c) => c._id === currentCareer._id) + 1
                        : 'N/A'
                    }
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="Engagement Metrics">
              <div className="h-64">
                <Bar
                  data={[
                    { type: 'Views', value: currentCareer.views || 0 },
                    { type: 'Saves', value: currentCareer.saves || 0 },
                  ]}
                  xField="type"
                  yField="value"
                  color={['#1890ff', '#ff4d4f']}
                  label={{
                    position: 'middle',
                    style: {
                      fill: '#FFFFFF',
                      opacity: 0.6,
                    },
                  }}
                />
              </div>
            </Card>

            <Card title="Comparison with Category Average">
              {careers ? (
                <div className="space-y-4">
                  {(() => {
                    // Calculate category averages
                    const sameCategoryCareers = careers.filter(
                      (c) => c.category === currentCareer.category
                    );

                    const avgViews =
                      sameCategoryCareers.reduce(
                        (sum, c) => sum + (c.views || 0),
                        0
                      ) / sameCategoryCareers.length;

                    const avgSaves =
                      sameCategoryCareers.reduce(
                        (sum, c) => sum + (c.saves || 0),
                        0
                      ) / sameCategoryCareers.length;

                    return (
                      <>
                        <div>
                          <Text>Views compared to category average:</Text>
                          <div className="flex items-center mt-1">
                            <Progress
                              percent={
                                avgViews
                                  ? Math.round(
                                      ((currentCareer.views || 0) / avgViews) *
                                        100
                                    )
                                  : 0
                              }
                              status={
                                (currentCareer.views || 0) >= avgViews
                                  ? 'success'
                                  : 'exception'
                              }
                            />
                            {(currentCareer.views || 0) >= avgViews ? (
                              <ArrowUpOutlined className="ml-2 text-green-500" />
                            ) : (
                              <ArrowDownOutlined className="ml-2 text-red-500" />
                            )}
                          </div>
                        </div>

                        <div>
                          <Text>Saves compared to category average:</Text>
                          <div className="flex items-center mt-1">
                            <Progress
                              percent={
                                avgSaves
                                  ? Math.round(
                                      ((currentCareer.saves || 0) / avgSaves) *
                                        100
                                    )
                                  : 0
                              }
                              status={
                                (currentCareer.saves || 0) >= avgSaves
                                  ? 'success'
                                  : 'exception'
                              }
                            />
                            {(currentCareer.saves || 0) >= avgSaves ? (
                              <ArrowUpOutlined className="ml-2 text-green-500" />
                            ) : (
                              <ArrowDownOutlined className="ml-2 text-red-500" />
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <Skeleton active />
              )}
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  // Career comparison content
  const renderComparisonContent = () => {
    if (!careersToCompare.length) return null;

    return (
      <div className="space-y-6">
        <Alert
          message="Career Comparison"
          description="Compare key attributes of selected careers side by side."
          type="info"
          showIcon
          className="mb-4"
        />

        <Table
          dataSource={[
            {
              key: 'title',
              attribute: 'Title',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = career.title;
                return acc;
              }, {}),
            },
            {
              key: 'category',
              attribute: 'Category',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = career.category;
                return acc;
              }, {}),
            },
            {
              key: 'marketDemand',
              attribute: 'Market Demand',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = (
                  <Tag
                    color={
                      career.marketDemand === 'Low'
                        ? 'red'
                        : career.marketDemand === 'Medium'
                        ? 'orange'
                        : career.marketDemand === 'High'
                        ? 'blue'
                        : 'purple'
                    }
                  >
                    {career.marketDemand}
                  </Tag>
                );
                return acc;
              }, {}),
            },
            {
              key: 'minimumGrade',
              attribute: 'Minimum Grade',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = (
                  <Badge
                    count={career.minimumMeanGrade}
                    style={{
                      backgroundColor:
                        career.minimumMeanGrade === 'A'
                          ? '#52c41a'
                          : career.minimumMeanGrade.startsWith('B')
                          ? '#1890ff'
                          : career.minimumMeanGrade.startsWith('C')
                          ? '#faad14'
                          : '#f5222d',
                    }}
                  />
                );
                return acc;
              }, {}),
            },
            {
              key: 'entrySalary',
              attribute: 'Entry Salary',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = (
                  <Text className="text-green-600 font-medium">
                    {career.salary?.entry || 'N/A'}
                  </Text>
                );
                return acc;
              }, {}),
            },
            {
              key: 'seniorSalary',
              attribute: 'Senior Salary',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = (
                  <Text className="text-green-600 font-medium">
                    {career.salary?.senior || 'N/A'}
                  </Text>
                );
                return acc;
              }, {}),
            },
            {
              key: 'duration',
              attribute: 'Program Duration',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = career.programDuration;
                return acc;
              }, {}),
            },
            {
              key: 'keySubjects',
              attribute: 'Key Subjects',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = (
                  <div className="flex flex-wrap gap-1">
                    {(career.keySubjects || []).map((subject, i) => (
                      <Tag key={i} color="blue">
                        {subject}
                      </Tag>
                    ))}
                  </div>
                );
                return acc;
              }, {}),
            },
            {
              key: 'skills',
              attribute: 'Skills Required',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = (
                  <div className="flex flex-wrap gap-1">
                    {(career.skillsRequired || []).map((skill, i) => (
                      <Tag key={i} color="green">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                );
                return acc;
              }, {}),
            },
            {
              key: 'featured',
              attribute: 'Featured Status',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = career.featured ? (
                  <Tag color="gold" icon={<StarFilled />}>
                    FEATURED
                  </Tag>
                ) : (
                  <Tag color="default">STANDARD</Tag>
                );
                return acc;
              }, {}),
            },
            {
              key: 'views',
              attribute: 'Total Views',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = (
                  <div className="flex items-center">
                    <EyeOutlined className="mr-1 text-gray-500" />
                    <span>{career.views || 0}</span>
                  </div>
                );
                return acc;
              }, {}),
            },
            {
              key: 'saves',
              attribute: 'Total Saves',
              ...careersToCompare.reduce((acc, career, index) => {
                acc[`career${index}`] = (
                  <div className="flex items-center">
                    <HeartOutlined className="mr-1 text-red-500" />
                    <span>{career.saves || 0}</span>
                  </div>
                );
                return acc;
              }, {}),
            },
          ]}
          columns={[
            {
              title: 'Attribute',
              dataIndex: 'attribute',
              key: 'attribute',
              fixed: 'left',
              width: 150,
              className: 'font-medium',
            },
            ...careersToCompare.map((career, index) => ({
              title: (
                <div className="text-center">
                  <div className="font-medium">{career.title}</div>
                  <Tag color="default">{career.category}</Tag>
                </div>
              ),
              dataIndex: `career${index}`,
              key: `career${index}`,
              align: 'center',
            })),
          ]}
          pagination={false}
          bordered
          size="middle"
        />

        <div className="flex justify-end">
          <Space>
            <Button onClick={() => setCompareDrawerVisible(false)}>
              Close
            </Button>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() => {
                window.print();
              }}
            >
              Print Comparison
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  // Analytics content
  const renderAnalyticsContent = () => {
    return (
      <div className="space-y-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Careers"
                value={careerStats.totalCareers}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Featured Careers"
                value={careerStats.featuredCareers}
                prefix={<StarFilled style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Categories"
                value={Object.keys(careerStats.categoryCounts).length}
                prefix={<AppstoreOutlined />}
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Avg. Entry Salary"
                value={
                  Object.values(careerStats.averageSalaries).length > 0
                    ? `$${Math.round(
                        Object.values(careerStats.averageSalaries).reduce(
                          (sum, val) => sum + val,
                          0
                        ) / Object.values(careerStats.averageSalaries).length
                      ).toLocaleString()}`
                    : 'N/A'
                }
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Category Distribution">
              <div className="h-80">
                {Object.keys(careerStats.categoryCounts).length > 0 ? (
                  <Pie
                    data={Object.entries(careerStats.categoryCounts).map(
                      ([category, count]) => ({
                        type: category,
                        value: count,
                      })
                    )}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name} ({value})',
                    }}
                    interactions={[{ type: 'element-active' }]}
                  />
                ) : (
                  <Empty description="No data available" />
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Market Demand Distribution">
              <div className="h-80">
                {Object.keys(careerStats.demandDistribution).length > 0 ? (
                  <Pie
                    data={Object.entries(careerStats.demandDistribution).map(
                      ([demand, count]) => ({
                        type: demand,
                        value: count,
                      })
                    )}
                    angleField="value"
                    colorField="type"
                    radius={0.8}
                    label={{
                      type: 'outer',
                      content: '{name} ({value})',
                    }}
                    interactions={[{ type: 'element-active' }]}
                    color={['#f5222d', '#faad14', '#1890ff', '#722ed1']}
                  />
                ) : (
                  <Empty description="No data available" />
                )}
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="Average Entry Salary by Category">
              <div className="h-80">
                {Object.keys(careerStats.averageSalaries).length > 0 ? (
                  <Column
                    data={Object.entries(careerStats.averageSalaries).map(
                      ([category, salary]) => ({
                        category,
                        salary,
                      })
                    )}
                    xField="category"
                    yField="salary"
                    label={{
                      position: 'middle',
                      style: {
                        fill: '#FFFFFF',
                        opacity: 0.6,
                      },
                      formatter: (v) => `$${v.salary.toLocaleString()}`,
                    }}
                    meta={{
                      salary: {
                        formatter: (v) => `$${v.toLocaleString()}`,
                      },
                    }}
                  />
                ) : (
                  <Empty description="No data available" />
                )}
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Most Popular Skills">
              <div className="h-80 overflow-auto">
                {careerStats.popularSkills.length > 0 ? (
                  <List
                    dataSource={careerStats.popularSkills}
                    renderItem={(item, index) => (
                      <List.Item>
                        <div className="flex items-center w-full">
                          <div className="mr-4 text-gray-500">{index + 1}.</div>
                          <div className="flex-1">
                            <Tag color="green">{item.skill}</Tag>
                          </div>
                          <div>
                            <Badge
                              count={item.count}
                              style={{ backgroundColor: '#1890ff' }}
                            />
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                ) : (
                  <Empty description="No data available" />
                )}
              </div>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Tabs defaultActiveKey="views">
              <TabPane tab="Most Viewed Careers" key="views">
                <div className="h-72 overflow-auto">
                  {careerStats.topViewedCareers.length > 0 ? (
                    <List
                      dataSource={careerStats.topViewedCareers}
                      renderItem={(career, index) => (
                        <List.Item
                          key={career._id}
                          actions={[
                            <Button
                              type="link"
                              icon={<EyeOutlined />}
                              onClick={() => handleViewCareerDetails(career)}
                            >
                              View
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                src={career.image}
                                icon={!career.image && <InfoCircleOutlined />}
                              />
                            }
                            title={
                              <div className="flex items-center">
                                <span className="mr-2">{career.title}</span>
                                {career.featured && (
                                  <StarFilled style={{ color: '#faad14' }} />
                                )}
                              </div>
                            }
                            description={
                              <div className="flex items-center">
                                <Tag color="default">{career.category}</Tag>
                                <div className="ml-2 flex items-center">
                                  <EyeOutlined className="mr-1 text-gray-500" />
                                  <span>{career.views || 0}</span>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="No data available" />
                  )}
                </div>
              </TabPane>

              <TabPane tab="Most Saved Careers" key="saves">
                <div className="h-72 overflow-auto">
                  {careerStats.topSavedCareers.length > 0 ? (
                    <List
                      dataSource={careerStats.topSavedCareers}
                      renderItem={(career, index) => (
                        <List.Item
                          key={career._id}
                          actions={[
                            <Button
                              type="link"
                              icon={<EyeOutlined />}
                              onClick={() => handleViewCareerDetails(career)}
                            >
                              View
                            </Button>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                src={career.image}
                                icon={!career.image && <InfoCircleOutlined />}
                              />
                            }
                            title={
                              <div className="flex items-center">
                                <span className="mr-2">{career.title}</span>
                                {career.featured && (
                                  <StarFilled style={{ color: '#faad14' }} />
                                )}
                              </div>
                            }
                            description={
                              <div className="flex items-center">
                                <Tag color="default">{career.category}</Tag>
                                <div className="ml-2 flex items-center">
                                  <HeartOutlined className="mr-1 text-red-500" />
                                  <span>{career.saves || 0}</span>
                                </div>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="No data available" />
                  )}
                </div>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Career Management"
        subtitle="Manage career information and recommendations"
        actions={
          <Space wrap>
            <Button
              icon={<BarChartOutlined />}
              onClick={() => setAnalyticsModalVisible(true)}
            >
              Analytics
            </Button>

            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="csv"
                    icon={<FileTextOutlined />}
                    onClick={() => handleExportCareers('csv')}
                  >
                    Export as CSV
                  </Menu.Item>
                  <Menu.Item
                    key="excel"
                    icon={<FileExcelOutlined />}
                    onClick={() => handleExportCareers('excel')}
                  >
                    Export as Excel
                  </Menu.Item>
                  <Menu.Item
                    key="pdf"
                    icon={<FilePdfOutlined />}
                    onClick={() => handleExportCareers('pdf')}
                  >
                    Export as PDF
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    key="import"
                    icon={<UploadOutlined />}
                    onClick={() => setImportModalVisible(true)}
                  >
                    Import Careers
                  </Menu.Item>
                  <Menu.Item
                    key="batch"
                    icon={<CloudUploadOutlined />}
                    onClick={() => setBatchUploadVisible(true)}
                  >
                    Batch Upload
                  </Menu.Item>
                </Menu>
              }
            >
              <Button icon={<DownloadOutlined />}>
                Import/Export <DownOutlined />
              </Button>
            </Dropdown>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCareer}
            >
              Add Career
            </Button>
          </Space>
        }
      />

      {fetchError && (
        <Alert
          message="Error Loading Careers"
          description={
            fetchError.message ||
            'Failed to load careers. Please try refreshing the page.'
          }
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
          className="mb-4"
        />
      )}

      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search careers by title, description, category or skills..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="max-w-md"
              allowClear
              size="large"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterVisible(!filterVisible)}
              type={
                Object.values(filters).some((v) =>
                  Array.isArray(v) ? v.length > 0 : v !== null
                ) || advancedSearch
                  ? 'primary'
                  : 'default'
              }
            >
              Filters
            </Button>

            <Segmented
              options={[
                {
                  label: 'Table',
                  value: 'table',
                  icon: <BarsOutlined />,
                },
                {
                  label: 'Cards',
                  value: 'cards',
                  icon: <AppstoreOutlined />,
                },
              ]}
              value={viewMode}
              onChange={setViewMode}
            />

            <Tooltip title="Refresh data">
              <Button icon={<SyncOutlined />} onClick={() => refetch()} />
            </Tooltip>
          </div>
        </div>

        {filterVisible && <FilterPanel />}

        {selectedRowKeys.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-md mb-4 flex justify-between items-center">
            <span>Selected {selectedRowKeys.length} careers</span>
            <Space>
              <Button onClick={() => setSelectedRowKeys([])}>Clear</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="delete"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleBulkAction('delete')}
                    >
                      Delete Selected
                    </Menu.Item>
                    <Menu.Item
                      key="feature"
                      icon={<StarFilled />}
                      onClick={() => handleBulkAction('feature')}
                    >
                      Feature Selected
                    </Menu.Item>
                    <Menu.Item
                      key="unfeature"
                      icon={<StarOutlined />}
                      onClick={() => handleBulkAction('unfeature')}
                    >
                      Unfeature Selected
                    </Menu.Item>
                    <Menu.Item
                      key="compare"
                      icon={<SwapOutlined />}
                      onClick={() => handleBulkAction('compare')}
                    >
                      Compare Selected
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <Button type="primary">
                  Bulk Actions <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </div>
        )}

        {isLoading ? (
          <div className="py-8">
            <Skeleton active paragraph={{ rows: 5 }} />
          </div>
        ) : (
          <>
            <div className="mb-2 text-gray-500 text-sm">
              {totalCareers} careers found
            </div>

            {viewMode === 'table' ? (
              <Table
                columns={columns}
                dataSource={getSortedCareers()}
                rowKey="_id"
                rowSelection={rowSelection}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalCareers,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} careers`,
                  onChange: handlePageChange,
                  onShowSizeChange: handlePageChange,
                }}
                rowClassName="hover:bg-gray-50"
                scroll={{ x: 'max-content' }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span>
                          No careers found.{' '}
                          {searchText && 'Try adjusting your search.'}
                        </span>
                      }
                    />
                  ),
                }}
              />
            ) : (
              <Row gutter={[16, 16]}>
                {getSortedCareers().length > 0 ? (
                  getSortedCareers().map((career) => renderCareerCard(career))
                ) : (
                  <Col span={24}>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span>
                          No careers found.{' '}
                          {searchText && 'Try adjusting your search.'}
                        </span>
                      }
                    />
                  </Col>
                )}
              </Row>
            )}
          </>
        )}
      </Card>

      {/* Career Form Modal */}
      <Modal
        title={
          <div className="flex items-center">
            {editMode ? (
              <>
                <EditOutlined className="mr-2 text-blue-500" />
                <span>Edit Career: {currentCareer?.title}</span>
              </>
            ) : (
              <>
                <PlusOutlined className="mr-2 text-green-500" />
                <span>Add New Career</span>
              </>
            )}
          </div>
        }
        open={careerModalVisible}
        onCancel={() => setCareerModalVisible(false)}
        footer={null}
        width={800}
        // REMOVED destroyOnClose to keep all form fields mounted and retain data
        // destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            marketDemand: 'Medium',
            minimumMeanGrade: 'C+',
            featured: false,
            keySubjects: [],
            skillsRequired: [],
            jobProspects: [],
            industryTrends: [],
          }}
          ref={formRef}
        >
          <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
            {formTabs.map((tab) => (
              <TabPane tab={tab.tab} key={tab.key}>
                {tab.content}
              </TabPane>
            ))}
          </Tabs>

          <div className="flex justify-between mt-6">
            <div>
              {activeTabKey !== '1' && (
                <Button onClick={handlePrevTab}>Previous</Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setCareerModalVisible(false)}>
                Cancel
              </Button>

              {activeTabKey !== '5' ? (
                <Button type="primary" onClick={handleNextTab}>
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    createCareerMutation.isLoading ||
                    updateCareerMutation.isLoading
                  }
                  disabled={loading}
                >
                  {editMode ? 'Update Career' : 'Create Career'}
                </Button>
              )}
            </div>
          </div>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <Image
          alt="Career Preview"
          style={{ width: '100%' }}
          src={previewImage || null}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-red-500" />
            <span className="font-medium">
              Delete Career: {careerToDelete?.title}
            </span>
          </div>
        }
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="delete"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={handleDeleteConfirm}
            className="flex items-center gap-1"
          >
            Delete Permanently
          </Button>,
        ]}
        centered
        closable={false}
      >
        <div className="space-y-4">
          <p className="text-gray-800">
            Are you sure you want to delete this career? This action cannot be
            undone.
          </p>

          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
            <div className="flex items-start gap-2">
              <WarningOutlined className="text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Warning</p>
                <p className="text-gray-700">
                  Deleting this career will remove it from all student
                  recommendations and search results. Any associated data will
                  be <span className="font-medium">permanently lost</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Career Detail Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <div className="mr-2">
              {currentCareer?.featured && (
                <StarFilled style={{ color: '#faad14', marginRight: 8 }} />
              )}
              {currentCareer?.title}
            </div>
          </div>
        }
        placement="right"
        width={800}
        onClose={() => setCareerDetailDrawer(false)}
        open={careerDetailDrawer}
        extra={
          <Space>
            <Button onClick={() => setCareerDetailDrawer(false)}>Close</Button>
            <Button
              type="primary"
              onClick={() => {
                setCareerDetailDrawer(false);
                handleEditCareer(currentCareer);
              }}
            >
              Edit
            </Button>
          </Space>
        }
      >
        <Tabs
          activeKey={careerDetailTabs}
          onChange={setCareerDetailTabs}
          className="career-detail-tabs"
        >
          <TabPane
            tab={
              <span>
                <InfoCircleOutlined /> Overview
              </span>
            }
            key="overview"
          />
          <TabPane
            tab={
              <span>
                <RiseOutlined /> Career Path
              </span>
            }
            key="career-path"
          />
          <TabPane
            tab={
              <span>
                <BarChartOutlined /> Statistics
              </span>
            }
            key="stats"
          />
        </Tabs>

        {renderCareerDetailContent()}
      </Drawer>

      {/* Career Comparison Drawer */}
      <Drawer
        title="Compare Careers"
        placement="right"
        width="80%"
        onClose={() => {
          setCompareDrawerVisible(false);
          setCareersToCompare([]);
        }}
        open={compareDrawerVisible}
      >
        {renderComparisonContent()}
      </Drawer>

      {/* Analytics Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <BarChartOutlined className="mr-2 text-blue-500" />
            <span>Career Analytics Dashboard</span>
          </div>
        }
        open={analyticsModalVisible}
        onCancel={() => setAnalyticsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAnalyticsModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="export"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              // Export analytics as PDF
              const doc = new jsPDF('landscape');
              doc.text('Career Analytics Report', 14, 22);
              doc.save('career_analytics_report.pdf');
            }}
          >
            Export Report
          </Button>,
        ]}
        width={1000}
        centered
      >
        {analyticsLoading ? (
          <div className="py-8 text-center">
            <Spin size="large" />
            <div className="mt-4 text-gray-500">Loading analytics data...</div>
          </div>
        ) : (
          renderAnalyticsContent()
        )}
      </Modal>

      {/* Import Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <UploadOutlined className="mr-2 text-blue-500" />
            <span>Import Careers</span>
          </div>
        }
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
          setImportFile(null);
        }}
        footer={[
          <Button
            key="template"
            icon={<DownloadOutlined />}
            onClick={generateBatchTemplate}
          >
            Download Template
          </Button>,
          <Button
            key="cancel"
            onClick={() => {
              setImportModalVisible(false);
              setImportFile(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="import"
            type="primary"
            icon={<CloudUploadOutlined />}
            onClick={handleImportCareers}
            loading={importLoading}
            disabled={!importFile}
          >
            Import
          </Button>,
        ]}
        width={600}
      >
        <div className="space-y-4">
          <Alert
            message="Import Instructions"
            description={
              <ol className="list-decimal pl-5 mt-2">
                <li>Download the template Excel file</li>
                <li>Fill in the career data following the template format</li>
                <li>Upload the completed file</li>
                <li>Click Import to add the careers to the system</li>
              </ol>
            }
            type="info"
            showIcon
          />

          <div className="border-dashed border-2 border-gray-300 p-6 text-center rounded-md">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImportFileChange}
              style={{ display: 'none' }}
              id="import-file"
            />
            <label htmlFor="import-file">
              <div className="cursor-pointer">
                <UploadOutlined style={{ fontSize: 40, color: '#1890ff' }} />
                <p className="text-blue-500 mt-2">Click to upload</p>
                <p className="text-gray-500 text-sm">
                  Support for Excel or CSV
                </p>
              </div>
            </label>

            {importFile && (
              <div className="mt-4">
                <Tag color="blue" icon={<FileExcelOutlined />}>
                  {importFile.name}
                </Tag>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Duplicate Career Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CopyOutlined className="mr-2 text-blue-500" />
            <span>Duplicate Career</span>
          </div>
        }
        open={duplicateModalVisible}
        onCancel={() => {
          setDuplicateModalVisible(false);
          setCareerToDuplicate(null);
        }}
        footer={null}
        width={500}
      >
        <Form
          layout="vertical"
          onFinish={handleConfirmDuplicate}
          initialValues={{
            newTitle: careerToDuplicate
              ? `Copy of ${careerToDuplicate.title}`
              : '',
          }}
        >
          <div className="mb-4">
            <Alert
              message="You are duplicating:"
              description={
                <div className="flex items-center mt-2">
                  {careerToDuplicate?.image ? (
                    <img
                      src={careerToDuplicate.image || '/placeholder.svg'}
                      alt={careerToDuplicate.title}
                      className="w-12 h-12 object-cover rounded-md mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                      <InfoCircleOutlined
                        style={{ color: '#bfbfbf', fontSize: '20px' }}
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-medium">
                      {careerToDuplicate?.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      <Tag color="default">{careerToDuplicate?.category}</Tag>
                    </div>
                  </div>
                </div>
              }
              type="info"
              showIcon
            />
          </div>

          <Form.Item
            name="newTitle"
            label="New Career Title"
            rules={[
              {
                required: true,
                message: 'Please enter a title for the duplicate career',
              },
            ]}
          >
            <Input placeholder="Enter new title" />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setDuplicateModalVisible(false);
                setCareerToDuplicate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={duplicateCareerMutation.isLoading}
            >
              Duplicate Career
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Batch Upload Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <CloudUploadOutlined className="mr-2 text-blue-500" />
            <span>Batch Upload Careers</span>
          </div>
        }
        open={batchUploadVisible}
        onCancel={() => setBatchUploadVisible(false)}
        footer={null}
        width={700}
      >
        <div className="space-y-6">
          <Alert
            message="Batch Upload Instructions"
            description={
              <ol className="list-decimal pl-5 mt-2">
                <li>Download the template Excel file</li>
                <li>Fill in multiple career entries in the spreadsheet</li>
                <li>Upload the completed file to add all careers at once</li>
                <li>
                  The system will validate each entry and report any errors
                </li>
              </ol>
            }
            type="info"
            showIcon
          />

          <Dragger
            name="file"
            multiple={false}
            accept=".xlsx,.xls,.csv"
            showUploadList={true}
            beforeUpload={(file) => {
              setImportFile(file);
              return false;
            }}
            fileList={importFile ? [importFile] : []}
            onRemove={() => setImportFile(null)}
          >
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for Excel (.xlsx, .xls) or CSV files only
            </p>
          </Dragger>

          <div className="flex justify-between">
            <Button icon={<DownloadOutlined />} onClick={generateBatchTemplate}>
              Download Template
            </Button>

            <div>
              <Button
                onClick={() => setBatchUploadVisible(false)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={handleImportCareers}
                loading={importLoading}
                disabled={!importFile}
              >
                Upload and Process
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Hidden CSV Link for Export */}
      <CSVLink
        id="csvLink"
        data={
          careers?.map((career) => ({
            Title: career.title,
            Category: career.category,
            Description: career.description,
            KeySubjects: (career.keySubjects || []).join(', '),
            MinimumMeanGrade: career.minimumMeanGrade,
            MarketDemand: career.marketDemand,
            JobProspects: (career.jobProspects || []).join(', '),
            EntryLevelSalary: career.salary?.entry || '',
            MidLevelSalary: career.salary?.mid || '',
            SeniorLevelSalary: career.salary?.senior || '',
            ProgramDuration: career.programDuration,
            SkillsRequired: (career.skillsRequired || []).join(', '),
            Featured: career.featured ? 'Yes' : 'No',
            Views: career.views || 0,
            Saves: career.saves || 0,
          })) || []
        }
        filename="careers_export.csv"
        className="hidden"
        ref={csvLinkRef}
      />
    </AdminLayout>
  );
};

export default CareerManagement;
