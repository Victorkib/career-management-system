'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Space,
  Modal,
  Input,
  Form,
  notification,
  Card,
  Alert,
  Skeleton,
  Segmented,
  Tooltip,
  Dropdown,
  Menu,
  Image,
} from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  SyncOutlined,
  BarsOutlined,
  StarOutlined,
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
  AppstoreOutlined,
  StarFilled,
} from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from 'react-csv';

import AdminLayout from '../../../components/v2/admin/AdminLayout';
import AdminHeader from '../../../components/v2/admin/AdminHeader';
import InstitutionTable from './components/InstitutionTable';
import InstitutionCards from './components/InstitutionCards';
import InstitutionForm from './components/InstitutionForm';
import FilterPanel from './components/FilterPanel';
import ProgramForm from './components/ProgramForm';
import InstitutionDetailDrawer from './components/InstitutionDetailDrawer';
import AnalyticsModal from './components/AnalyticsModal';
import ImportModal from './components/ImportModal';
import DuplicateModal from './components/DuplicateModal';
import BatchUploadModal from './components/BatchUploadModal';

import { useInstitutions } from '../../../hooks/useInstitutions';
import { usePrograms } from '../../../hooks/usePrograms';
import {
  getFilteredInstitutions,
  getSortedInstitutions,
  calculateInstitutionStats,
  handleExportInstitutions,
} from '../../../utils/institutionUtils';

const InstitutionManagement = () => {
  // State management
  const [searchText, setSearchText] = useState('');
  const [institutionModalVisible, setInstitutionModalVisible] = useState(false);
  const [programModalVisible, setProgramModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentInstitution, setCurrentInstitution] = useState(null);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [form] = Form.useForm();
  const [programForm] = Form.useForm();
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState({
    type: [],
    city: [],
    featured: null,
  });
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('ascend');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [institutionToDelete, setInstitutionToDelete] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [institutionDetailDrawer, setInstitutionDetailDrawer] = useState(false);
  const [institutionDetailTabs, setInstitutionDetailTabs] =
    useState('overview');
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [duplicateModalVisible, setDuplicateModalVisible] = useState(false);
  const [institutionToDuplicate, setInstitutionToDuplicate] = useState(null);
  const [batchUploadVisible, setBatchUploadVisible] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    establishedYearRange: [1900, 2024],
    programCount: [0, 100],
    rankings: [],
  });
  const [institutionStats, setInstitutionStats] = useState({
    totalInstitutions: 0,
    featuredInstitutions: 0,
    typeCounts: {},
    locationDistribution: {},
    averagePrograms: 0,
    topInstitutions: [],
    recentlyAdded: [],
  });
  const [exportLoading, setExportLoading] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const csvLinkRef = useRef(null);

  // Custom hooks
  const {
    institutions,
    isLoading,
    fetchError,
    refetch,
    createInstitutionMutation,
    updateInstitutionMutation,
    updateFeaturedStatusMutation, // FIXED: Added this line
    deleteInstitutionMutation,
    bulkDeleteInstitutionsMutation,
    bulkUpdateFeaturedMutation,
    duplicateInstitutionMutation,
  } = useInstitutions();

  const { addProgramMutation, updateProgramMutation, deleteProgramMutation } =
    usePrograms();

  // Calculate stats when institutions data changes
  useEffect(() => {
    if (institutions && institutions.length > 0) {
      const stats = calculateInstitutionStats(institutions);
      setInstitutionStats(stats);
    }
  }, [institutions]);

  // Get filtered and sorted institutions
  const filteredInstitutions = getFilteredInstitutions(
    institutions,
    searchText,
    filters,
    advancedSearch,
    advancedFilters
  );
  const sortedInstitutions = getSortedInstitutions(
    filteredInstitutions,
    sortField,
    sortOrder
  );

  // Helper function to close institution modal and reset form
  const closeInstitutionModal = () => {
    setInstitutionModalVisible(false);
    setEditMode(false);
    setCurrentInstitution(null);
    form.resetFields();
  };

  // Helper function to close program modal and reset form
  const closeProgramModal = () => {
    setProgramModalVisible(false);
    setCurrentProgram(null);
    setCurrentInstitution(null);
    programForm.resetFields();
  };

  // Helper function to close duplicate modal
  const closeDuplicateModal = () => {
    setDuplicateModalVisible(false);
    setInstitutionToDuplicate(null);
  };

  // Helper function to close delete modal
  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setInstitutionToDelete(null);
  };

  // Event handlers
  const handleAddInstitution = () => {
    setEditMode(false);
    setCurrentInstitution(null);
    form.resetFields();
    setInstitutionModalVisible(true);
  };

  const handleEditInstitution = (institution) => {
    setEditMode(true);
    setCurrentInstitution(institution);

    // Format the data for the form
    form.setFieldsValue({
      name: institution.name,
      type: institution.type,
      address: institution.location?.address,
      city: institution.location?.city,
      county: institution.location?.county,
      country: institution.location?.country || 'Kenya',
      latitude: institution.location?.coordinates?.latitude,
      longitude: institution.location?.coordinates?.longitude,
      description: institution.description,
      website: institution.website,
      email: institution.contact?.email,
      phone: institution.contact?.phone,
      facebook: institution.contact?.socialMedia?.facebook,
      twitter: institution.contact?.socialMedia?.twitter,
      instagram: institution.contact?.socialMedia?.instagram,
      linkedin: institution.contact?.socialMedia?.linkedin,
      nationalRanking: institution.rankings?.national,
      internationalRanking: institution.rankings?.international,
      rankingYear: institution.rankings?.year,
      facilities: institution.facilities || [],
      accreditation: institution.accreditation?.[0] || '',
      establishedYear: institution.establishedYear,
      logo: institution.logo,
      images: institution.images || [],
      featured: institution.featured || false,
    });

    setInstitutionModalVisible(true);
  };

  const handleFormSubmit = (values) => {
    if (editMode) {
      updateInstitutionMutation.mutate(
        {
          id: currentInstitution._id,
          institutionData: values,
        },
        {
          onSuccess: () => {
            closeInstitutionModal();
          },
          onError: (error) => {
            console.error('Institution operation failed:', error);
            // Modal stays open on error for user to retry
          },
        }
      );
    } else {
      createInstitutionMutation.mutate(values, {
        onSuccess: () => {
          closeInstitutionModal();
        },
        onError: (error) => {
          console.error('Institution operation failed:', error);
          // Modal stays open on error for user to retry
        },
      });
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend');
    } else {
      setSortField(field);
      setSortOrder('ascend');
    }
  };

  const handlePreview = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  const handleViewInstitutionDetails = (institution) => {
    setCurrentInstitution(institution);
    setInstitutionDetailDrawer(true);
    setInstitutionDetailTabs('overview');
  };

  const handleDeleteClick = (institution) => {
    setInstitutionToDelete(institution);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (institutionToDelete) {
      deleteInstitutionMutation.mutate(institutionToDelete._id, {
        onSuccess: () => {
          closeDeleteModal();
        },
        onError: (error) => {
          console.error('Delete failed:', error);
          // Keep modal open on error
        },
      });
    }
  };

  const handleToggleFeature = (institution) => {
    updateFeaturedStatusMutation.mutate(
      {
        id: institution._id,
        featured: !institution.featured,
      },
      {
        onSuccess: () => {
          // Success notification handled by the mutation itself
        },
        onError: (error) => {
          console.error('Toggle feature failed:', error);
        },
      }
    );
  };

  const handleDuplicateInstitution = (institution) => {
    setInstitutionToDuplicate(institution);
    setDuplicateModalVisible(true);
  };

  const handleConfirmDuplicate = (values) => {
    if (institutionToDuplicate) {
      duplicateInstitutionMutation.mutate(
        {
          institutionId: institutionToDuplicate._id,
          newName: values.newName,
        },
        {
          onSuccess: () => {
            closeDuplicateModal();
          },
          onError: (error) => {
            console.error('Duplicate failed:', error);
            // Keep modal open on error
          },
        }
      );
    }
  };

  const handleAddProgram = (institution) => {
    setCurrentInstitution(institution);
    setCurrentProgram(null);
    programForm.resetFields();
    setProgramModalVisible(true);
  };

  const handleEditProgram = (institution, program) => {
    setCurrentInstitution(institution);
    setCurrentProgram(program);
    setProgramModalVisible(true);
  };

  const handleProgramFormSubmit = (values) => {
    // Transform the data to match the backend model structure
    const programData = {
      name: values.name,
      level: values.level,
      duration: values.duration,
      description: values.description,
      tuitionFees: values.tuitionFees,
      careers: values.careers || [], // Include selected careers
      entryRequirements: {
        minimumGrade: values.minimumGrade,
        specificSubjects: values.specificSubjects || [],
        additionalRequirements: values.additionalRequirements || [],
      },
    };

    if (currentProgram) {
      // Update existing program
      updateProgramMutation.mutate(
        {
          institutionId: currentInstitution._id,
          programId: currentProgram._id,
          programData,
        },
        {
          onSuccess: () => {
            closeProgramModal();
          },
          onError: (error) => {
            console.error('Program operation failed:', error);
            // Keep modal open on error
          },
        }
      );
    } else {
      // Add new program
      addProgramMutation.mutate(
        {
          id: currentInstitution._id,
          programData,
        },
        {
          onSuccess: () => {
            closeProgramModal();
          },
          onError: (error) => {
            console.error('Program operation failed:', error);
            // Keep modal open on error
          },
        }
      );
    }
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'delete':
        Modal.confirm({
          title: `Delete ${selectedRowKeys.length} Institutions`,
          content:
            'Are you sure you want to delete these institutions? This action cannot be undone.',
          okText: 'Yes, Delete All',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            bulkDeleteInstitutionsMutation.mutate(selectedRowKeys, {
              onSuccess: () => {
                setSelectedRowKeys([]);
              },
              onError: (error) => {
                console.error('Bulk delete failed:', error);
              },
            });
          },
        });
        break;
      case 'feature':
        bulkUpdateFeaturedMutation.mutate(
          {
            institutionIds: selectedRowKeys,
            featured: true,
          },
          {
            onSuccess: () => {
              setSelectedRowKeys([]);
            },
            onError: (error) => {
              console.error('Bulk feature failed:', error);
            },
          }
        );
        break;
      case 'unfeature':
        bulkUpdateFeaturedMutation.mutate(
          {
            institutionIds: selectedRowKeys,
            featured: false,
          },
          {
            onSuccess: () => {
              setSelectedRowKeys([]);
            },
            onError: (error) => {
              console.error('Bulk unfeature failed:', error);
            },
          }
        );
        break;
      default:
        break;
    }
  };

  const handleExport = async (format) => {
    try {
      await handleExportInstitutions(
        institutions,
        format,
        csvLinkRef,
        setExportLoading
      );
    } catch (error) {
      notification.error({
        message: 'Export Failed',
        description: 'Failed to export institutions. Please try again.',
      });
    }
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Institution Management"
        subtitle="Manage educational institutions and their programs"
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
                    onClick={() => handleExport('csv')}
                  >
                    Export as CSV
                  </Menu.Item>
                  <Menu.Item
                    key="excel"
                    icon={<FileExcelOutlined />}
                    onClick={() => handleExport('excel')}
                  >
                    Export as Excel
                  </Menu.Item>
                  <Menu.Item
                    key="pdf"
                    icon={<FilePdfOutlined />}
                    onClick={() => handleExport('pdf')}
                  >
                    Export as PDF
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    key="import"
                    icon={<UploadOutlined />}
                    onClick={() => setImportModalVisible(true)}
                  >
                    Import Institutions
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
              onClick={handleAddInstitution}
            >
              Add Institution
            </Button>
          </Space>
        }
      />

      {fetchError && (
        <Alert
          message="Error Loading Institutions"
          description={
            fetchError.message ||
            'Failed to load institutions. Please try refreshing the page.'
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
              placeholder="Search institutions by name, description, type, or location..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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

        {filterVisible && (
          <FilterPanel
            institutions={institutions}
            filters={filters}
            setFilters={setFilters}
            advancedSearch={advancedSearch}
            setAdvancedSearch={setAdvancedSearch}
            advancedFilters={advancedFilters}
            setAdvancedFilters={setAdvancedFilters}
            onClose={() => setFilterVisible(false)}
          />
        )}

        {selectedRowKeys.length > 0 && (
          <div className="bg-blue-50 p-3 rounded-md mb-4 flex justify-between items-center">
            <span>Selected {selectedRowKeys.length} institutions</span>
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
              {sortedInstitutions.length} institutions found
            </div>

            {viewMode === 'table' ? (
              <InstitutionTable
                institutions={sortedInstitutions}
                selectedRowKeys={selectedRowKeys}
                onSelectionChange={setSelectedRowKeys}
                onSort={handleSort}
                sortField={sortField}
                sortOrder={sortOrder}
                onViewDetails={handleViewInstitutionDetails}
                onEdit={handleEditInstitution}
                onAddProgram={handleAddProgram}
                onDuplicate={handleDuplicateInstitution}
                onToggleFeature={handleToggleFeature}
                onDelete={handleDeleteClick}
                onPreview={handlePreview}
              />
            ) : (
              <InstitutionCards
                institutions={sortedInstitutions}
                onViewDetails={handleViewInstitutionDetails}
                onEdit={handleEditInstitution}
                onAddProgram={handleAddProgram}
                onDuplicate={handleDuplicateInstitution}
                onToggleFeature={handleToggleFeature}
                onDelete={handleDeleteClick}
                onPreview={handlePreview}
              />
            )}
          </>
        )}
      </Card>

      {/* Institution Form Modal */}
      <InstitutionForm
        visible={institutionModalVisible}
        onCancel={closeInstitutionModal}
        onSubmit={handleFormSubmit}
        editMode={editMode}
        currentInstitution={currentInstitution}
        loading={
          createInstitutionMutation.isLoading ||
          updateInstitutionMutation.isLoading
        }
      />

      {/* Program Form Modal */}
      <ProgramForm
        visible={programModalVisible}
        onCancel={closeProgramModal}
        onSubmit={handleProgramFormSubmit}
        currentInstitution={currentInstitution}
        currentProgram={currentProgram}
        loading={
          addProgramMutation.isLoading || updateProgramMutation.isLoading
        }
      />

      {/* Image Preview Modal */}
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <Image
          alt="Institution Preview"
          style={{ width: '100%' }}
          src={previewImage || '/placeholder.svg'}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-red-500" />
            <span className="font-medium">
              Delete Institution: {institutionToDelete?.name}
            </span>
          </div>
        }
        open={deleteModalVisible}
        onCancel={closeDeleteModal}
        footer={[
          <Button key="cancel" onClick={closeDeleteModal}>
            Cancel
          </Button>,
          <Button
            key="delete"
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={handleDeleteConfirm}
            loading={deleteInstitutionMutation.isLoading}
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
            Are you sure you want to delete this institution? This action cannot
            be undone.
          </p>

          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded">
            <div className="flex items-start gap-2">
              <WarningOutlined className="text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">Warning</p>
                <p className="text-gray-700">
                  Deleting this institution will remove it from all student
                  recommendations and search results. Any associated data will
                  be <span className="font-medium">permanently lost</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Institution Detail Drawer */}
      <InstitutionDetailDrawer
        visible={institutionDetailDrawer}
        onClose={() => setInstitutionDetailDrawer(false)}
        currentInstitution={currentInstitution}
        activeTab={institutionDetailTabs}
        onTabChange={setInstitutionDetailTabs}
        onEdit={handleEditInstitution}
        onAddProgram={handleAddProgram}
        onEditProgram={handleEditProgram}
        deleteProgramMutation={deleteProgramMutation}
        institutions={institutions}
      />

      {/* Analytics Modal */}
      <AnalyticsModal
        visible={analyticsModalVisible}
        onClose={() => setAnalyticsModalVisible(false)}
        institutionStats={institutionStats}
        onViewInstitutionDetails={handleViewInstitutionDetails}
      />

      {/* Import Modal */}
      <ImportModal
        visible={importModalVisible}
        onClose={() => setImportModalVisible(false)}
      />

      {/* Duplicate Modal */}
      <DuplicateModal
        visible={duplicateModalVisible}
        onClose={closeDuplicateModal}
        institutionToDuplicate={institutionToDuplicate}
        onConfirm={handleConfirmDuplicate}
        loading={duplicateInstitutionMutation.isLoading}
      />

      {/* Batch Upload Modal */}
      <BatchUploadModal
        visible={batchUploadVisible}
        onClose={() => setBatchUploadVisible(false)}
      />

      {/* Hidden CSV Link for Export */}
      <CSVLink
        id="csvLink"
        data={
          institutions?.map((institution) => ({
            Name: institution.name,
            Type: institution.type,
            Description: institution.description,
            City: institution.location?.city || '',
            County: institution.location?.county || '',
            Country: institution.location?.country || 'Kenya',
            Address: institution.location?.address || '',
            Email: institution.contact?.email || '',
            Phone: institution.contact?.phone || '',
            Website: institution.website || '',
            EstablishedYear: institution.establishedYear || '',
            Programs: (institution.programs || []).length,
            Facilities: (institution.facilities || []).join(', '),
            Featured: institution.featured ? 'Yes' : 'No',
            Views: institution.views || 0,
          })) || []
        }
        filename="institutions_export.csv"
        className="hidden"
        ref={csvLinkRef}
      />
    </AdminLayout>
  );
};

export default InstitutionManagement;
