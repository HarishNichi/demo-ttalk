'use client';
import React, { useState, useEffect } from 'react';
import { Menu, Button, Drawer, Avatar, Dropdown, Space } from 'antd';
import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  TeamOutlined,
  WifiOutlined,
  LogoutOutlined,
  DownOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18n from './i18nClient';
import { GlobalOutlined } from '@ant-design/icons';

// Create a context for mobile menu state
import { createContext, useContext } from 'react';

const MobileMenuContext = createContext();

export const useMobileMenu = () => {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenu must be used within MobileMenuProvider');
  }
  return context;
};



const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

const Sidebar = () => {
  const { collapsed, setCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Reset mobile drawer state when switching between mobile/desktop
      if (!mobile) {
        setMobileOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Listen for global mobile menu open event
    const handleOpenMobileMenu = () => {
      setMobileOpen(true);
    };
    
    window.addEventListener('openMobileMenu', handleOpenMobileMenu);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('openMobileMenu', handleOpenMobileMenu);
    };
  }, []);

  const menuItems = [
    {
      key: '/contacts',
      icon: <UserOutlined />,
      label: t('sidebar.contacts'),
      onClick: () => isMobile && setMobileOpen(false),
    },
    {
      key: '/groups',
      icon: <TeamOutlined />,
      label: t('sidebar.groups'),
      onClick: () => isMobile && setMobileOpen(false),
    },
    {
      key: '/routers',
      icon: <WifiOutlined />,
      label: t('sidebar.routers'),
      onClick: () => isMobile && setMobileOpen(false),
    },
    {
      key: '/notification-management',
      icon: <BellOutlined />,
      label: t('sidebar.notification-management'),
      onClick: () => isMobile && setMobileOpen(false),
    },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => router.push('/login'),
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key) {
      router.push(e.key);
    }
      if (isMobile) {
      setMobileOpen(false);
    }
  };

  const toggleMobileDrawer = () => {
    setMobileOpen(!mobileOpen);
  };



  const MenuComponent = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[pathname]}
      items={menuItems}
      onClick={handleMenuClick}
      style={{ 
        background: 'transparent',
        border: 'none',
        marginTop: 16 
      }}
    />
  );

  return (
    <>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          style={{
            width: collapsed ? 80 : 240,
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            zIndex: 100,
            transition: 'width 0.3s ease',
            overflow: 'hidden'
          }}
        >
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
          }}>
            {/* Logo/Title */}
            <div style={{ 
              height: 64, 
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: collapsed ? '16px' : '20px',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                flex: 1
              }}>
                {collapsed ? t('shortAdminPanel') : t('adminPanel')}
              </h2>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                  color: 'white', 
                  fontSize: '16px',
                  marginLeft: '8px'
                }}
              />
            </div>
            
            {/* Menu */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {MenuComponent}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={toggleMobileDrawer}
          open={mobileOpen}
          style={{ padding: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          width={280}
        >
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            padding: '16px 0'
          }}>
            {/* Logo/Title */}
            <div style={{ 
              padding: '0 24px 24px',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              marginBottom: 16
            }}>
              <h2 style={{ 
                color: 'white', 
                margin: 0, 
                fontSize: '20px', 
                fontWeight: 600
              }}>
                Admin Panel
              </h2>
            </div>
            
            {/* Menu */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {MenuComponent}
            </div>
          </div>
        </Drawer>
      )}
    </>
  );
}

// Global function to open mobile menu
export const openMobileMenu = () => {
  window.dispatchEvent(new CustomEvent('openMobileMenu'));
};

export default Sidebar;

// Create a provider for sidebar state
export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Create a separate Header component
export const AppHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('ja');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  const handleLanguageChange = () => {
    const newLanguage = currentLanguage === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => router.push('/login'),
    },
  ];

  return (
    <div
      style={{
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 64,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={openMobileMenu}
            style={{ marginRight: 16, fontSize: 18 }}
          />
        )}
          {!isMobile && (
        <h1 style={{ 
          margin: 0, 
          fontSize: '20px', 
          fontWeight: 600,
          color: '#1a1a1a'
        }}>
          {t(`sidebar.${pathname.substring(1)}`)}
        </h1>
           )}
      </div>
       

      {/* User Profile */}
      <Space size="middle">
        <Button type="text" icon={<GlobalOutlined />} onClick={handleLanguageChange}>
          {currentLanguage.toUpperCase()}
        </Button>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Space>
              <Avatar
                style={{ backgroundColor: '#667eea' }}
                icon={<UserOutlined />}
                size="small"
              />
              <span style={{ fontWeight: 500 }}>Admin</span>
              <DownOutlined style={{ fontSize: '12px' }} />
            </Space>
          </div>
        </Dropdown>
      </Space>
    </div>
  );
};