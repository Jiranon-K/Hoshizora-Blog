import React from 'react';
import { getImageUrl } from '@/lib/helpers';

export default function AuthorBox({ author, authorTitle, authorBio, authorAvatar }) {
  return (
    <div className="bg-neutral-950 rounded-lg p-6 mb-8">
      <div className="flex items-start">
        <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
          <img
            src={getImageUrl(authorAvatar)}
            alt={author}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-xl text-amber-400 font-medium">{author}</h3>
          <p className="text-amber-400/70 mb-2">{authorTitle}</p>
          {authorBio && <p className="text-sm text-amber-400/50">{authorBio}</p>}
        </div>
      </div>
    </div>
  );
}