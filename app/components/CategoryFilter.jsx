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
          <div className="h-10 w-full md:w-64 bg-zinc-900 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-4">
      <div className="w-full md:w-auto">
        <div className="relative">
          <select 
            value={currentCategory}
            onChange={handleCategoryChange}
            className="appearance-none bg-transparent border-b border-zinc-800 text-white font-light focus:border-white py-2 pl-2 pr-8 w-full md:w-64 outline-none cursor-pointer hover:border-zinc-600 transition-colors"
          >
            <option value="" className="bg-zinc-950 text-zinc-300">All Categories</option>
            {categories.map(cat => (
              <option key={cat.slug} value={cat.slug} className="bg-zinc-950 text-zinc-300">
                {cat.name} ({cat.postCount})
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}