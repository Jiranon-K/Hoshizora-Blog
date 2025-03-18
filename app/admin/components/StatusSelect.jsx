'use client';

import React from 'react';

const StatusSelect = ({ value, onChange }) => {
  return (
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">สถานะ</span>
      </label>
      <select 
        name="status"
        value={value}
        onChange={onChange}
        className="select select-bordered w-full"
      >
        <option value="draft">ฉบับร่าง</option>
        <option value="published">เผยแพร่</option>
        <option value="archived">เก็บถาวร</option>
      </select>
    </div>
  );
};

export default StatusSelect;