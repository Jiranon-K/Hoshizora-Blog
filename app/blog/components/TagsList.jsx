import React from 'react';

export default function TagsList({ tags }) {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-2">Tags:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag.slug} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm cursor-default">
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}