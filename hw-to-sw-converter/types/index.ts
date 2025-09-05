// Hardware component types
export interface HardwareComponent {
  id: string;
  name: string;
  type: 'processor' | 'memory' | 'communication' | 'sensor' | 'actuator' | 'power' | 'storage' | 'interface' | 'display';
  connections: string[];
  specifications?: Record<string, any>;
}

// Software module types
export interface SoftwareModule {
  id: string;
  name: string;
  layer: 'application' | 'service' | 'middleware' | 'driver' | 'hal' | 'kernel';
  dependencies: string[];
  interfaces: string[];
  hardwareMapping?: string; // ID of corresponding hardware component
  description?: string;
  responsibilities?: string[];
}

// Software architecture
export interface SoftwareArchitecture {
  modules: SoftwareModule[];
  connections: Array<{
    from: string;
    to: string;
    type: 'data' | 'control' | 'event';
  }>;
  mermaidDiagram: string;
}

// Requirement types
export interface Requirement {
  id: string;
  category: 'functional' | 'performance' | 'interface' | 'safety' | 'security';
  description: string;
  testable: boolean;
  priority: 'high' | 'medium' | 'low';
  relatedModules: string[];
  version: number;
}

// Analysis result from OpenAI
export interface AnalysisResult {
  hardwareComponents: HardwareComponent[];
  suggestedArchitecture: {
    layers: string[];
    modules: string[];
    interfaces: string[];
  };
  requirements: Requirement[];
}

// Upload data
export interface UploadData {
  imageUrl: string;
  imageBase64?: string;
  systemRequirements: string;
  timestamp: Date;
}

// Diff result
export interface DiffResult {
  added: Requirement[];
  modified: Requirement[];
  removed: Requirement[];
  impactedModules: string[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// New types for API generation
export interface GeneratedAPI {
  moduleId: string;
  moduleName: string;
  language: 'typescript' | 'python' | 'c' | 'java';
  content: string;
  dataStructures?: string;
  examples?: string;
  timestamp: Date;
}

export interface BlockDetails {
  module: SoftwareModule;
  connectedModules: SoftwareModule[];
  relatedRequirements: Requirement[];
  apis?: GeneratedAPI[];
}

export type ProgrammingLanguage = 'typescript' | 'python' | 'c' | 'java';
