import React from 'react';
import Link from 'next/link';

export default function PostTableRow({ 
  post, 
  getCategoryName, 
  getStatusText, 
  getStatusColor, 
  onDeleteClick 
}) {
  return (
    <tr>
      <td>{post.id}</td>
      <td>
        <div className="flex flex-col">
          <span className="font-medium">{post.title}</span>
          <span className="text-xs text-gray-500">{post.slug}</span>
        </div>
      </td>
      <td>{getCategoryName(post.category_id)}</td>
      <td>
        <div className={`badge ${getStatusColor(post.status)}`}>
          {getStatusText(post.status)}
        </div>
      </td>
      <td>{post.views}</td>
      <td>{new Date(post.created_at).toLocaleDateString('th-TH')}</td>
      <td>
        <div className="flex gap-2">
          <Link 
            href={`/admin/posts/edit/${post.id}`} 
            className="btn btn-sm btn-neutral"
          >
            แก้ไข
          </Link>
          <button 
            className="btn btn-sm btn-error"
            onClick={() => onDeleteClick(post.id)}
          >
            ลบ
          </button>
        </div>
      </td>
    </tr>
  );
}