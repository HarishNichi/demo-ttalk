'use client';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Radio, Select, Button, Space, Input, message, Statistic } from 'antd';
import { BellOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { ContactServices } from '@/services/contactsService';
import { GroupServices } from '@/services/groupsService';
import { ROUTER_NAMES } from '@/constants/routers';
import { useTranslation } from 'react-i18next';
import { notificationManagementServices } from '@/services/notificationManagementService';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const NotificationManagementPage = () => {
  const [notificationType, setNotificationType] = useState('individual');
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [fcmToken, setFcmToken] = useState('');
  const [vpRoute, setVpRoute] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [voicePingRouterUrl, setVoicePingRouterUrl] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [totalContacts, setTotalContacts] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const { t } = useTranslation();
  function fetchData() {
     ContactServices.contactList((response) => {
      if (response.success) {
        setContacts(response.data);
        setTotalContacts(response.data.length);
      }
    });

    GroupServices.groupList((response) => {
      if (response.success) {
        setGroups(response.data);
        setTotalGroups(response.data.length);
      }
    });
  }
  useEffect(() => {
   fetchData()
  }, []);



  const handleContactChange = (value) => {
    setSelectedContact(value);
    const contact = contacts.find(c => c.id === value);
    if (contact) {
      setFcmToken(contact.fcm_token || '');
      setVpRoute(contact.vp_route || null);
    } else {
      setFcmToken('');
      setVpRoute(null);
    }
  };

  const handleGroupChange = (value) => {
    setSelectedGroup(value);
    const group = groups.find(g => g.id === value);
    if (group) {
      setVoicePingRouterUrl(group.vp_route || null);
    } else {
      setVoicePingRouterUrl(null);
    }
  };
  const getGroupMembers = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (group && group.contact_ids) {
      // Assuming group.contacts now contains contact IDs, we need to fetch full contact objects
      // For simplicity, we'll filter from the already loaded 'contacts' state
      const groupContactIds = group.contact_ids || []; // Assuming group.contact_ids is an array of contact IDs
      return contacts.filter(contact => groupContactIds.includes(contact.id));
      // return contacts.filter(contact => groupContactIds.includes(contact.id) && contact.fcm_token);
    }
    return [];
  };

  const handleSendNotification = () => {
    // Implement notification sending logic here
    let group_fcm_tokens = [];
    if (notificationType === 'group') {
      group_fcm_tokens = getGroupMembers(selectedGroup).map(contact => (contact.fcm_token || '')).filter(token => token !== '');
    }
    let payload = {
      notification_type: notificationType,
      fcm_tokens: notificationType === 'group' ? group_fcm_tokens : fcmToken?[fcmToken]:[],
      vp_route: notificationType === 'group' ? voicePingRouterUrl : vpRoute,
    }
    if (notificationType === 'individual') {
      payload.userId = selectedContact;
    }
    else {
      payload.groupId = selectedGroup;
    }
        notificationManagementServices.sendNotification(payload, (response) => {
          console.log(response);
          if (response?.data.success) {
            toast.success(t('notificationManagement.notificationSentSuccess'),{position:'top-right'});
          }
        })
    
        // Reset selections
        setSelectedContact(null);
        setSelectedGroup(null);
        setVoicePingRouterUrl(null);
        setNotificationMessage('');
        setVpRoute(null);
        setFcmToken('');
         // Also reset selected group when initiating a call
        fetchData();
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 16,
          padding: '32px',
          marginBottom: '24px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <Title
              level={1}
              style={{
                color: 'white',
                margin: 0,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
              }}
            >
              {t('notificationManagement.title')}
            </Title>
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '16px',
                display: 'block',
                marginTop: '8px',
              }}
            >
              {t('notificationManagement.description')}
            </Text>
          </Col>
          <Col xs={24} md={8}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 12,
                  }}
                >
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('notificationManagement.totalContacts')}</span>}
                    value={totalContacts}
                    valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 600 }}
                    prefix={<UserOutlined style={{ color: 'white' }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12}>
                <Card
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 12,
                  }}
                >
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('notificationManagement.totalGroups')}</span>}
                    value={totalGroups}
                    valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 600 }}
                    prefix={<TeamOutlined style={{ color: 'white' }} />}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Radio.Group
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            style={{ marginBottom: '24px' }}
          >
            <Radio.Button value="individual" style={{ textAlign: 'center' }}>
              <UserOutlined /> {t('notificationManagement.individualNotification')}
            </Radio.Button>
            <Radio.Button value="group" style={{ textAlign: 'center' }}>
              <TeamOutlined /> {t('notificationManagement.groupNotification')}
            </Radio.Button>
          </Radio.Group>
        </div>

        {notificationType === 'individual' && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
           
            <Text strong>{t('notificationManagement.contactsDropdown')}</Text>
            <Select
              showSearch
              placeholder={t('notificationManagement.selectContact')}
              optionFilterProp="children"
              onChange={handleContactChange}
              value={selectedContact}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={contacts.map(contact => ({
                value: contact.id,
                label: `${contact.name} (${contact.id})`,
              }))}
              style={{ width: '100%' }}
            />
            <Text strong>{t('notificationManagement.fcmTokenInput')}</Text>
            <Input
              placeholder={t('notificationManagement.fcmTokenPlaceholder')}
              value={fcmToken}
              onChange={(e) => setFcmToken(e.target.value)}
              style={{ width: '100%' }}
            />
            <Text strong>{t('notificationManagement.vpRouteDropdown')}</Text>
            <Select
              placeholder={t('notificationManagement.vpRoutePlaceholder')}
              value={vpRoute}
              onChange={(value) => setVpRoute(value)}
              style={{ width: '100%' }}
            >
              {ROUTER_NAMES.map(route => (
                <Option key={route} value={route}>{route}</Option>
              ))}
            </Select>
          </Space>
        )}

        {notificationType === 'group' && (
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
           
            <Text strong>{t('notificationManagement.groupDropdown')}</Text>
            <Select
              showSearch
              placeholder={t('notificationManagement.selectGroup')}
              optionFilterProp="children"
              onChange={handleGroupChange}
              value={selectedGroup}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={groups.map(group => ({
                value: group.id,
                label: group.name,
              }))}
              style={{ width: '100%' }}
            />
            <Text strong>{t('notificationManagement.voicePingRouterUrlDropdown')}</Text>
            <Select
              placeholder={t('notificationManagement.selectVoicePingRouterUrl')}
              value={voicePingRouterUrl}
              onChange={(value) => setVoicePingRouterUrl(value)}
              style={{ width: '100%' }}
            >
              {ROUTER_NAMES.map(route => (
                <Option key={route} value={route}>{route}</Option>
              ))}
            </Select>
          </Space>
        )}

         <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            type="primary"
            size="large"
            icon={<BellOutlined />}
            onClick={handleSendNotification}
            disabled={(notificationType === 'individual' && !selectedContact) || (notificationType === 'group' && !selectedGroup)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '0 32px',
              height: '48px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }}
          >
            {t('notificationManagement.sendNotification')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotificationManagementPage;