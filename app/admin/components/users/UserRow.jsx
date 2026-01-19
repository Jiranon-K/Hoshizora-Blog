'use client';

import React from 'react';
import { getImageUrl } from '@/lib/helpers';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';

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

  const getRoleStyle = (role) => {
    switch(role) {
      case 'admin': return 'bg-white text-black border-white';
      case 'editor': return 'bg-zinc-800 text-white border-zinc-700';
      default: return 'bg-zinc-900 text-zinc-400 border-zinc-800';
    }
  };

  return (
    <tr className="hover:bg-zinc-900/50 transition-colors border-b border-zinc-800 text-sm">
      <td className="p-4 font-mono text-zinc-500">{user.id}</td>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800">
            <img 
              src={getImageUrl(user.avatar)} 
              alt={user.display_name} 
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/avatar/default.webp' }}
            />
          </div>
          <div className="font-light text-white">{user.display_name}</div>
        </div>
      </td>
      <td className="p-4 text-zinc-400 font-light">{user.username}</td>
      <td className="p-4 text-zinc-400 font-light">{user.email}</td>
      <td className="p-4 text-zinc-500 font-light">{user.title || '-'}</td>
      <td className="p-4">
        <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${getRoleStyle(user.role)}`}>
          {user.role}
        </span>
      </td>
      <td className="p-4 text-zinc-500 font-light">{formatDate(user.created_at)}</td>
      <td className="p-4">
        <div className="flex gap-2">
          <button 
            onClick={onEdit} 
            className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700"
            title="Edit"
          >
            <FiEdit3 size={16} />
          </button>
          <button 
            onClick={onDelete} 
            className="p-2 rounded-md hover:bg-red-900/20 text-zinc-400 hover:text-red-400 transition-colors border border-transparent hover:border-red-900/50"
            disabled={user.role === 'admin'}
            title={user.role === 'admin' ? 'Cannot delete Admin' : 'Delete'}
          >
            <FiTrash2 size={16} className={user.role === 'admin' ? "opacity-30" : ""} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;