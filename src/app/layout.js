
'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AntdRegistry from "./AntdRegistry";
import Sidebar, { AppHeader, SidebarProvider, useSidebar } from "./Sidebar";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Create a separate component for main content to use sidebar context
const MainContent = ({ children }) => {
  const { collapsed } = useSidebar();
  
  return (
    <div style={{ 
      flex: 1, 
      marginLeft: collapsed ? 80 : 240, // Adjust margin based on collapsed state
      transition: 'margin-left 0.3s ease',
      overflow: 'auto'
    }} className="main-content">
      <AppHeader />
      <div style={{ 
        padding: '16px',
        maxWidth: '1400px', 
        margin: '0 auto',
        minHeight: 'calc(100vh - 96px)',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {children}
      </div>
    </div>
  );
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [isStylesLoaded, setIsStylesLoaded] = useState(false);

  useEffect(() => {
    setIsLoginPage(pathname === '/login');
  }, [pathname]);

  useEffect(() => {
    // Initialize sample data in localStorage
    if (typeof window !== 'undefined') {
      const initializeSampleData = () => {
        const contacts = localStorage.getItem('contacts');
        const groups = localStorage.getItem('groups');
        
        if (!contacts) {
          const sampleContacts = [
            { id: 1, name: 'John Doe', pttNo: 'PTT001', groupId: 1 },
            { id: 2, name: 'Jane Smith', pttNo: 'PTT002', groupId: 1 },
            { id: 3, name: 'Mike Johnson', pttNo: 'PTT003', groupId: 2 },
            { id: 4, name: 'Sarah Wilson', pttNo: 'PTT004', groupId: 2 },
          ];
          localStorage.setItem('contacts', JSON.stringify(sampleContacts));
        }
        
        if (!groups) {
          const sampleGroups = [
            { id: 1, name: 'Developers', description: 'Software development team' },
            { id: 2, name: 'Designers', description: 'UI/UX design team' },
            { id: 3, name: 'Marketing', description: 'Marketing and sales team' },
          ];
          localStorage.setItem('groups', JSON.stringify(sampleGroups));
        }
      };
      
      initializeSampleData();
    }
    
    // Mark styles as loaded after initial render
    const timer = setTimeout(() => {
      setIsStylesLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Preload critical styles to prevent FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical styles for immediate rendering */
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              min-height: 100vh;
              overflow-x: hidden;
            }
            
            /* Ensure proper layout structure */
            .main-content {
              flex: 1;
              overflow: auto;
            }
            
            /* Prevent layout shift during load */
            * {
              box-sizing: border-box;
            }
            
            /* Critical animation for smooth appearance */
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            
            /* Hide content until styles are ready */
            .style-loading {
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            
            .style-loaded {
              opacity: 1;
            }
            
            /* Preload Ant Design base styles */
            .ant-layout {
              display: flex;
              flex: auto;
              flex-direction: column;
              min-height: 0;
            }
            
            .ant-layout-sider {
              position: fixed;
              left: 0;
              top: 0;
              bottom: 0;
              z-index: 100;
            }
            
            .ant-menu {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-size: 14px;
              line-height: 1.5715;
              list-style: none;
            }
            
            .ant-drawer {
              position: fixed;
              z-index: 1000;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${isStylesLoaded ? 'style-loaded' : 'style-loading'}`}
        style={{
          fontFamily: geistSans.style.fontFamily,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
          overflowX: 'hidden',
          margin: 0,
          padding: 0,
        }}
      >
        <AntdRegistry>
          {isLoginPage ? (
            <div style={{ minHeight: '100vh' }}>
              {children}
            </div>
          ) : (
            <SidebarProvider>
              <div style={{ 
                display: 'flex', 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
              }}>
                <Sidebar />
                <MainContent>
                  <Toaster/>
                  {children}
                  </MainContent>
              </div>
            </SidebarProvider>
          )}
        </AntdRegistry>
      </body>
    </html>
  );
}