'use client';

import React from 'react';
import { Requirement } from '@/types';
import { CheckCircle, AlertTriangle, Info, Shield, Zap, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequirementsListProps {
  requirements: Requirement[];
  onEdit?: (requirement: Requirement) => void;
  onDelete?: (id: string) => void;
  highlightedIds?: Set<string>;
  className?: string;
}

export function RequirementsList({ 
  requirements, 
  onEdit, 
  onDelete,
  highlightedIds = new Set(),
  className 
}: RequirementsListProps) {
  const getCategoryIcon = (category: Requirement['category']) => {
    switch (category) {
      case 'functional':
        return <CheckCircle className="w-4 h-4" />;
      case 'performance':
        return <Zap className="w-4 h-4" />;
      case 'interface':
        return <Info className="w-4 h-4" />;
      case 'safety':
        return <AlertTriangle className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: Requirement['category']) => {
    switch (category) {
      case 'functional':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'performance':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'interface':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'safety':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'security':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: Requirement['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority];
  };

  if (requirements.length === 0) {
    return (
      <div className={cn('p-8 text-center bg-gray-50 rounded-lg', className)}>
        <p className="text-gray-500">No requirements generated yet.</p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {requirements.map((req) => {
        const isHighlighted = highlightedIds.has(req.id);
        
        return (
          <div
            key={req.id}
            className={cn(
              'p-4 border rounded-lg transition-all',
              isHighlighted ? 'border-yellow-400 bg-yellow-50 shadow-md' : 'border-gray-200 bg-white',
              'hover:shadow-sm'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={cn('p-1 rounded border', getCategoryColor(req.category))}>
                    {getCategoryIcon(req.category)}
                  </div>
                  <span className="font-mono text-sm text-gray-600">{req.id}</span>
                  <span className={cn(
                    'px-2 py-0.5 text-xs font-medium rounded-full',
                    getPriorityBadge(req.priority)
                  )}>
                    {req.priority.toUpperCase()}
                  </span>
                  {req.testable && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      Testable
                    </span>
                  )}
                  {req.version > 1 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      v{req.version}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-900 mb-2">{req.description}</p>
                
                {req.relatedModules.length > 0 && (
                  <div className="flex items-center flex-wrap gap-1 mt-2">
                    <span className="text-xs text-gray-500">Modules:</span>
                    {req.relatedModules.map((module) => (
                      <span
                        key={module}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              {(onEdit || onDelete) && (
                <div className="flex items-center space-x-1 ml-4">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(req)}
                      className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit requirement"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(req.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
