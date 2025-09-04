import OpenAI from 'openai';
import { AnalysisResult, HardwareComponent, Requirement } from '@/types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeHardwareDiagram(
  imageBase64: string,
  systemRequirements: string
): Promise<AnalysisResult> {
  try {
    const prompt = `
You are an expert system architect. Analyze this hardware block diagram and the provided system requirements to generate a software architecture.

System Requirements:
${systemRequirements}

Please identify:
1. All hardware components (processors, memory, interfaces, sensors, etc.)
2. Their connections and communication protocols
3. Suggest a layered software architecture
4. Generate testable software requirements

Return the analysis in the following JSON format:
{
  "hardwareComponents": [
    {
      "id": "unique_id",
      "name": "component_name",
      "type": "processor|memory|communication|sensor|actuator|power|storage|interface|display",
      "connections": ["connected_component_ids"],
      "specifications": {}
    }
  ],
  "suggestedArchitecture": {
    "layers": ["application", "service", "driver", "hal", "kernel"],
    "modules": ["module_names"],
    "interfaces": ["interface_names"]
  },
  "requirements": [
    {
      "id": "REQ_001",
      "category": "functional|performance|interface|safety|security",
      "description": "requirement description",
      "testable": true,
      "priority": "high|medium|low",
      "relatedModules": ["module_names"],
      "version": 1
    }
  ]
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high'
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content) as AnalysisResult;
    return result;
  } catch (error) {
    console.error('Error analyzing hardware diagram:', error);
    throw new Error('Failed to analyze hardware diagram');
  }
}

export async function generateSoftwareArchitecture(
  components: HardwareComponent[],
  requirements: Requirement[]
): Promise<string> {
  try {
    const prompt = `
Based on the following hardware components and requirements, generate a detailed software architecture diagram in Mermaid syntax.

Hardware Components:
${JSON.stringify(components, null, 2)}

Requirements:
${JSON.stringify(requirements, null, 2)}

Create a layered architecture with:
1. Application Layer - User-facing applications and services
2. Service Layer - Business logic and middleware
3. Driver Layer - Hardware-specific drivers
4. HAL (Hardware Abstraction Layer) - Hardware interface abstraction
5. Kernel/OS Layer - Core system services

Generate a Mermaid graph that shows:
- Software modules in each layer
- Dependencies between modules
- Mapping to hardware components
- Data and control flow

Return only the Mermaid syntax, starting with "graph TB" or "graph LR".
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Clean up the response to ensure it's valid Mermaid syntax
    let mermaidDiagram = content.trim();
    if (!mermaidDiagram.startsWith('graph')) {
      // Extract Mermaid syntax if it's wrapped in code blocks
      const match = mermaidDiagram.match(/```(?:mermaid)?\n?([\s\S]*?)\n?```/);
      if (match) {
        mermaidDiagram = match[1].trim();
      }
    }

    return mermaidDiagram;
  } catch (error) {
    console.error('Error generating software architecture:', error);
    throw new Error('Failed to generate software architecture');
  }
}

export async function updateRequirements(
  currentRequirements: Requirement[],
  changes: Partial<Requirement>[]
): Promise<Requirement[]> {
  // This function would handle requirement updates
  // For now, we'll implement a simple merge
  const updatedRequirements = [...currentRequirements];
  
  changes.forEach(change => {
    const index = updatedRequirements.findIndex(req => req.id === change.id);
    if (index !== -1 && change.id) {
      updatedRequirements[index] = {
        ...updatedRequirements[index],
        ...change,
        version: updatedRequirements[index].version + 1
      };
    }
  });

  return updatedRequirements;
}
