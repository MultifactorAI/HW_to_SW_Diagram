# Technical Context

## Development Environment
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.x
- **Node Version**: 18.x or higher recommended
- **Package Manager**: npm (or yarn/pnpm)

## Key Dependencies
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "openai": "^4.0.0",
  "mermaid": "^10.0.0",
  "react-dropzone": "^14.0.0",
  "@radix-ui/react-*": "latest",
  "class-variance-authority": "^0.7.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.0.0",
  "diff": "^5.0.0"
}
```

## Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Endpoints
- `POST /api/upload` - Handle file uploads
- `POST /api/analyze` - Analyze HW diagram with GPT-4 Vision
- `POST /api/generate` - Generate SW architecture
- `GET /api/requirements` - Get current requirements
- `PUT /api/requirements` - Update requirements
- `POST /api/diff` - Calculate requirement changes

## File Size Limits
- Maximum image upload: 10MB
- Supported formats: PNG, JPG, JPEG, GIF
- Requirements text: 10KB max

## Browser Requirements
- Modern browsers with ES6+ support
- WebAssembly support for Mermaid rendering
- LocalStorage for temporary data

## Development Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript compiler
```

## Port Configuration
- Development: http://localhost:3000
- API routes: http://localhost:3000/api/*

## Performance Targets
- Initial load: < 3 seconds
- API response: < 5 seconds (including AI processing)
- Diagram rendering: < 1 second
