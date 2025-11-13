'use client';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Input, Button, Space, Select, Tooltip } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import ReusableTable from '@/components/ReusableTable';
import { ContactServices } from '@/services/contactsService';
import { Modal } from 'antd';
import { ROUTER_NAMES } from '@/constants/routers';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const formFields = [
    {
      name: 'name',
      label: t('contacts.name'),
      rules: [{ required: true, message: t('contacts.nameRequired') }],
      input: <Input placeholder={t('contacts.enterContactName')} />,
    },
    {
      name: 'vp_route',
      label: t('contacts.route'),
      rules: [{ required: true, message: t('contacts.routeRequired') }],
      input: (
        <Select
          placeholder={t('contacts.selectRoute')}
          style={{ width: '100%' }}
          options={ROUTER_NAMES.map((name) => ({ value: name, label: name }))}
        />
      ),
    },

  ];

  useEffect(() => {
    const loadContacts = () => {
      ContactServices.contactList((response) => {
        if (response.success) {
          setContacts(response.data);
        }
        setLoading(false);
      });
    };

    loadContacts();
  }, []);

  const handleAdd = (newRecord) => {
    ContactServices.contactCreate(newRecord, (response) => {
      if (response.success) {
        setContacts((prev) => [...prev, response.data]);
      }
    });
  };

  const handleEdit = (editedRecord) => {
    ContactServices.contactUpdate(editedRecord.id, editedRecord, (response) => {
      if (response.success) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === editedRecord.id ? response.data : contact
          )
        );
      }
    });
  };

  const handleDelete = (recordToDelete) => {
    Modal.confirm({
      title: <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#4A4A4A' }}>{t('contacts.confirmDeletion')}</div>,
      content: (
        <div style={{ fontSize: '16px', color: '#6B6B6B' }}>
          {t('contacts.deleteContactConfirmation', { contactName: recordToDelete.name })}
        </div>
      ),
      okText: <span style={{ fontWeight: 'bold', color: 'white' }}>{t('contacts.yesDelete')}</span>,
      okButtonProps: {
        style: {
          backgroundColor: '#FF4D4F',
          borderColor: '#FF4D4F',
          borderRadius: '8px',
        },
      },
      cancelText: <span style={{ fontWeight: 'bold', color: '#595959' }}>{t('contacts.cancel')}</span>,
      cancelButtonProps: {
        style: {
          borderRadius: '8px',
        },
      },
      icon: null,
      closeIcon: (
        <span
          style={{
            fontSize: '16px',
            color: '#595959',
            cursor: 'pointer',
          }}
        >
          ✖
        </span>
      ),
      onOk: () => {
        setContacts((prev) => prev.filter((contact) => contact.id !== recordToDelete.id));
      },
    });
  };

  const columns = [
    {
      title: t('contacts.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('contacts.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <Space>
          <UserOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: t('contacts.route'),
      dataIndex: 'vp_route',
      key: 'vp_route',
      sorter: (a, b) => a.vp_route.localeCompare(b.vp_route),
    },
      {
       title: t('contacts.fcmToken'),
       dataIndex: 'fcm_token',
       key: 'fcm_token',
       render: (token) => (
         <Tooltip title={token || ''}> {/* Ensure token is not null for title */}
           {token ? `${token.substring(0, 10)}...` : 'N/A'}
         </Tooltip>
       ),
       sorter: (a, b) => (a.fcm_token || '').localeCompare(b.fcm_token || ''),
     },
    {
      title: t('contacts.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: t('contacts.updatedAt'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
      render: (date) => new Date(date).toLocaleString(),
    },
   
  ];

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>{t('contacts.loadingContacts')}</div>;
  }

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
              {t('contacts.contactManagement')}
            </Title>
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '16px',
                display: 'block',
                marginTop: '8px',
              }}
            >
              {t('contacts.contactManagementDescription')}
            </Text>
          </Col>
          <Col xs={24} md={8}>
            <Card
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 12,
              }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('contacts.totalContacts')}</span>}
                value={contacts.length}
                valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 600 }}
                prefix={<UserOutlined style={{ color: 'white' }} />}
              />
            </Card>
          </Col>
        </Row>
      </div>

      <ReusableTable
        columns={columns}
        data={contacts}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showDelete={false}
        title={t('contacts.contactDirectory')}
        addButtonText={t('contacts.addNewContact')}
        searchPlaceholder={t('contacts.searchContactsPlaceholder')}
        formFields={formFields}
        tableStyle={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
        headerStyle={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px',
          borderRadius: '12px 12px 0 0',
        }}
      />
    </div>
  );
};

export default ContactsPage;