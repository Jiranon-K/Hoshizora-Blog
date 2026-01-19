'use client';

import React from 'react';
import UserRow from './UserRow';

const UserTable = ({ 
  users, 
  getRoleText,
  getRoleBadgeColor,
  onEdit,
  onDelete,
  loading 
}) => {
  if (loading) {
    return (
      <div className="overflow-x-auto border border-zinc-800 bg-zinc-950/50">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-800 bg-black text-xs uppercase tracking-widest text-zinc-500">
              <th className="p-4 w-14 font-medium">ID</th>
              <th className="p-4 font-medium">Display Name</th>
              <th className="p-4 font-medium">Username</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Created</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="8" className="text-center py-12">
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner loading-md text-white"></span>
                  <span className="ml-3 text-zinc-400 font-light">Loading users...</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-zinc-800 bg-zinc-950/50">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-zinc-800 bg-black text-xs uppercase tracking-widest text-zinc-500">
            <th className="p-4 w-14 font-medium">ID</th>
            <th className="p-4 font-medium">Display Name</th>
            <th className="p-4 font-medium">Username</th>
            <th className="p-4 font-medium">Email</th>
            <th className="p-4 font-medium">Title</th>
            <th className="p-4 font-medium">Role</th>
            <th className="p-4 font-medium">Created</th>
            <th className="p-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {users.length > 0 ? (
            users.map((user) => (
              <UserRow 
                key={user.id} 
                user={user} 
                getRoleText={getRoleText}
                getRoleBadgeColor={getRoleBadgeColor}
                onEdit={() => onEdit(user.id)} 
                onDelete={() => onDelete(user.id)} 
              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-12 text-zinc-500 font-light">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;