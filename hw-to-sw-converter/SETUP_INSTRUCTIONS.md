# Setup Instructions - IMPORTANT

## ⚠️ OpenAI API Key Required

The application requires a valid OpenAI API key to function. The current `.env.local` file contains a placeholder that needs to be replaced.

### Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (it starts with `sk-`)

### Step 2: Update the Environment File

1. Open `hw-to-sw-converter/.env.local`
2. Replace `your_openai_api_key_here` with your actual API key
3. Save the file
4. Restart the development server (Ctrl+C and run `npm run dev` again)

Example:
```
# Before (placeholder)
OPENAI_API_KEY=your_openai_api_key_here

# After (with real key)
OPENAI_API_KEY=sk-proj-abcd1234... (your actual key)
```

### Step 3: Verify GPT-4 Vision Access

Make sure your OpenAI account has access to:
- GPT-4 Vision (gpt-4o model)
- Sufficient API credits

### Testing the Application

Once your API key is configured:

1. **Upload a Hardware Diagram**
   - Use the drag-and-drop area or click to browse
   - Upload the iMX6 Dual diagram image provided

2. **Enter System Requirements**
   - Copy the sample requirements from `public/sample-requirements.txt`
   - Or use your own requirements

3. **Generate Architecture**
   - Click the "Generate Architecture" button
   - Wait for the AI analysis (may take 5-10 seconds)

4. **View Results**
   - Interactive software architecture diagram
   - Generated testable requirements
   - Edit requirements to see diff visualization

## Troubleshooting

### Error: "Failed to analyze hardware diagram"
- Check that your API key is correctly set in `.env.local`
- Verify the key starts with `sk-`
- Ensure you've restarted the dev server after updating the key

### Error: "401 Incorrect API key"
- Your API key is invalid or incorrectly formatted
- Get a new key from OpenAI platform

### Error: "Insufficient credits"
- Add credits to your OpenAI account
- Check usage at https://platform.openai.com/usage

## UI-Only Testing (Without API Key)

You can still test the UI components without an API key:
- File upload functionality
- Requirements input
- UI responsiveness
- All visual elements

Only the actual AI analysis requires the API key.
