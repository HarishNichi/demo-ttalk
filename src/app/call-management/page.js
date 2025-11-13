'use client';
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Radio, Select, Button, Space, message, Statistic } from 'antd';
import { PhoneOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { ContactServices } from '@/services/contactsService';
import { GroupServices } from '@/services/groupsService';
import { CallManagementServices } from '@/services/callManagementService';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;
const { Option } = Select;

const CallManagementPage = () => {
  const [callType, setCallType] = useState('private_call'); // 'contact' or 'group'
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [senderContact, setSenderContact] = useState(null);
  const [senderVp_Route, setSenderVp_Route] = useState(null);
  const [receiverContact, setReceiverContact] = useState(null);
  const [totalContactsWithFcm, setTotalContactsWithFcm] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadContacts = () => {
    ContactServices.contactList((response) => {
      if (response.success) {
        const fcmContacts = response.data.filter(contact => contact.fcm_token);
        setContacts(fcmContacts);
        setTotalContactsWithFcm(fcmContacts.length);
      }
    });
  };

  const loadGroups = () => {
    GroupServices.groupList((response) => {
      if (response.success) {
        setGroups(response.data);
        setTotalGroups(response.data.length);
      }
    });
  };

  useEffect(() => {
    loadContacts();
    loadGroups();
  }, []);



  const getGroupMembers = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    console.log('group', group);
    if (group && group.contact_ids) {
      // Assuming group.contacts now contains contact IDs, we need to fetch full contact objects
      // For simplicity, we'll filter from the already loaded 'contacts' state
      const groupContactIds = group.contact_ids || []; // Assuming group.contact_ids is an array of contact IDs
      console.log('groupContactIds', groupContactIds);
      console.log('contacts', contacts);
      return contacts.filter(contact => groupContactIds.includes(contact.id));
      // return contacts.filter(contact => groupContactIds.includes(contact.id) && contact.fcm_token);
    }
    return [];
  };

  const initiateCall = () => {
    let route = null;
    const selectedContact = contacts.find(c => c.id === senderContact);
    if (selectedContact && selectedContact.vp_route) {
      route = selectedContact.vp_route;
    } else {
      route = null;
    }
    let group_contact_ids = [];
    if (selectedGroup) {
      group_contact_ids = getGroupMembers(selectedGroup).map(contact => (contact.id))
    }
    // remove senderContact.id if present
    if (senderContact && group_contact_ids.includes(senderContact)) {
        group_contact_ids = group_contact_ids.filter(id => id !== senderContact);
    } 


        // Extract user IDs and metadata from the selected contacts/groups
    const fromUserId = senderContact; // Receiver contact ID
    const toUserIds = selectedGroup ? group_contact_ids : [receiverContact]; // Group contact IDs or single receiver ID
    const vp_route = route;  // Use the managed senderVp_Route state

    const payload = {
      fromUserId,
      toUserIds,
      vp_route,
      callType
    };

    CallManagementServices.initiateCall(payload, (response) => {
      if (response.data.success) {
        toast.success('Call initiated successfully!',{position:'top-right'});
      }
    })

    // Reset selections
    setSenderContact(null);
    setReceiverContact(null);
    setSelectedGroup(null); // Also reset selected group when initiating a call
    loadContacts();
    loadGroups();

    // Additional logic for removing sender from group call if selected
    if (selectedGroup) {
      let group_contact_ids = getGroupMembers(selectedGroup).map(contact => (contact.id));
      if (senderContact && group_contact_ids.includes(senderContact)) {
        group_contact_ids = group_contact_ids.filter(id => id !== senderContact);
      }
      setToUserIds(group_contact_ids);
    }

  };

  const contactOptions = contacts.map(contact => ({
    label: `${contact.id} ${contact.name} (${contact.vp_route})`, // Display name and VP route
    value: contact.id, // Store the contact ID
    key: contact.id
  }));

  const availableSenders = contactOptions;

  const availableReceivers = callType === 'private_call'
    ? contactOptions.filter(option => option.value !== senderContact)
    : (selectedGroup ? groups.filter(group => group.id === selectedGroup).map(group => ({
       label: group.name, // Display group name
       value: group.id, // Value is the group ID
       key: group.id
     })) : []);

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
              Call Management
            </Title>
            <Text
              style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: '16px',
                display: 'block',
                marginTop: '8px',
              }}
            >
              Manage voice calls between contacts and groups
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
                    title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>FCM Contacts </span>}
                    value={totalContactsWithFcm}
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
                    title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Groups</span>}
                    value={totalGroups}
                    valueStyle={{ color: 'white', fontSize: '24px', fontWeight: 600 }}
                    prefix={<UserOutlined style={{ color: 'white' }} />}
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
            value={callType}
            onChange={(e) => {
              setCallType(e.target.value);
              setSelectedGroup(null);
              setSenderContact(null);
              setReceiverContact(null);
            }}
            style={{ marginBottom: '24px' }}
          >
            <Radio.Button value="private_call" style={{ textAlign: 'center' }}>
              <UserOutlined /> Contact Call Management
            </Radio.Button>
            <Radio.Button value="group_call" style={{ textAlign: 'center' }}>
              <TeamOutlined /> Group Call Management
            </Radio.Button>
          </Radio.Group>
        </div>

        {callType === 'group_call' && (
          <div style={{ marginBottom: '24px' }}>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Select Group:
            </Text>
            <Select
              style={{ width: '100%', maxWidth: '400px' }}
              placeholder="Choose a group"
              value={selectedGroup}
              onChange={(value) => {
                setSelectedGroup(value);
                setSenderContact(null);
                setReceiverContact(null);
              }}
            >
              {groups.map(group => (
                <Option key={group.id} value={group.id}>
                  {group.name}
                </Option>
              ))}
            </Select>
          </div>
        )}

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <Text strong>Sender</Text>
                </Space>
              }
              style={{ height: '100%' }}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Select sender"
                value={senderContact}
                onChange={setSenderContact}
                disabled={callType === 'group_call' && !selectedGroup}
              >
                {(callType === 'private_call' ? contactOptions :
                  (selectedGroup ? getGroupMembers(selectedGroup).map(contact => ({
                    label: `${contact.id} ${contact.name} (${contact.vp_route})`,
                    value: contact.id,
                    key: contact.id
                  })) : [])).map(option => (
                    <Option key={option.key} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
              </Select>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  <Text strong>Receiver</Text>
                </Space>
              }
              style={{ height: '100%' }}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="Select receiver"
                value={receiverContact}
                onChange={setReceiverContact}
                disabled={!senderContact || (callType === 'group_call' && !selectedGroup)}
              >
                {availableReceivers.map(option => (
                  <Option key={option.key} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Card>
          </Col>
        </Row>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            type="primary"
            size="large"
            icon={<PhoneOutlined />}
            onClick={initiateCall}
            disabled={!senderContact || !receiverContact}
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
            {callType === 'private_call' ? 'Initiate Call' : 'Start Group Call'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CallManagementPage;