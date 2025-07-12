// src/components/common/DemoModeBanner.jsx
import React, { useState } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DemoModeBanner = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if Supabase is properly configured
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isConfigured = supabaseUrl && supabaseAnonKey;

  // Don't show banner if properly configured or dismissed
  if (isConfigured || isDismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 relative">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <strong>Demo Mode:</strong> VukaLink is running without database configuration. 
            <span className="font-medium"> Authentication and data features are disabled.</span>
          </p>
          <div className="mt-2 text-sm text-yellow-600">
            <p>
              To enable full functionality:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Set up a Supabase project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-800">supabase.com</a></li>
              <li>Add environment variables: <code className="bg-yellow-100 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="bg-yellow-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
              <li>Redeploy the application</li>
            </ul>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoModeBanner;