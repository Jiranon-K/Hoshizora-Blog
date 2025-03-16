'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CategoryFilter({ categories, currentCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value) {
      router.push(`/blog?category=${value}`);
    } else {
      router.push('/blog');
    }
  };

  
  if (!isClient) {
    return (
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <div className="w-full md:w-auto">
          <div className="select select-bordered w-full md:w-64 opacity-50">
            กำลังโหลด...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-4">
      <div className="w-full md:w-auto">
        <select 
          value={currentCategory}
          onChange={handleCategoryChange}
          className="select select-bordered w-full md:w-64"
        >
          <option value="">บทความล่าสุดทั้งหมด</option>
          {categories.map(cat => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name} ({cat.postCount})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}