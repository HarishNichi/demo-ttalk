'use client';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Input, Select } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import ReusableTable from '@/components/ReusableTable';
import { GroupServices } from '@/services/groupsService';
import { ContactServices } from '@/services/contactsService';
import { ROUTER_NAMES } from '@/constants/routers';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    GroupServices.groupList((response) => {
      if (response?.success) {
        setGroups(response.data);
      }
    });

    ContactServices.contactList((response) => {
      if (response?.success) {
        setContacts(response.data);
      }
      setLoading(false);
    });
  }, []);

  const handleAdd = (newRecord) => {
    GroupServices.groupCreate(newRecord, (response) => {
      if (response?.success) {
        setGroups((prev) => [...prev, response.data]);
      }
    });
  };

  const handleEdit = (editedRecord) => {
    GroupServices.groupUpdate(editedRecord.id, editedRecord, (response) => {
      if (response?.success) {
        setGroups((prev) => prev.map((g) => (g.id === editedRecord.id ? response.data : g)));
      }
    });
  };

  const handleDelete = (recordToDelete) => {
    GroupServices.groupDelete(recordToDelete.id, (response) => {
      if (response?.success) {
        setGroups((prev) => prev.filter((g) => g.id !== recordToDelete.id));
      }
    });
  };

  const columns = [
    {
      title: t('groups.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('groups.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('groups.route'),
      dataIndex: 'vp_route',
      key: 'vp_route',
      sorter: (a, b) => (a.vp_route || '').localeCompare(b.vp_route || ''),
    },
    {
      title: t('groups.contacts'),
      dataIndex: 'contact_ids',
      key: 'contact_ids',
      width: 140,
      align: 'center',
      render: (ids) => (
        <span
          style={{
            background: '#f0f2ff',
            color: '#4f46e5',
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          {(ids || []).length} {t('groups.contactsCount')}
        </span>
      ),
      sorter: (a, b) => (a.contact_ids?.length || 0) - (b.contact_ids?.length || 0),
    },
    {
      title: t('groups.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: t('groups.updatedAt'),
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  const formFields = [
    {
      name: 'name',
      label: t('groups.groupName'),
      rules: [{ required: true, message: t('groups.enterGroupName') }],
      input: <Input placeholder={t('groups.enterGroupName')} />,
    },
    {
      name: 'vp_route',
      label: t('groups.route'),
      rules: [{ required: true, message: t('groups.selectRoute') }],
      input: (
        <Select
          placeholder={t('groups.selectRoute')}
          style={{ width: '100%' }}
          options={ROUTER_NAMES.map((name) => ({ value: name, label: name }))}
        />
      ),
    },
    {
      name: 'contact_ids',
      label: t('groups.contacts'),
      rules: [{ required: true, message: t('groups.selectAtLeastOneContact') }],
      input: (
        <Select
          mode="multiple"
          placeholder={t('groups.selectContactsToAssign')}
          style={{ width: '100%' }}
          options={contacts.map((c) => ({ value: c.id, label: `${c.name}${c.vp_route ? ` (${c.vp_route})` : ''}` }))}
        />
      ),
    },
  ];

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>{t('groups.loadingGroups')}</div>;
  }

  return (
    <div style={{ padding: '24px 0' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: 16,
          padding: '32px',
          marginBottom: '24px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
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
              {t('groups.groupManagement')}
            </Title>
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '16px',
                display: 'block',
                marginTop: '8px',
              }}
            >
              {t('groups.groupManagementDescription')}
            </Text>
          </Col>
          <Col xs={24} md={4}>
            <Card
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: 12,
              }}
            >
              <Statistic
                title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('groups.totalGroups')}</span>}
                value={groups.length}
                valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 600 }}
              />
            </Card>
          </Col>
          <Col xs={24} md={4}>
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
              />
            </Card>
          </Col>
        </Row>
      </div>

      <ReusableTable
        columns={columns}
        data={groups}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        showDelete={false}
        title={t('groups.groupDirectory')}
        addButtonText={t('groups.addNewGroup')}
        searchPlaceholder={t('groups.searchGroupsPlaceholder')}
        formFields={formFields}
        tableStyle={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
        headerStyle={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '16px',
          borderRadius: '12px 12px 0 0',
        }}
      />
    </div>
  );
};

export default GroupsPage;