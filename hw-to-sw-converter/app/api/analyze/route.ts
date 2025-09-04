import { NextRequest, NextResponse } from 'next/server';
import { analyzeHardwareDiagram, generateSoftwareArchitecture } from '@/lib/openai';
import { generateMermaidDiagram } from '@/lib/mermaid-utils';
import { ApiResponse, AnalysisResult, SoftwareArchitecture, SoftwareModule } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, systemRequirements } = body;

    if (!imageBase64 || !systemRequirements) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Analyze the hardware diagram
    console.log('Analyzing hardware diagram...');
    const analysisResult = await analyzeHardwareDiagram(imageBase64, systemRequirements);

    // Generate software architecture from analysis
    console.log('Generating software architecture...');
    const mermaidFromAI = await generateSoftwareArchitecture(
      analysisResult.hardwareComponents,
      analysisResult.requirements
    );

    // Create software modules from the analysis
    const softwareModules: SoftwareModule[] = [];
    
    // Application Layer
    softwareModules.push({
      id: 'app_main',
      name: 'Main Application',
      layer: 'application',
      dependencies: ['svc_data', 'svc_comm'],
      interfaces: ['User Interface', 'API'],
      hardwareMapping: undefined,
    });

    // Service Layer
    softwareModules.push({
      id: 'svc_data',
      name: 'Data Processing Service',
      layer: 'service',
      dependencies: ['drv_storage', 'drv_sensor'],
      interfaces: ['Data API'],
      hardwareMapping: undefined,
    });

    softwareModules.push({
      id: 'svc_comm',
      name: 'Communication Service',
      layer: 'service',
      dependencies: ['drv_network', 'drv_bluetooth'],
      interfaces: ['Comm API'],
      hardwareMapping: undefined,
    });

    // Driver Layer - Map to actual hardware components
    analysisResult.hardwareComponents.forEach(hw => {
      if (hw.type === 'communication') {
        softwareModules.push({
          id: `drv_${hw.id}`,
          name: `${hw.name} Driver`,
          layer: 'driver',
          dependencies: [`hal_${hw.type}`],
          interfaces: [`${hw.name} Interface`],
          hardwareMapping: hw.id,
        });
      } else if (hw.type === 'storage' || hw.type === 'memory') {
        softwareModules.push({
          id: `drv_${hw.id}`,
          name: `${hw.name} Driver`,
          layer: 'driver',
          dependencies: ['hal_memory'],
          interfaces: [`${hw.name} Interface`],
          hardwareMapping: hw.id,
        });
      } else if (hw.type === 'sensor' || hw.type === 'interface') {
        softwareModules.push({
          id: `drv_${hw.id}`,
          name: `${hw.name} Driver`,
          layer: 'driver',
          dependencies: ['hal_io'],
          interfaces: [`${hw.name} Interface`],
          hardwareMapping: hw.id,
        });
      }
    });

    // HAL Layer
    softwareModules.push({
      id: 'hal_communication',
      name: 'Communication HAL',
      layer: 'hal',
      dependencies: ['kernel_io'],
      interfaces: ['UART', 'SPI', 'I2C'],
      hardwareMapping: undefined,
    });

    softwareModules.push({
      id: 'hal_memory',
      name: 'Memory HAL',
      layer: 'hal',
      dependencies: ['kernel_memory'],
      interfaces: ['Memory Management'],
      hardwareMapping: undefined,
    });

    softwareModules.push({
      id: 'hal_io',
      name: 'I/O HAL',
      layer: 'hal',
      dependencies: ['kernel_io'],
      interfaces: ['GPIO', 'ADC', 'PWM'],
      hardwareMapping: undefined,
    });

    // Kernel Layer
    softwareModules.push({
      id: 'kernel_io',
      name: 'I/O Subsystem',
      layer: 'kernel',
      dependencies: [],
      interfaces: ['System Calls'],
      hardwareMapping: undefined,
    });

    softwareModules.push({
      id: 'kernel_memory',
      name: 'Memory Management',
      layer: 'kernel',
      dependencies: [],
      interfaces: ['Memory Allocation'],
      hardwareMapping: undefined,
    });

    // Generate the final Mermaid diagram
    const finalMermaidDiagram = generateMermaidDiagram(
      softwareModules,
      analysisResult.hardwareComponents
    );

    const architecture: SoftwareArchitecture = {
      modules: softwareModules,
      connections: [],
      mermaidDiagram: finalMermaidDiagram,
    };

    const response: ApiResponse<{
      analysis: AnalysisResult;
      architecture: SoftwareArchitecture;
    }> = {
      success: true,
      data: {
        analysis: analysisResult,
        architecture,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to analyze diagram' 
      },
      { status: 500 }
    );
  }
}
