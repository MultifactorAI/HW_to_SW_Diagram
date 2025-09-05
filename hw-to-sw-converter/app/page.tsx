'use client';

import React, { useState } from 'react';
import { FileUploader } from '@/components/upload/FileUploader';
import { RequirementsInput } from '@/components/upload/RequirementsInput';
import { MermaidRenderer } from '@/components/diagram/MermaidRenderer';
import { RequirementsList } from '@/components/requirements/RequirementsList';
import { BlockDetailsPanel } from '@/components/diagram/BlockDetailsPanel';
import { 
  AnalysisResult, 
  SoftwareArchitecture, 
  SoftwareModule,
  Requirement,
  DiffResult,
  GeneratedAPI,
  ProgrammingLanguage
} from '@/types';
import { 
  calculateRequirementsDiff, 
  generateDiffSummary 
} from '@/lib/diff-utils';
import { parseMermaidToModules } from '@/lib/mermaid-utils';
import { 
  ArrowRight, 
  Loader2, 
  RefreshCw, 
  GitCompare,
  Cpu,
  FileCode,
  CheckCircle,
  MousePointer
} from 'lucide-react';

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [systemRequirements, setSystemRequirements] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [architecture, setArchitecture] = useState<SoftwareArchitecture | null>(null);
  const [currentRequirements, setCurrentRequirements] = useState<Requirement[]>([]);
  const [previousRequirements, setPreviousRequirements] = useState<Requirement[]>([]);
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  
  // New states for block details
  const [selectedModule, setSelectedModule] = useState<SoftwareModule | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [modules, setModules] = useState<SoftwareModule[]>([]);

  const handleFileUpload = (file: File, base64: string) => {
    setImageBase64(base64);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageBase64 || !systemRequirements.trim()) {
      setError('Please upload an image and enter system requirements');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64,
          systemRequirements,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisResult(data.data.analysis);
      setArchitecture(data.data.architecture);
      setCurrentRequirements(data.data.analysis.requirements);
      setPreviousRequirements([]);
      setDiffResult(null);
      setShowDiff(false);
      
      // Parse modules from the architecture
      if (data.data.architecture?.modules) {
        setModules(data.data.architecture.modules);
      } else if (data.data.architecture?.mermaidDiagram) {
        // Fallback: parse modules from mermaid diagram
        const parsedModules = parseMermaidToModules(data.data.architecture.mermaidDiagram);
        setModules(parsedModules);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze diagram');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRequirementEdit = (requirement: Requirement) => {
    // Save current state as previous
    setPreviousRequirements(currentRequirements);
    
    // Update the requirement (simple example - in production, you'd have a modal/form)
    const updatedRequirements = currentRequirements.map(req =>
      req.id === requirement.id
        ? { ...req, description: req.description + ' (modified)', version: req.version + 1 }
        : req
    );
    
    setCurrentRequirements(updatedRequirements);
    
    // Calculate diff
    const diff = calculateRequirementsDiff(currentRequirements, updatedRequirements);
    setDiffResult(diff);
    setShowDiff(true);
  };

  const handleRequirementDelete = (id: string) => {
    setPreviousRequirements(currentRequirements);
    
    const updatedRequirements = currentRequirements.filter(req => req.id !== id);
    setCurrentRequirements(updatedRequirements);
    
    const diff = calculateRequirementsDiff(currentRequirements, updatedRequirements);
    setDiffResult(diff);
    setShowDiff(true);
  };

  const handleReset = () => {
    setImageBase64('');
    setSystemRequirements('');
    setAnalysisResult(null);
    setArchitecture(null);
    setCurrentRequirements([]);
    setPreviousRequirements([]);
    setDiffResult(null);
    setShowDiff(false);
    setError(null);
    setSelectedModule(null);
    setIsPanelOpen(false);
    setModules([]);
  };

  const handleBlockClick = (blockId: string) => {
    const module = modules.find(m => m.id === blockId);
    if (module) {
      setSelectedModule(module);
      setIsPanelOpen(true);
    }
  };

  const handleGenerateAPI = async (moduleId: string, language: ProgrammingLanguage): Promise<GeneratedAPI> => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) {
      throw new Error('Module not found');
    }

    const relatedRequirements = currentRequirements
      .filter(req => req.relatedModules.includes(moduleId))
      .map(req => req.description);

    const response = await fetch('/api/generate-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        module,
        language,
        context: {
          requirements: relatedRequirements,
          connectedModules: module.dependencies,
        },
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate API');
    }

    return data.data;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Cpu className="w-10 h-10 text-blue-600" />
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <FileCode className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            HW to SW Architecture Converter
          </h1>
          <p className="text-lg text-gray-600">
            Transform hardware diagrams into software architecture with AI
          </p>
        </div>

        {/* Input Section */}
        {!architecture && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Upload & Configure
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Hardware Diagram
                </h3>
                <FileUploader onFileUpload={handleFileUpload} />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  System Requirements
                </h3>
                <RequirementsInput
                  value={systemRequirements}
                  onChange={setSystemRequirements}
                />
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !imageBase64 || !systemRequirements}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Generate Architecture</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {architecture && (
          <>
            {/* Action Bar */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowDiff(!showDiff)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                >
                  <GitCompare className="w-4 h-4" />
                  <span>{showDiff ? 'Hide Diff' : 'Show Diff'}</span>
                </button>
              </div>
              
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Start Over</span>
              </button>
            </div>

            {/* Software Architecture Diagram */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Software Architecture Diagram
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MousePointer className="w-4 h-4" />
                  <span>Click on any block to view details and generate API</span>
                </div>
              </div>
              <MermaidRenderer
                diagram={architecture.mermaidDiagram}
                highlightedModules={diffResult?.impactedModules}
                onBlockClick={handleBlockClick}
              />
            </div>

            {/* Requirements Section */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Generated Requirements
              </h2>
              
              {showDiff && diffResult && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-medium text-yellow-800 mb-2">Changes Summary</h3>
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                    {generateDiffSummary(diffResult)}
                  </pre>
                </div>
              )}
              
              <RequirementsList
                requirements={currentRequirements}
                onEdit={handleRequirementEdit}
                onDelete={handleRequirementDelete}
                highlightedIds={
                  diffResult 
                    ? new Set([
                        ...diffResult.added.map(r => r.id),
                        ...diffResult.modified.map(r => r.id),
                      ])
                    : new Set()
                }
              />
            </div>
          </>
        )}
      </div>

      {/* Block Details Panel */}
      <BlockDetailsPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        module={selectedModule}
        requirements={currentRequirements}
        onGenerateAPI={handleGenerateAPI}
      />
    </main>
  );
}
