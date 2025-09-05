'use client';

import React, { useState, useEffect } from 'react';
import { X, Code, FileCode, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { SoftwareModule, Requirement, GeneratedAPI, ProgrammingLanguage } from '@/types';
import { cn } from '@/lib/utils';

interface BlockDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  module: SoftwareModule | null;
  requirements: Requirement[];
  onGenerateAPI: (moduleId: string, language: ProgrammingLanguage) => Promise<GeneratedAPI>;
}

export function BlockDetailsPanel({
  isOpen,
  onClose,
  module,
  requirements,
  onGenerateAPI,
}: BlockDetailsPanelProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('typescript');
  const [generatedAPI, setGeneratedAPI] = useState<GeneratedAPI | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    api: true,
    requirements: false,
  });

  useEffect(() => {
    // Reset when module changes
    setGeneratedAPI(null);
    setExpandedSections({
      overview: true,
      api: true,
      requirements: false,
    });
  }, [module]);

  if (!isOpen || !module) return null;

  const relatedRequirements = requirements.filter(req =>
    req.relatedModules.includes(module.id)
  );

  const handleGenerateAPI = async () => {
    setIsGenerating(true);
    try {
      const api = await onGenerateAPI(module.id, selectedLanguage);
      setGeneratedAPI(api);
    } catch (error) {
      console.error('Failed to generate API:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAPI = () => {
    if (generatedAPI) {
      navigator.clipboard.writeText(generatedAPI.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getLayerColor = (layer: SoftwareModule['layer']) => {
    const colors = {
      application: 'bg-blue-100 text-blue-800',
      service: 'bg-purple-100 text-purple-800',
      middleware: 'bg-cyan-100 text-cyan-800',
      driver: 'bg-orange-100 text-orange-800',
      hal: 'bg-green-100 text-green-800',
      kernel: 'bg-pink-100 text-pink-800',
    };
    return colors[layer] || 'bg-gray-100 text-gray-800';
  };

  const getLanguageIcon = (lang: ProgrammingLanguage) => {
    const icons = {
      typescript: '📘',
      python: '🐍',
      c: '⚙️',
      java: '☕',
    };
    return icons[lang] || '📄';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 transition-opacity z-40',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-[500px] bg-white shadow-2xl transform transition-transform z-50',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{module.name}</h2>
                <span className={cn('inline-block px-2 py-1 rounded-full text-xs font-medium mt-2', getLayerColor(module.layer))}>
                  {module.layer.charAt(0).toUpperCase() + module.layer.slice(1)} Layer
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Overview Section */}
            <div className="border-b">
              <button
                onClick={() => toggleSection('overview')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">Overview</h3>
                {expandedSections.overview ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSections.overview && (
                <div className="px-6 pb-4">
                  {module.description && (
                    <p className="text-gray-600 mb-3">{module.description}</p>
                  )}
                  
                  {module.responsibilities && module.responsibilities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {module.responsibilities.map((resp, idx) => (
                          <li key={idx} className="text-gray-600 text-sm">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {module.dependencies.length > 0 && (
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-700 mb-2">Dependencies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {module.dependencies.map(dep => (
                          <span key={dep} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* API Generation Section */}
            <div className="border-b">
              <button
                onClick={() => toggleSection('api')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">API Interface</h3>
                {expandedSections.api ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSections.api && (
                <div className="px-6 pb-4">
                  {/* Language Selector */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Language
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['typescript', 'python', 'c', 'java'] as ProgrammingLanguage[]).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setSelectedLanguage(lang)}
                          className={cn(
                            'px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
                            selectedLanguage === lang
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          )}
                        >
                          <span className="mr-1">{getLanguageIcon(lang)}</span>
                          {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  {!generatedAPI && (
                    <button
                      onClick={handleGenerateAPI}
                      disabled={isGenerating}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          <span>Generating API...</span>
                        </>
                      ) : (
                        <>
                          <Code className="w-4 h-4" />
                          <span>Generate API</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Generated API Display */}
                  {generatedAPI && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-700">Generated API</h4>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleCopyAPI}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Copy to clipboard"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                          <button
                            onClick={handleGenerateAPI}
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Regenerate"
                          >
                            <FileCode className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-100 font-mono">
                          <code>{generatedAPI.content}</code>
                        </pre>
                      </div>
                      
                      {generatedAPI.examples && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Usage Example</h4>
                          <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-sm text-gray-700 font-mono">
                              <code>{generatedAPI.examples}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Related Requirements Section */}
            <div className="border-b">
              <button
                onClick={() => toggleSection('requirements')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Related Requirements ({relatedRequirements.length})
                </h3>
                {expandedSections.requirements ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {expandedSections.requirements && (
                <div className="px-6 pb-4">
                  {relatedRequirements.length > 0 ? (
                    <div className="space-y-3">
                      {relatedRequirements.map(req => (
                        <div key={req.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <span className={cn(
                              'inline-block px-2 py-1 rounded text-xs font-medium',
                              req.priority === 'high' ? 'bg-red-100 text-red-700' :
                              req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            )}>
                              {req.priority}
                            </span>
                            <span className="text-xs text-gray-500">{req.category}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{req.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No requirements linked to this module.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
