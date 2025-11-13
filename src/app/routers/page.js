'use client';
import React, { useState } from 'react';
import ReusableTable from '@/components/ReusableTable';
import { ROUTER_NAMES } from '@/constants/routers';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const initialRouters = [
  { id: 1, name: 'Main Router', ip: '192.168.1.1' },
  { id: 2, name: 'Guest Router', ip: '192.168.2.1' },
];

const RoutersPage = () => {
  const [routers, setRouters] = useState(initialRouters);
  const { t } = useTranslation();
  const routerData = ROUTER_NAMES.map((name, idx) => ({ id: idx + 1, name }));
  const columns = [
    { title: t('routers.id'), dataIndex: 'id', key: 'id', width: 80 },
    { title: t('routers.name'), dataIndex: 'name', key: 'name' },
  ];

  const handleAdd = (newRecord) => {
    const newId = routers.length > 0 ? Math.max(...routers.map(r => r.id)) + 1 : 1;
    setRouters([...routers, { ...newRecord, id: newId }]);
  };

  const handleEdit = (editedRecord) => {
    setRouters(routers.map(r => r.id === editedRecord.id ? editedRecord : r));
  };

  const handleDelete = (recordToDelete) => {
    setRouters(routers.filter(r => r.id !== recordToDelete.id));
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
          borderRadius: 16,
          padding: '32px',
          marginBottom: '24px',
          color: 'white',
          boxShadow: '0 8px 32px rgba(79, 70, 229, 0.3)',
        }}
      >
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={16}>
            <Typography.Title
              level={1}
              style={{
                color: 'white',
                margin: 0,
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 700,
              }}
            >
              {t('routers.routerManagement')}
            </Typography.Title>
            <Typography.Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '16px',
                display: 'block',
                marginTop: '8px',
              }}
            >
              {t('routers.routerManagementDescription')}
            </Typography.Text>
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
                title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>{t('routers.totalRouters')}</span>}
                value={routerData.length}
                prefix={<WifiOutlined style={{ color: 'white', fontSize: 20 }} />}
                valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 600 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div style={{ marginTop: 24 }}>
        <ReusableTable
          columns={columns}
          data={routerData}
          showAdd={false}
          showEdit={false}
          showDelete={false}
          showSearch={false}
          title={t('routers.routerDirectory')}
          addButtonText={t('routers.addNewRouter')}
          searchPlaceholder={t('routers.searchRoutersPlaceholder')}
        />
      </div>
    </div>
  );
};

export default RoutersPage;