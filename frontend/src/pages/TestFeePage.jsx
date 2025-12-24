import React from 'react';

const TestFeePage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Fee System Test Page</h1>
      <p className="text-lg">If you can see this, the route is working!</p>
      <div className="mt-4 p-4 bg-green-100 border border-green-500 rounded">
        <p className="font-semibold">✓ Route successfully loaded</p>
        <p>Base URL from env: {import.meta.env.VITE_BASE_URL}</p>
      </div>
    </div>
  );
};

export default TestFeePage;
