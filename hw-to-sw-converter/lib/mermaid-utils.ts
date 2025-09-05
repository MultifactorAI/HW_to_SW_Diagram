import { SoftwareModule, HardwareComponent } from '@/types';

export function generateMermaidDiagram(
  modules: SoftwareModule[],
  hardwareComponents: HardwareComponent[]
): string {
  const layers = {
    application: [] as SoftwareModule[],
    service: [] as SoftwareModule[],
    middleware: [] as SoftwareModule[],
    driver: [] as SoftwareModule[],
    hal: [] as SoftwareModule[],
    kernel: [] as SoftwareModule[],
  };

  // Group modules by layer
  modules.forEach(module => {
    if (layers[module.layer]) {
      layers[module.layer].push(module);
    }
  });

  // Generate Mermaid syntax with LEFT-TO-RIGHT layout for better readability
  let mermaid = 'graph LR\n';
  
  // Add subgraphs for each layer - arranged horizontally
  mermaid += '  subgraph "Software Architecture"\n';
  mermaid += '    direction TB\n';
  
  // Application Layer
  if (layers.application.length > 0) {
    mermaid += '    subgraph "Application Layer"\n';
    layers.application.forEach(module => {
      mermaid += `      ${module.id}["${module.name}"]\n`;
    });
    mermaid += '    end\n';
  }

  // Service Layer
  if (layers.service.length > 0) {
    mermaid += '    subgraph "Service Layer"\n';
    layers.service.forEach(module => {
      mermaid += `      ${module.id}["${module.name}"]\n`;
    });
    mermaid += '    end\n';
  }

  // Middleware Layer
  if (layers.middleware.length > 0) {
    mermaid += '    subgraph "Middleware Layer"\n';
    layers.middleware.forEach(module => {
      mermaid += `      ${module.id}["${module.name}"]\n`;
    });
    mermaid += '    end\n';
  }

  // Driver Layer - Group similar drivers
  if (layers.driver.length > 0) {
    mermaid += '    subgraph "Driver Layer"\n';
    
    // Group drivers by type
    const driverGroups: Record<string, SoftwareModule[]> = {};
    layers.driver.forEach(module => {
      const groupKey = module.name.includes('Driver') 
        ? module.name.split(' ')[module.name.split(' ').length - 2] || 'Other'
        : 'Other';
      if (!driverGroups[groupKey]) {
        driverGroups[groupKey] = [];
      }
      driverGroups[groupKey].push(module);
    });
    
    // Only show first few drivers from each group to reduce clutter
    Object.entries(driverGroups).forEach(([group, drivers]) => {
      const driversToShow = drivers.slice(0, 2); // Show max 2 drivers per group
      driversToShow.forEach(module => {
        mermaid += `      ${module.id}["${module.name}"]\n`;
      });
      if (drivers.length > 2) {
        mermaid += `      ${group}_more["... +${drivers.length - 2} more ${group} drivers"]\n`;
      }
    });
    
    mermaid += '    end\n';
  }

  // HAL Layer
  if (layers.hal.length > 0) {
    mermaid += '    subgraph "HAL Layer"\n';
    layers.hal.forEach(module => {
      mermaid += `      ${module.id}["${module.name}"]\n`;
    });
    mermaid += '    end\n';
  }

  // Kernel Layer
  if (layers.kernel.length > 0) {
    mermaid += '    subgraph "OS/Kernel"\n';
    layers.kernel.forEach(module => {
      mermaid += `      ${module.id}["${module.name}"]\n`;
    });
    mermaid += '    end\n';
  }
  
  mermaid += '  end\n\n';

  // Add hardware components in a separate section
  if (hardwareComponents.length > 0) {
    mermaid += '  subgraph "Hardware Components"\n';
    mermaid += '    direction TB\n';
    
    // Group hardware by type
    const hwGroups: Record<string, HardwareComponent[]> = {};
    hardwareComponents.forEach(hw => {
      if (!hwGroups[hw.type]) {
        hwGroups[hw.type] = [];
      }
      hwGroups[hw.type].push(hw);
    });
    
    // Show hardware grouped by type
    Object.entries(hwGroups).forEach(([type, components]) => {
      const componentsToShow = components.slice(0, 3); // Show max 3 per type
      componentsToShow.forEach(hw => {
        mermaid += `    ${hw.id}[/"${hw.name}"/]\n`;
      });
      if (components.length > 3) {
        mermaid += `    ${type}_more[/"... +${components.length - 3} more ${type}"/]\n`;
      }
    });
    
    mermaid += '  end\n\n';
  }

  // Add simplified connections - only show key dependencies
  const addedConnections = new Set<string>();
  
  // Connect layers (simplified)
  layers.application.forEach(module => {
    if (module.dependencies.length > 0 && layers.service.length > 0) {
      const connectionKey = `app_to_service`;
      if (!addedConnections.has(connectionKey)) {
        mermaid += `  ${module.id} --> ${layers.service[0].id}\n`;
        addedConnections.add(connectionKey);
      }
    }
  });

  layers.service.forEach((module, index) => {
    if (index === 0 && layers.driver.length > 0) {
      const driverSample = Object.values(layers.driver)[0];
      if (driverSample) {
        mermaid += `  ${module.id} --> ${driverSample.id}\n`;
      }
    }
  });

  // Connect one driver to HAL
  if (layers.driver.length > 0 && layers.hal.length > 0) {
    mermaid += `  ${layers.driver[0].id} --> ${layers.hal[0].id}\n`;
  }

  // Connect HAL to kernel
  if (layers.hal.length > 0 && layers.kernel.length > 0) {
    mermaid += `  ${layers.hal[0].id} --> ${layers.kernel[0].id}\n`;
  }

  // Connect one driver to hardware (simplified)
  if (layers.driver.length > 0 && hardwareComponents.length > 0) {
    const driverWithHw = layers.driver.find(d => d.hardwareMapping);
    if (driverWithHw && driverWithHw.hardwareMapping) {
      mermaid += `  ${driverWithHw.id} -.-> ${driverWithHw.hardwareMapping}\n`;
    }
  }

  // Style the diagram with better colors and spacing
  mermaid += '\n  classDef appClass fill:#e3f2fd,stroke:#1565c0,stroke-width:2px,color:#000;\n';
  mermaid += '  classDef serviceClass fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000;\n';
  mermaid += '  classDef middlewareClass fill:#e1f5fe,stroke:#0277bd,stroke-width:2px,color:#000;\n';
  mermaid += '  classDef driverClass fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,color:#000;\n';
  mermaid += '  classDef halClass fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px,color:#000;\n';
  mermaid += '  classDef kernelClass fill:#fce4ec,stroke:#c2185b,stroke-width:2px,color:#000;\n';
  mermaid += '  classDef hwClass fill:#f5f5f5,stroke:#424242,stroke-width:2px,stroke-dasharray: 5 5,color:#000;\n';
  mermaid += '  classDef moreClass fill:#fffde7,stroke:#f57f17,stroke-width:1px,font-style:italic,color:#666;\n';

  // Apply styles
  layers.application.forEach(m => {
    mermaid += `  class ${m.id} appClass;\n`;
  });
  layers.service.forEach(m => {
    mermaid += `  class ${m.id} serviceClass;\n`;
  });
  layers.middleware.forEach(m => {
    mermaid += `  class ${m.id} middlewareClass;\n`;
  });
  layers.driver.forEach(m => {
    mermaid += `  class ${m.id} driverClass;\n`;
  });
  layers.hal.forEach(m => {
    mermaid += `  class ${m.id} halClass;\n`;
  });
  layers.kernel.forEach(m => {
    mermaid += `  class ${m.id} kernelClass;\n`;
  });
  hardwareComponents.forEach(hw => {
    mermaid += `  class ${hw.id} hwClass;\n`;
  });

  // Style the "more" nodes
  Object.keys(layers).forEach(layer => {
    if (layers[layer as keyof typeof layers].length > 2) {
      mermaid += `  class ${layer}_more moreClass;\n`;
    }
  });

  return mermaid;
}

export function highlightChanges(
  mermaidDiagram: string,
  changedModuleIds: string[]
): string {
  let highlightedDiagram = mermaidDiagram;
  
  // Add highlight style
  highlightedDiagram += '\n  classDef changed fill:#ffeb3b,stroke:#f57c00,stroke-width:3px;\n';
  
  // Apply highlight to changed modules
  changedModuleIds.forEach(id => {
    highlightedDiagram += `  class ${id} changed;\n`;
  });
  
  return highlightedDiagram;
}

export function parseMermaidToModules(mermaidDiagram: string): SoftwareModule[] {
  // This is a simplified parser - in production, you'd want a more robust solution
  const modules: SoftwareModule[] = [];
  const lines = mermaidDiagram.split('\n');
  
  let currentLayer = '';
  const layerMap: Record<string, SoftwareModule['layer']> = {
    'Application Layer': 'application',
    'Service Layer': 'service',
    'Middleware Layer': 'middleware',
    'Driver Layer': 'driver',
    'HAL Layer': 'hal',
    'OS/Kernel': 'kernel',
  };
  
  lines.forEach(line => {
    // Check for subgraph declaration
    const subgraphMatch = line.match(/subgraph\s+"([^"]+)"/);
    if (subgraphMatch) {
      currentLayer = layerMap[subgraphMatch[1]] || '';
      return;
    }
    
    // Check for module declaration
    const moduleMatch = line.match(/(\w+)\["([^"]+)"\]/);
    if (moduleMatch && currentLayer && !moduleMatch[2].includes('...')) {
      modules.push({
        id: moduleMatch[1],
        name: moduleMatch[2],
        layer: currentLayer as SoftwareModule['layer'],
        dependencies: [],
        interfaces: [],
      });
    }
    
    // Check for dependencies
    const depMatch = line.match(/(\w+)\s+-->\s+(\w+)/);
    if (depMatch) {
      const targetModule = modules.find(m => m.id === depMatch[2]);
      if (targetModule && !targetModule.dependencies.includes(depMatch[1])) {
        targetModule.dependencies.push(depMatch[1]);
      }
    }
  });
  
  return modules;
}
