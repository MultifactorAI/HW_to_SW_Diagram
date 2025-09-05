import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GeneratedAPI, ProgrammingLanguage, SoftwareModule } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { module, language, context } = await request.json();

    if (!module || !language) {
      return NextResponse.json(
        { success: false, error: 'Module and language are required' },
        { status: 400 }
      );
    }

    const apiPrompt = createAPIPrompt(module, language, context);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert software architect who generates clean, well-documented API interfaces for software modules. Generate practical, production-ready APIs with proper error handling and data structures.',
        },
        {
          role: 'user',
          content: apiPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const apiContent = completion.choices[0].message.content || '';
    
    // Parse the response to extract API and examples
    const [mainAPI, examples] = apiContent.split('### USAGE EXAMPLE');

    const generatedAPI: GeneratedAPI = {
      moduleId: module.id,
      moduleName: module.name,
      language,
      content: mainAPI.trim(),
      examples: examples ? examples.trim() : undefined,
      timestamp: new Date(),
    };

    return NextResponse.json({
      success: true,
      data: generatedAPI,
    });
  } catch (error) {
    console.error('API generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate API' 
      },
      { status: 500 }
    );
  }
}

function createAPIPrompt(
  module: SoftwareModule,
  language: ProgrammingLanguage,
  context?: { requirements?: string[]; connectedModules?: string[] }
): string {
  const languageSpecifics = {
    typescript: {
      style: 'TypeScript interfaces and classes with proper typing',
      conventions: 'Use async/await, proper error types, and JSDoc comments',
      example: 'interface, class, type definitions',
    },
    python: {
      style: 'Python classes with type hints and docstrings',
      conventions: 'Follow PEP 8, use type hints, include docstrings',
      example: 'class definitions with @property decorators and type hints',
    },
    c: {
      style: 'C header file with function prototypes and structures',
      conventions: 'Use proper naming conventions, include guards, and documentation',
      example: 'typedef structs, function prototypes, and #define constants',
    },
    java: {
      style: 'Java interfaces and classes with proper annotations',
      conventions: 'Follow Java naming conventions, use JavaDoc, include annotations',
      example: 'interface definitions, abstract classes, and enums',
    },
  };

  const langSpec = languageSpecifics[language];

  let prompt = `Generate a ${language} API interface for a ${module.layer} layer module named "${module.name}".

Module Details:
- Layer: ${module.layer}
- Name: ${module.name}
${module.description ? `- Description: ${module.description}` : ''}
${module.responsibilities?.length ? `- Responsibilities: ${module.responsibilities.join(', ')}` : ''}
${module.dependencies?.length ? `- Dependencies: ${module.dependencies.join(', ')}` : ''}

Language Requirements:
- Style: ${langSpec.style}
- Conventions: ${langSpec.conventions}
- Include: ${langSpec.example}

`;

  if (context?.requirements?.length) {
    prompt += `\nRelated Requirements:\n${context.requirements.join('\n')}\n`;
  }

  if (context?.connectedModules?.length) {
    prompt += `\nConnected Modules:\n${context.connectedModules.join(', ')}\n`;
  }

  prompt += `
Generate a comprehensive API that includes:
1. Main interface/class definition
2. Data structures/types needed
3. Core methods with parameters and return types
4. Error handling approach
5. Any constants or enums needed

After the API definition, add:
### USAGE EXAMPLE
Provide a brief usage example showing how to use this API.

Make the API practical and production-ready for a ${module.layer} layer component.`;

  return prompt;
}
