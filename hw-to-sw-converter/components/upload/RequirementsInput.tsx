'use client';

import React, { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequirementsInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RequirementsInput({ value, onChange, className }: RequirementsInputProps) {
  const [charCount, setCharCount] = useState(value.length);
  const maxChars = 10000;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxChars) {
      onChange(newValue);
      setCharCount(newValue.length);
    }
  };

  const placeholderText = `Enter system requirements here. For example:

• The system shall support real-time data processing from multiple sensors
• The GPS module shall provide location updates at 1Hz frequency
• The system shall maintain connectivity via GSM/LTE networks
• Audio processing shall support noise cancellation
• The camera interface shall capture images at 2MP resolution
• Power management shall optimize battery life for 8+ hours operation
• The system shall boot within 30 seconds
• All communication interfaces shall be encrypted`;

  return (
    <div className={cn('w-full', className)}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="requirements" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4" />
            <span>System Requirements</span>
          </label>
          <span className={cn(
            'text-xs',
            charCount > maxChars * 0.9 ? 'text-orange-600' : 'text-gray-500'
          )}>
            {charCount} / {maxChars}
          </span>
        </div>

        <div className="relative">
          <textarea
            id="requirements"
            value={value}
            onChange={handleChange}
            placeholder={placeholderText}
            className={cn(
              'w-full min-h-[200px] p-4 border rounded-lg resize-y',
              'text-sm text-gray-900 placeholder-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'transition-colors',
              charCount > maxChars * 0.9 && 'border-orange-500'
            )}
            rows={8}
          />
        </div>

        {value.length === 0 && (
          <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">Tips for better results:</p>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                <li>Be specific about performance requirements</li>
                <li>Include interface and communication protocols</li>
                <li>Mention safety and security requirements</li>
                <li>Specify any real-time constraints</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
