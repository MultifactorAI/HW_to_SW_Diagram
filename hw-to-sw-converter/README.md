# HW-to-SW Architecture Converter

Transform hardware diagrams into software architectures instantly using AI-powered analysis.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key with GPT-4 Vision access
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MultifactorAI/HW_to_SW_Diagram.git
cd HW_to_SW_Diagram/hw-to-sw-converter
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env.local file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 What It Does

This tool automatically converts hardware system diagrams (circuit boards, block diagrams, schematics) into comprehensive software architecture blueprints. Upload a hardware diagram image, provide system requirements, and receive:

- **Interactive software architecture diagrams** with proper layering (drivers, middleware, services, applications)
- **Testable software requirements** categorized by type and priority
- **Change tracking** to visualize the impact of requirement modifications
- **Export capabilities** for documentation and presentations

## 🎯 Key Features

- **AI-Powered Analysis**: Uses OpenAI GPT-4 Vision to understand hardware components
- **Interactive Diagrams**: Zoom, pan, and export Mermaid.js diagrams as SVG
- **Requirements Management**: Edit, delete, and track changes to requirements
- **Diff Visualization**: See how requirement changes impact the architecture
- **Sample Data**: Includes example requirements for quick testing

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: OpenAI GPT-4 Vision API
- **Diagrams**: Mermaid.js
- **File Upload**: react-dropzone

## 📁 Project Structure

```
hw-to-sw-converter/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application
├── components/            # React components
│   ├── upload/           # File upload components
│   ├── diagram/          # Diagram rendering
│   └── requirements/     # Requirements management
├── lib/                   # Utility functions
│   ├── openai.ts         # OpenAI integration
│   ├── mermaid-utils.ts  # Diagram generation
│   └── diff-utils.ts     # Change tracking
├── public/               # Static assets
│   └── sample-requirements.txt
└── types/                # TypeScript definitions
```

## 🔧 Configuration

### OpenAI API Key

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Ensure your key has GPT-4 Vision access
3. Add to `.env.local`:
```bash
OPENAI_API_KEY=sk-...your-key-here...
```

### Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📝 Usage Guide

### Basic Workflow

1. **Upload Hardware Diagram**
   - Drag and drop or click to upload
   - Supports PNG, JPG, GIF (max 10MB)
   - Preview appears after upload

2. **Enter System Requirements**
   - Type or paste requirements
   - Use sample requirements for testing
   - Maximum 5000 characters

3. **Generate Architecture**
   - Click "Generate Software Architecture"
   - Wait for AI analysis (10-30 seconds)
   - View generated diagram and requirements

4. **Interact with Results**
   - Zoom in/out on diagram
   - Edit or delete requirements
   - Export diagram as SVG
   - Track changes with diff view

### Sample Files

The repository includes sample files for testing:

- `public/sample-requirements.txt` - IoT gateway requirements
- `public/adas-requirements.txt` - Automotive ADAS requirements
- `public/create-adas-diagram.html` - Tool to create test diagrams

## 🧪 Testing Without API Key

You can explore the UI without an OpenAI API key:

1. Run the development server
2. Upload any image file
3. Enter sample requirements
4. The interface is fully functional (only AI analysis requires API key)

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Invalid API Key"
- **Solution**: Verify your OpenAI API key in `.env.local`
- Ensure the key has GPT-4 Vision access

**Issue**: "Module not found" errors
- **Solution**: Run `npm install` to install all dependencies

**Issue**: Port 3000 already in use
- **Solution**: Use a different port: `npm run dev -- -p 3001`

**Issue**: Large image upload fails
- **Solution**: Ensure image is under 10MB
- Try compressing the image

### Environment Variables

Create `.env.local` with:
```
OPENAI_API_KEY=your_key_here
```

Never commit `.env.local` to version control!

## 📊 Performance Tips

- Use smaller images (< 2MB) for faster processing
- Keep requirements concise and specific
- Group related requirements together
- Use the sample files for initial testing

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Repository](https://github.com/MultifactorAI/HW_to_SW_Diagram)
- [Issues](https://github.com/MultifactorAI/HW_to_SW_Diagram/issues)
- [OpenAI Platform](https://platform.openai.com)
- [Next.js Documentation](https://nextjs.org/docs)

## 💡 Use Cases

Perfect for:
- **Embedded Systems Development**
- **IoT Device Design**
- **Automotive Electronics**
- **Medical Device Software**
- **Industrial Automation**

## 🎓 Learn More

- Read the [EXECUTIVE_SUMMARY.md](../EXECUTIVE_SUMMARY.md) for business context
- Check [REPOSITORY_STRUCTURE.md](../REPOSITORY_STRUCTURE.md) for detailed architecture
- See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for advanced configuration

---

Built with ❤️ by MultifactorAI
