'use client';

import React from 'react';

const StatusSelect = ({ value, onChange }) => {
  return (
    <div className="form-control w-full">
      <label className="label px-0">
        <span className="label-text text-zinc-400 font-medium">สถานะ</span>
      </label>
      <select 
        name="status"
        value={value}
        onChange={onChange}
        className="select select-bordered w-full bg-zinc-900 border-zinc-800 text-zinc-300 focus:outline-none focus:border-zinc-600 focus:ring-0 rounded-md"
      >
        <option value="draft">Draft (ฉบับร่าง)</option>
        <option value="published">Published (เผยแพร่)</option>
        <option value="archived">Archived (เก็บถาวร)</option>
      </select>
    </div>
  );
};

export default StatusSelect;