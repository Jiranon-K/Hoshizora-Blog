import React from 'react';
import PostTableRow from './PostTableRow';

export default function PostsTable({ 
  posts, 
  getCategoryName, 
  getStatusText, 
  getStatusColor, 
  onDeleteClick 
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-neutral text-neutral-content">
            <th className="w-14">ID</th>
            <th>หัวข้อ</th>
            <th>หมวดหมู่</th>
            <th>สถานะ</th>
            <th>ยอดเข้าชม</th>
            <th>วันที่สร้าง</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostTableRow 
                key={post.id} 
                post={post} 
                getCategoryName={getCategoryName} 
                getStatusText={getStatusText} 
                getStatusColor={getStatusColor} 
                onDeleteClick={onDeleteClick} 
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">ไม่พบบทความ</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}