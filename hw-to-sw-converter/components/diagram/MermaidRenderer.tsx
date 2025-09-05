'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import mermaid from 'mermaid';
import { Download, ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MermaidRendererProps {
  diagram: string;
  className?: string;
  highlightedModules?: string[];
  onBlockClick?: (blockId: string) => void;
}

// Track initialization
let mermaidInitialized = false;

// Initialize mermaid once
if (typeof window !== 'undefined' && !mermaidInitialized) {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    themeVariables: {
      primaryColor: '#e3f2fd',
      primaryTextColor: '#1565c0',
      primaryBorderColor: '#1976d2',
      lineColor: '#5e92f3',
      secondaryColor: '#f3e5f5',
      tertiaryColor: '#fff3e0',
    },
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis',
    },
  });
  mermaidInitialized = true;
}

export function MermaidRenderer({ diagram, className, highlightedModules = [], onBlockClick }: MermaidRendererProps) {
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  
  // Memoize the highlighted modules string to prevent infinite loops
  const highlightedModulesKey = useMemo(
    () => highlightedModules.sort().join(','),
    [highlightedModules]
  );

  // Add click handlers to diagram blocks
  const attachClickHandlers = useCallback(() => {
    if (!svgRef.current || !onBlockClick) return;

    // Find all clickable elements (nodes in the diagram)
    const nodes = svgRef.current.querySelectorAll('.node');
    
    nodes.forEach((node) => {
      const nodeElement = node as HTMLElement;
      const nodeId = nodeElement.id;
      
      // Skip nodes that are "more" indicators or hardware components
      if (nodeId && !nodeId.includes('_more') && !nodeId.includes('hw_')) {
        nodeElement.style.cursor = 'pointer';
        nodeElement.addEventListener('click', () => {
          onBlockClick(nodeId);
        });
        
        // Add hover effect
        nodeElement.addEventListener('mouseenter', () => {
          nodeElement.style.opacity = '0.8';
        });
        nodeElement.addEventListener('mouseleave', () => {
          nodeElement.style.opacity = '1';
        });
      }
    });
  }, [onBlockClick]);

  useEffect(() => {
    if (!diagram) {
      setSvgContent('');
      return;
    }

    let cancelled = false;

    const renderDiagram = async () => {
      if (cancelled) return;
      
      setIsRendering(true);
      setError(null);

      try {
        // Create a unique ID for this diagram
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Add the diagram content with highlighting if needed
        let processedDiagram = diagram;
        const modulesToHighlight = highlightedModulesKey.split(',').filter(Boolean);
        
        if (modulesToHighlight.length > 0) {
          // Add highlight class definition if not already present
          if (!processedDiagram.includes('classDef highlight')) {
            processedDiagram += '\n  classDef highlight fill:#ffeb3b,stroke:#f57c00,stroke-width:3px;\n';
          }
          // Apply highlight to specified modules
          modulesToHighlight.forEach(moduleId => {
            processedDiagram += `  class ${moduleId} highlight;\n`;
          });
        }

        // Add clickable class for interactive nodes
        if (onBlockClick) {
          processedDiagram += '\n  classDef clickable cursor:pointer;\n';
        }

        // Render the diagram
        const { svg } = await mermaid.render(id, processedDiagram);
        
        if (cancelled) return;
        
        // Process the SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          // Make it responsive
          svgElement.removeAttribute('height');
          svgElement.removeAttribute('width');
          svgElement.setAttribute('style', 'width: 100%; height: auto;');
          
          // Get the processed SVG string
          const serializer = new XMLSerializer();
          const processedSvg = serializer.serializeToString(svgElement);
          
          if (!cancelled) {
            setSvgContent(processedSvg);
          }
        }

        // Clean up the temporary element if it exists
        const tempElement = document.getElementById(id);
        if (tempElement) {
          tempElement.remove();
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (!cancelled) {
          setError('Failed to render diagram. Please check the syntax.');
          setSvgContent('');
        }
      } finally {
        if (!cancelled) {
          setIsRendering(false);
        }
      }
    };

    renderDiagram();

    return () => {
      cancelled = true;
    };
  }, [diagram, highlightedModulesKey, onBlockClick]);

  // Attach click handlers after SVG is rendered
  useEffect(() => {
    if (svgContent && !isRendering) {
      // Small delay to ensure DOM is updated
      const timer = setTimeout(() => {
        attachClickHandlers();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [svgContent, isRendering, attachClickHandlers]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setScale(1);
  };

  const handleDownload = () => {
    if (!svgContent) return;

    // Create a blob from the SVG content
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'software-architecture.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn('relative bg-white border rounded-lg', className)}>
      {/* Toolbar */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom In"
          type="button"
        >
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom Out"
          type="button"
        >
          <ZoomOut className="w-4 h-4 text-gray-600" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Reset Zoom"
          type="button"
        >
          <Maximize2 className="w-4 h-4 text-gray-600" />
        </button>
        <div className="w-px h-6 bg-gray-300" />
        <button
          onClick={handleDownload}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Download SVG"
          type="button"
          disabled={!svgContent}
        >
          <Download className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Diagram Container */}
      <div className="overflow-auto p-8">
        <div
          ref={containerRef}
          className="min-h-[400px] flex items-center justify-center transition-transform"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
        >
          {isRendering && (
            <div className="flex flex-col items-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600">Rendering diagram...</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {!isRendering && !error && svgContent && (
            <div 
              ref={svgRef}
              className="w-full"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
        </div>
      </div>

      {/* Scale Indicator */}
      {scale !== 1 && (
        <div className="absolute bottom-4 left-4 px-2 py-1 bg-gray-800 text-white text-xs rounded">
          {Math.round(scale * 100)}%
        </div>
      )}
    </div>
  );
}
