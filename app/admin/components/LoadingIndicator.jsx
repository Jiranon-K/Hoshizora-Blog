import React from 'react';

export default function LoadingIndicator() {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <span className="loading loading-spinner loading-lg text-white"></span>
    </div>
  );
}