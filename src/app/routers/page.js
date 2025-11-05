'use client';
import React, { useState } from 'react';
import ReusableTable from '@/components/ReusableTable';
import { ROUTER_NAMES } from '@/constants/routers';

const initialRouters = [
  { id: 1, name: 'Main Router', ip: '192.168.1.1' },
  { id: 2, name: 'Guest Router', ip: '192.168.2.1' },
];

const RoutersPage = () => {
  const [routers, setRouters] = useState(initialRouters);
  const routerData = ROUTER_NAMES.map((name, idx) => ({ id: idx + 1, name }));
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Name', dataIndex: 'name', key: 'name' },
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
    <div style={{ padding: '32px', textAlign: 'left' }}>
      <h1 style={{ marginBottom: 24 }}>Routers</h1>
      <ReusableTable
        columns={columns}
        data={routerData}
        showAdd={false}
        showEdit={false}
        showDelete={false}
        showSearch={false}
      />
    </div>
  );
};

export default RoutersPage;