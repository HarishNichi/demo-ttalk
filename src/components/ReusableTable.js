'use client';
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Typography, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Title } = Typography;

const ReusableTable = ({ columns, data, onAdd, onEdit, onDelete, title, addButtonText, searchPlaceholder, formFields, showAdd = true, showEdit = true, showDelete = true, showSearch = true }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const { t } = useTranslation();

  const showModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (editingRecord) {
        onEdit({ ...editingRecord, ...values });
      } else {
        onAdd(values);
      }
      handleCancel();
    });
  };

  const handleDelete = (record) => {
    onDelete(record);
  };

  const tableColumns = [
    ...columns,
    showEdit ? {
      title: t('action'),
      key: 'action',
      render: (_, record) => (
        <span>
          {showEdit && <Button type="link" onClick={() => showModal(record)}>{t('edit')}</Button>}
          {showDelete && <Popconfirm title={t('confirmDeletion')} onConfirm={() => handleDelete(record)}><Button type="link" danger>{t('delete')}</Button></Popconfirm>}
        </span>
      ),
    } : null,
  ].filter(Boolean);

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }} align="middle">
        <Col xs={24} sm={12}>
          {title && <Title level={2} style={{ margin: 0 }}>{title}</Title>}
        </Col>
        <Col xs={24} sm={12}>
          <Row gutter={8} justify="end">
            <Col flex="auto">
              {showSearch && (
                <Search
                  placeholder={searchPlaceholder || t('searchPlaceholder')}
                  allowClear
                  onSearch={setSearchText}
                  style={{ width: '100%' }}
                />
              )}
            </Col>
            <Col>
              {showAdd && <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>{addButtonText || t('add')}</Button>}
            </Col>
          </Row>
        </Col>
      </Row>
      
      <Table 
        columns={tableColumns} 
        dataSource={filteredData} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />
      
      <Modal
        title={
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#4A4A4A',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '16px',
            borderRadius: '12px 12px 0 0',
            color: 'white',
            textAlign: 'center',
          }}>
            {editingRecord ? t('editRecord') : t('addRecord')}
          </div>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        width={500}
        style={{
          padding: '24px',
          textAlign: 'left', // Change modal content alignment to left
        }}
        okText={<span style={{ fontWeight: 'bold', color: 'white' }}>{t('ok')}</span>}
        okButtonProps={{
          style: {
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            borderRadius: '8px',
            width: '100px',
          },
        }}
        cancelText={<span style={{ fontWeight: 'bold', color: '#595959' }}>{t('cancel')}</span>}
        cancelButtonProps={{
          style: {
            borderRadius: '8px',
            width: '100px',
          },
        }}
        closeIcon={
          <span
            style={{
              fontSize: '20px',
              color: 'white',
            }}
          >
            <CloseOutlined />
          </span>
        }
      >
        <Form form={form} layout="vertical" style={{ textAlign: 'left' }}>
          {formFields && formFields.length > 0 ? (
            formFields.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={<span style={{ textAlign: 'left', display: 'block' }}>{field.label}</span>}
                rules={field.rules || [{ required: true, message: t('pleaseInput', { field: field.label }) }]}
                style={{ textAlign: 'left' }}
                validateStatus={form.getFieldError(field.name).length ? 'error' : ''}
                help={form.getFieldError(field.name).length ? <span style={{ textAlign: 'left', display: 'block' }}>{form.getFieldError(field.name)[0]}</span> : null}
              >
                {field.input || <Input placeholder={t('enterField', { field: field.label.toLowerCase() })} style={{ textAlign: 'left' }} />}
              </Form.Item>
            ))
          ) : (
            columns.map((col) => (
              <Form.Item
                key={col.dataIndex}
                name={col.dataIndex}
                label={<span style={{ textAlign: 'left', display: 'block' }}>{col.title}</span>}
                rules={[{ required: true, message: t('pleaseInput', { field: col.title }) }]}
                style={{ textAlign: 'left' }}
                validateStatus={form.getFieldError(col.dataIndex).length ? 'error' : ''}
                help={form.getFieldError(col.dataIndex).length ? <span style={{ textAlign: 'left', display: 'block' }}>{form.getFieldError(col.dataIndex)[0]}</span> : null}
              >
                <Input style={{ textAlign: 'left' }} />
              </Form.Item>
            ))
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ReusableTable;