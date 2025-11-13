'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Breadcrumb,
  Drawer,
  Badge,
  theme,
  Tooltip,
  Divider,
  App,
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  TeamOutlined,
  BookOutlined,
  BankOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
  BarChartOutlined,
  HomeOutlined,
  HistoryOutlined,
  DatabaseOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';

const { Header, Sider, Content, Footer } = Layout;
const { Title, Text } = Typography;

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme: colorTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { token } = theme.useToken();
  const { message } = App.useApp();

  // Mock notifications data
  useEffect(() => {
    // Simulating fetching notifications
    setNotifications([
      {
        id: 1,
        title: 'New User Registration',
        message: 'John Doe has registered as a new user',
        time: '10 minutes ago',
        read: false,
      },
      {
        id: 2,
        title: 'System Update',
        message: 'System will undergo maintenance tonight',
        time: '1 hour ago',
        read: false,
      },
      {
        id: 3,
        title: 'Database Backup Complete',
        message: 'Weekly database backup completed successfully',
        time: '3 hours ago',
        read: true,
      },
    ]);
  }, []);

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setDrawerVisible(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get current path for breadcrumb and menu selection
  const pathSnippets = location.pathname.split('/').filter((i) => i);
  const breadcrumbItems = [
    {
      title: (
        <Link to="/admin">
          <HomeOutlined /> Admin
        </Link>
      ),
    },
    ...pathSnippets.slice(1).map((snippet, index) => {
      const url = `/admin/${pathSnippets.slice(1, index + 2).join('/')}`;
      const title =
        snippet.charAt(0).toUpperCase() + snippet.slice(1).replace(/-/g, ' ');
      return {
        title: <Link to={url}>{title}</Link>,
      };
    }),
  ];

  // Get current selected menu item
  const selectedKey = pathSnippets[1] || 'dashboard';

  // Menu items
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: 'users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Users</Link>,
    },
    {
      key: 'careers',
      icon: <BookOutlined />,
      label: <Link to="/admin/careers">Careers</Link>,
    },
    {
      key: 'institutions',
      icon: <BankOutlined />,
      label: <Link to="/admin/institutions">Institutions</Link>,
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: <Link to="/admin/analytics">Analytics</Link>,
    },
    {
      key: 'activity',
      icon: <HistoryOutlined />,
      label: <Link to="/admin/activity">Activity Logs</Link>,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Settings</Link>,
    },
    {
      key: 'backup',
      icon: <DatabaseOutlined />,
      label: <Link to="/admin/backup">Database Backup</Link>,
    },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      message.error('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark notification as read
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    // Additional logic for handling notification click
  };

  // User dropdown menu
  const userMenu = (
    <Menu
      items={[
        {
          key: 'profile',
          icon: <UserOutlined />,
          label: <Link to="/profile">My Profile</Link>,
        },
        {
          key: 'settings',
          icon: <SettingOutlined />,
          label: <Link to="/admin/settings">Settings</Link>,
        },
        {
          key: 'theme',
          icon: <BulbOutlined />,
          label: (
            <a onClick={toggleTheme}>
              Switch to {colorTheme === 'dark' ? 'Light' : 'Dark'} Mode
            </a>
          ),
        },
        {
          type: 'divider',
        },
        {
          key: 'help',
          icon: <QuestionCircleOutlined />,
          label: <Link to="/admin/help">Help & Support</Link>,
        },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: <a onClick={handleLogout}>Logout</a>,
          danger: true,
        },
      ]}
    />
  );

  // Notification dropdown
  const notificationMenu = (
    <Menu
      style={{ width: 320, maxHeight: 400, overflow: 'auto' }}
      items={
        notifications.length > 0
          ? [
              {
                key: 'header',
                label: (
                  <div className="flex justify-between items-center">
                    <Text strong>Notifications</Text>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        setNotifications(
                          notifications.map((n) => ({ ...n, read: true }))
                        );
                        message.success('All notifications marked as read');
                      }}
                    >
                      Mark all as read
                    </Button>
                  </div>
                ),
                disabled: true,
              },
              {
                type: 'divider',
                style: { margin: '0' },
              },
              ...notifications.map((notification) => ({
                key: notification.id,
                label: (
                  <div
                    onClick={() => handleNotificationClick(notification)}
                    style={{
                      padding: '8px 0',
                      backgroundColor: notification.read
                        ? 'transparent'
                        : token.colorBgTextHover,
                      borderRadius: token.borderRadius,
                    }}
                  >
                    <Text strong={!notification.read}>
                      {notification.title}
                    </Text>
                    <br />
                    <Text type="secondary">{notification.message}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {notification.time}
                    </Text>
                  </div>
                ),
              })),
              {
                type: 'divider',
                style: { margin: '0' },
              },
              {
                key: 'footer',
                label: (
                  <div className="text-center">
                    <Link to="/admin/notifications">
                      View all notifications
                    </Link>
                  </div>
                ),
              },
            ]
          : [
              {
                key: 'empty',
                label: (
                  <div className="text-center py-4">
                    <Text type="secondary">No new notifications</Text>
                  </div>
                ),
              },
            ]
      }
    />
  );

  const sidebarContent = (
    <>
      <div
        className="logo p-4 flex items-center justify-center"
        style={{
          borderBottom: `1px solid ${
            colorTheme === 'dark'
              ? 'rgba(255,255,255,0.1)'
              : token.colorBorderSecondary
          }`,
          transition: 'all 0.3s',
        }}
      >
        <Link to="/admin" className="flex items-center">
          {!collapsed && (
            <div
              className="flex items-center gap-2"
              style={{
                transition: 'all 0.3s',
                opacity: collapsed ? 0 : 1,
              }}
            >
              <BookOutlined
                style={{ fontSize: '24px', color: token.colorPrimary }}
              />
              <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
                Admin Panel
              </Title>
            </div>
          )}
          {collapsed && (
            <BookOutlined
              style={{ fontSize: '24px', color: token.colorPrimary }}
            />
          )}
        </Link>
      </div>
      <div
        className="sidebar-search px-4 py-3"
        style={{ display: collapsed ? 'none' : 'block' }}
      >
        <div
          className="flex items-center rounded-md overflow-hidden"
          style={{
            border: `1px solid ${
              colorTheme === 'dark'
                ? 'rgba(255,255,255,0.2)'
                : token.colorBorderSecondary
            }`,
            transition: 'all 0.3s',
          }}
        >
          <SearchOutlined style={{ margin: '0 8px' }} />
          <input
            placeholder="Search..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '8px 0',
              width: '100%',
              color:
                colorTheme === 'dark' ? 'rgba(255,255,255,0.85)' : 'inherit',
            }}
          />
        </div>
      </div>
      <Divider style={{ margin: '8px 0', opacity: collapsed ? 0 : 0.6 }} />
      <div className="sidebar-menu flex-1 overflow-y-auto">
        <Menu
          theme={colorTheme === 'dark' ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </div>
      {!collapsed && (
        <div
          className="sidebar-footer p-4"
          style={{
            borderTop: `1px solid ${
              colorTheme === 'dark'
                ? 'rgba(255,255,255,0.1)'
                : token.colorBorderSecondary
            }`,
            transition: 'all 0.3s',
          }}
        >
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              src={user?.avatar}
              icon={!user?.avatar && <UserOutlined />}
              alt={user?.name}
            />
            <div className="flex-1 min-w-0">
              <Text
                strong
                style={{
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || 'User'}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {user?.role || 'Administrator'}
              </Text>
            </div>
            <Dropdown
              overlay={userMenu}
              trigger={['click']}
              placement="topRight"
            >
              <Button type="text" size="small" icon={<SettingOutlined />} />
            </Dropdown>
          </div>
        </div>
      )}
    </>
  );

  return (
    <App>
      <Layout style={{ minHeight: '100vh' }}>
        {mobileView ? (
          <Drawer
            placement="left"
            onClose={() => setDrawerVisible(false)}
            open={drawerVisible}
            width={250}
            styles={{
              body: {
                padding: 0,
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        ) : (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme={colorTheme === 'dark' ? 'dark' : 'light'}
            width={250}
            style={{
              boxShadow:
                colorTheme === 'dark'
                  ? 'none'
                  : '0 2px 8px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              height: '100vh',
              position: 'fixed',
              left: 0,
              overflow: 'auto',
              transition: 'all 0.3s',
            }}
          >
            {sidebarContent}
          </Sider>
        )}
        <Layout
          style={{
            marginLeft: mobileView ? 0 : collapsed ? 80 : 250,
            transition: 'all 0.3s',
          }}
        >
          <Header
            style={{
              padding: '0 16px',
              background:
                colorTheme === 'dark' ? token.colorBgContainer : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
              position: 'sticky',
              top: 0,
              zIndex: 999,
              width: '100%',
              transition: 'all 0.3s',
            }}
          >
            <div className="flex items-center">
              {mobileView ? (
                <Button
                  type="text"
                  icon={<MenuUnfoldOutlined />}
                  onClick={() => setDrawerVisible(true)}
                  style={{ fontSize: '16px', width: 48, height: 48 }}
                />
              ) : (
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: '16px', width: 48, height: 48 }}
                />
              )}
              <Link
                to="/"
                className="ml-4 hover:text-primary transition-colors"
                style={{ color: token.colorTextSecondary }}
              >
                <Tooltip title="Back to Main Site">
                  <Space>
                    <HomeOutlined />
                    {!mobileView && <span>Main Site</span>}
                  </Space>
                </Tooltip>
              </Link>
            </div>
            <Space size="large">
              <Tooltip title="Help & Support">
                <Button
                  type="text"
                  icon={<QuestionCircleOutlined />}
                  onClick={() => navigate('/admin/help')}
                />
              </Tooltip>
              <Dropdown
                overlay={notificationMenu}
                trigger={['click']}
                placement="bottomRight"
                arrow
              >
                <Badge
                  count={notifications.filter((n) => !n.read).length}
                  overflowCount={9}
                  offset={[-2, 2]}
                >
                  <Button
                    type="text"
                    icon={<BellOutlined />}
                    style={{ fontSize: '16px' }}
                  />
                </Badge>
              </Dropdown>
              <Dropdown
                overlay={userMenu}
                trigger={['click']}
                placement="bottomRight"
                arrow
              >
                <Button
                  type="text"
                  className="flex items-center"
                  style={{
                    height: 'auto',
                    padding: '4px 8px',
                    borderRadius: token.borderRadius,
                  }}
                >
                  <Space>
                    <Avatar
                      size="small"
                      src={user?.avatar}
                      icon={!user?.avatar && <UserOutlined />}
                      alt={user?.name}
                      style={{ backgroundColor: token.colorPrimary }}
                    />
                    {!mobileView && (
                      <div className="flex flex-col items-start">
                        <Text strong style={{ lineHeight: 1.2 }}>
                          {user?.name || 'User'}
                        </Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: '12px', lineHeight: 1.2 }}
                        >
                          {user?.role || 'Administrator'}
                        </Text>
                      </div>
                    )}
                  </Space>
                </Button>
              </Dropdown>
            </Space>
          </Header>
          <Content
            style={{
              margin: '16px',
              transition: 'all 0.3s',
            }}
          >
            <div
              className="mb-4 p-4 rounded-md"
              style={{
                background:
                  colorTheme === 'dark' ? token.colorBgContainer : '#fff',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              }}
            >
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <div
              style={{
                padding: 24,
                background:
                  colorTheme === 'dark' ? token.colorBgContainer : '#fff',
                borderRadius: token.borderRadius,
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
                minHeight: 'calc(100vh - 200px)',
                transition: 'all 0.3s',
              }}
            >
              {children}
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
              background: 'transparent',
              transition: 'all 0.3s',
            }}
          >
            <Text type="secondary">
              Career Recommender System ©{new Date().getFullYear()} - Admin
              Panel
            </Text>
          </Footer>
        </Layout>
      </Layout>
    </App>
  );
};

export default AdminLayout;
