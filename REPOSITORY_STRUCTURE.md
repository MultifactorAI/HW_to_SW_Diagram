# HW-to-SW Architecture Converter - Repository Structure

## Executive Summary

The HW-to-SW Architecture Converter is an AI-powered web application that automatically transforms hardware system diagrams into software architecture blueprints. By leveraging OpenAI's GPT-4 Vision API, the tool analyzes uploaded hardware schematics to identify components and generates corresponding software architecture diagrams with properly structured layers and testable requirements. Built with Next.js and TypeScript, it reduces weeks of manual architecture planning to minutes while ensuring consistency, traceability, and compliance with industry standards.

## Repository Overview

```
HW_to_SW_Diagram/
├── cline_docs/              # AI assistant memory bank
└── hw-to-sw-converter/      # Main application
```

## Detailed Structure

### 📁 `cline_docs/` - AI Assistant Memory Bank
Documentation maintained for context persistence across development sessions:

| File | Purpose |
|------|---------|
| `activeContext.md` | Current development state, recent changes, and immediate next steps |
| `productContext.md` | Project vision, problems it solves, and intended functionality |
| `systemPatterns.md` | Architecture decisions, design patterns, and technical approach |
| `techContext.md` | Technology stack details, development setup, and constraints |
| `progress.md` | Feature completion status, remaining work, and milestones |

### 📁 `hw-to-sw-converter/` - Main Application

#### 🎯 Core Application (`app/`)

| Component | Location | Function |
|-----------|----------|----------|
| **Root Layout** | `layout.tsx` | Defines HTML structure, metadata, fonts, and global wrapper |
| **Main Page** | `page.tsx` | Primary application interface with complete workflow state management |
| **Global Styles** | `globals.css` | Tailwind CSS directives and custom global styles |
| **API Route** | `api/analyze/route.ts` | POST endpoint for hardware analysis via OpenAI GPT-4 Vision |

#### 🧩 React Components (`components/`)

##### Upload Components (`upload/`)
| Component | Function |
|-----------|----------|
| `FileUploader.tsx` | • Drag-and-drop interface for hardware diagrams<br>• File type/size validation<br>• Image preview display<br>• Uses react-dropzone |
| `RequirementsInput.tsx` | • Text area for system requirements<br>• Character counter (max 5000)<br>• Sample requirements loader<br>• Input tips display |

##### Diagram Components (`diagram/`)
| Component | Function |
|-----------|----------|
| `MermaidRenderer.tsx` | • Renders interactive Mermaid.js diagrams<br>• Zoom controls (in/out/reset/fit)<br>• SVG export functionality<br>• Diff highlighting for changes |

##### Requirements Components (`requirements/`)
| Component | Function |
|-----------|----------|
| `RequirementsList.tsx` | • Displays categorized requirements<br>• Edit/delete capabilities<br>• Priority indicators<br>• Version tracking |

#### 🔧 Utility Libraries (`lib/`)

| Library | Purpose | Key Functions |
|---------|---------|---------------|
| `openai.ts` | OpenAI Integration | • GPT-4 Vision API configuration<br>• Hardware analysis prompts<br>• Response parsing |
| `mermaid-utils.ts` | Diagram Generation | • Converts data to Mermaid syntax<br>• LR layout optimization<br>• Component grouping logic |
| `diff-utils.ts` | Change Tracking | • Requirement diff calculation<br>• Impact analysis<br>• Change summaries |
| `utils.ts` | Common Utilities | • Class name management (cn)<br>• Type guards<br>• Validation helpers |

#### 📝 Type Definitions (`types/`)

**`index.ts`** defines all TypeScript interfaces:

```typescript
HardwareComponent    // Hardware element structure
SoftwareModule      // Software component definition  
Requirement        // Requirement data model
ArchitectureResponse // API response format
DiffResult         // Change tracking types
```

#### 📦 Static Assets (`public/`)

| Asset | Purpose |
|-------|---------|
| `sample-requirements.txt` | IoT gateway example requirements |
| `adas-requirements.txt` | Automotive ADAS system requirements |
| `create-adas-diagram.html` | Tool to generate test hardware diagrams |
| `*.svg` | UI icons and assets |

#### ⚙️ Configuration Files

| File | Purpose | Key Settings |
|------|---------|--------------|
| `package.json` | Dependencies & Scripts | Next.js 14, React 18, TypeScript, Mermaid.js |
| `tsconfig.json` | TypeScript Config | Strict mode, path aliases, Next.js optimizations |
| `next.config.ts` | Next.js Settings | Image optimization, API routes |
| `tailwind.config.ts` | Styling Framework | Custom colors, responsive breakpoints |
| `.env.local` | Environment Variables | `OPENAI_API_KEY` for GPT-4 Vision |
| `eslint.config.mjs` | Code Quality | Linting rules and standards |
| `postcss.config.mjs` | CSS Processing | PostCSS pipeline configuration |

#### 📚 Documentation

| Document | Content |
|----------|---------|
| `README.md` | Quick start guide, features, basic usage |
| `SETUP_INSTRUCTIONS.md` | Detailed installation, configuration, troubleshooting |
| `EXECUTIVE_SUMMARY.md` | Business-level description, ROI, use cases |

## Data Flow Architecture

```
1. User Input
   ├── Hardware Diagram (PNG/JPG) → FileUploader
   └── System Requirements (Text) → RequirementsInput

2. Processing
   └── API Route (/api/analyze)
       ├── Image Encoding (Base64)
       ├── OpenAI GPT-4 Vision Analysis
       └── Response Parsing

3. Output Generation
   ├── Software Architecture → mermaid-utils → MermaidRenderer
   └── Testable Requirements → RequirementsList

4. User Interaction
   ├── Edit Requirements
   ├── Track Changes (diff-utils)
   └── Export Diagrams (SVG)
```

## Key Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 + React 18 | Modern web application framework |
| **Language** | TypeScript | Type safety and better developer experience |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **AI/ML** | OpenAI GPT-4 Vision | Hardware diagram analysis |
| **Diagrams** | Mermaid.js | Software architecture visualization |
| **File Upload** | react-dropzone | Drag-and-drop file handling |
| **Icons** | Lucide React | Consistent icon library |
| **Utilities** | clsx, diff | Class management, change tracking |

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Setup

1. **Clone Repository**
   ```bash
   git clone [repository-url]
   cd HW_to_SW_Diagram/hw-to-sw-converter
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   # Create .env.local and add:
   OPENAI_API_KEY=your_api_key_here
   ```

4. **Start Development**
   ```bash
   npm run dev
   # Access at http://localhost:3000
   ```

## Module Responsibilities

### Frontend Modules
- **Upload Module**: Handles file validation, preview, and user input
- **Diagram Module**: Manages visualization, zoom, and export
- **Requirements Module**: CRUD operations on requirements

### Backend Modules
- **API Module**: Orchestrates AI analysis and response formatting
- **OpenAI Module**: Manages GPT-4 Vision communication
- **Utils Module**: Provides shared functionality across components

### Data Processing
- **Mermaid Utils**: Transforms JSON to diagram syntax
- **Diff Utils**: Tracks and highlights changes
- **Type System**: Ensures data consistency throughout

## Security Considerations

- API key stored in environment variables (never committed)
- File size limits (10MB max)
- File type validation (images only)
- Input sanitization for requirements text
- No persistent storage of uploaded images

## Performance Optimizations

- Lazy loading of Mermaid.js library
- Memoized diagram rendering
- Debounced requirement updates
- Optimized image encoding
- Efficient diff algorithms

## Extensibility Points

1. **New Diagram Types**: Extend `mermaid-utils.ts`
2. **Additional AI Models**: Modify `openai.ts`
3. **Export Formats**: Enhance `MermaidRenderer.tsx`
4. **Requirement Categories**: Update `types/index.ts`
5. **UI Themes**: Customize `tailwind.config.ts`

---

This modular structure ensures clean separation of concerns, making the codebase maintainable and scalable while providing a clear workflow from hardware upload through AI analysis to software architecture generation.
