'use client';

import React from 'react';
import { getImageUrl } from '@/lib/helpers';

const UserRow = ({ 
  user, 
  getRoleText,
  getRoleBadgeColor,
  onEdit, 
  onDelete 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <tr>
      <td>{user.id}</td>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <img 
                src={getImageUrl(user.avatar)} 
                alt={user.display_name} 
                onError={(e) => { e.target.src = '/avatar/default.webp' }}
              />
            </div>
          </div>
          <div>
            <div className="font-bold">{user.display_name}</div>
          </div>
        </div>
      </td>
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.title || '-'}</td>
      <td>
        <div className={`badge ${getRoleBadgeColor(user.role)}`}>
          {getRoleText(user.role)}
        </div>
      </td>
      <td>{formatDate(user.created_at)}</td>
      <td>
        <div className="flex gap-2">
          <button 
            onClick={onEdit} 
            className="btn btn-sm btn-neutral"
          >
            แก้ไข
          </button>
          <button 
            onClick={onDelete} 
            className="btn btn-sm btn-error"
            disabled={user.role === 'admin'}
            title={user.role === 'admin' ? 'ไม่สามารถลบผู้ดูแลระบบได้' : ''}
          >
            ลบ
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;