'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, Row, Col, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  const onFinish = async (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (values.username === 'admin' && values.password === 'password') {
        message.success(t('login.success'));
        router.push('/contacts');
      } else {
        message.error(t('login.invalidCredentials'));
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Row gutter={[32, 0]} style={{ width: '100%', maxWidth: '1200px' }}>
        {/* Left side - Branding */}
        <Col xs={24} md={12} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '40px 20px'
        }}>
          <div style={{ 
            animation: 'fadeInUp 0.8s ease-out',
            marginBottom: 32
          }}>
            <Title level={1} style={{ 
              color: 'white', 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              marginBottom: 16,
              fontWeight: 700
            }}>
              {t('login.adminPanel')}
            </Title>
            <Text style={{ 
              color: 'rgba(255,255,255,0.9)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 1.6
            }}>
              {t('login.adminPanelDescription')}
            </Text>
          </div>
          
          <div style={{
            display: 'flex',
            gap: 16,
            marginTop: 32,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '16px 24px',
              borderRadius: 12,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Text style={{ color: 'white', fontSize: 14 }}>{t('login.contactManagement')}</Text>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '16px 24px',
              borderRadius: 12,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Text style={{ color: 'white', fontSize: 14 }}>{t('login.groupOrganization')}</Text>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '16px 24px',
              borderRadius: 12,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Text style={{ color: 'white', fontSize: 14 }}>{t('login.routerManagement')}</Text>
            </div>
          </div>
        </Col>

        {/* Right side - Login Form */}
        <Col xs={24} md={12}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}>
            <Card style={{ 
              width: '100%', 
              maxWidth: 400,
              borderRadius: 16,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              animation: 'fadeInUp 0.8s ease-out 0.2s both'
            }}>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <Title level={2} style={{ 
                  color: '#1a1a1a',
                  marginBottom: 8,
                  fontWeight: 700
                }}>
                  {t('login.welcomeBack')}
                </Title>
                <Text type="secondary" style={{ fontSize: 16 }}>
                  {t('login.pleaseLogin')}
                </Text>
              </div>

              <Form
                form={form}
                name="login"
                onFinish={onFinish}
                autoComplete="off"
                layout="vertical"
                size="large"
              >
                <Form.Item
                  label={t('login.username')}
                  name="username"
                  rules={[{ 
                    required: true, 
                    message: t('login.usernameRequired')
                  }]}
                >
                  <Input 
                    placeholder={t('login.enterUsername')}
                    prefix={<UserOutlined style={{ color: '#ccc' }} />}
                  />
                </Form.Item>

                <Form.Item
                  label={t('login.password')}
                  name="password"
                  rules={[{ 
                    required: true, 
                    message: t('login.passwordRequired')
                  }]}
                >
                  <Input.Password 
                    placeholder={t('login.enterPassword')}
                  />
                </Form.Item>

                <Form.Item>
                  <Checkbox>{t('login.rememberMe')}</Checkbox>
                </Form.Item>

                <Form.Item style={{ marginBottom: 8 }}>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading} 
                    block
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      height: 48,
                      fontWeight: 600
                    }}
                  >
                    {loading ? t('login.loggingIn') : t('login.loginButton')}
                  </Button>
                </Form.Item>

                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    {t('login.demoCredentials')}
                  </Text>
                </div>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;