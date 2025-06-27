# WhatsApp Chat Analyzer

A simple app for analyzing WhatsApp chat exports, check quick insights and visualizations about your conversations.

## Features 🚀

### 📈 Comprehensive Analytics

- **Message Statistics**: Total messages, words, participants, and chat duration
- **Timeline Analysis**: Messages over time by year, month, and daily patterns
- **Activity Patterns**: Peak activity hours and most active days
- **Participant Analysis**: Individual statistics for each chat participant
- **Media Breakdown**: Analysis of images, stickers, audio, videos, and documents

### 🎨 Rich Visualizations

- Interactive charts using Recharts library
- Pie charts for distribution analysis
- Bar charts for comparisons
- Line charts for timeline trends
- Stacked charts for media analysis

### 🌍 Multi-language Support

- **Spanish** (default)
- **English**

### 🎭 Privacy Features

- **Participant Anonymization**: Replace real names with random names
- Gaming-themed aliases like "ShadowDragon", "MysticWarrior", "FirePhoenix"
- Perfect for sharing analysis results while protecting privacy

### 📊 Analysis Tabs

1. **Overview**: Key metrics and yearly/participant distributions
2. **Timeline**: Monthly trends and most active days
3. **Participants**: Individual statistics and comparisons
4. **Activity**: Hourly and weekday patterns
5. **Media**: Visual charts and detailed media type breakdowns

## Technology Stack 🛠️

### Frontend

- **Next.js 15.2.4** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components with Radix UI primitives
- **Recharts** for data visualization

### Backend

- **Python 3** for chat parsing and analysis
- **Next.js API Routes** for file handling
- Standard Python libraries: `re`, `json`, `datetime`, `collections`

## Getting Started 🏃‍♂️

### Prerequisites

- Node.js (with pnpm package manager)
- Python 3 available in system PATH as `python3`

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd whatsapp-analyzer
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
pnpm build
pnpm start
```

## Usage 📝

### Exporting WhatsApp Chat

1. Open WhatsApp and navigate to the chat you want to analyze
2. Tap the three dots menu → More → Export chat
3. Choose **"Without Media"** to get a .txt file
4. Save the exported file to your device

### Analyzing Your Chat

1. Visit the application in your browser
2. Choose your preferred language (Spanish/English)
3. Toggle anonymization if you want to protect participant privacy
4. Upload your WhatsApp .txt export file
5. Click "Analyze Chat" and wait for processing
6. Explore the interactive visualizations across different tabs

## Important Notes ⚠️

- **Language Support**: The analysis currently works best with chats exported in **Spanish**
- **File Format**: Only .txt files from WhatsApp exports are supported
- **Privacy**: All processing happens locally - your chat data is never stored on servers
- **File Size**: Large chat files may take longer to process

## Project Structure 📁

```
whatsapp-analyzer/
├── app/
│   ├── api/analyze-chat/    # API endpoint for chat processing
│   ├── page.tsx             # Main application page
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # shadcn/ui components
│   └── chat-analysis.tsx    # Main analysis component
├── scripts/
│   └── analyze_chat.py      # Python analysis script
├── types/
│   └── analysis.ts          # TypeScript type definitions
└── lib/
    └── utils.ts             # Utility functions
```

## Development Commands 💻

```bash
# Development server
pnpm dev

# Build application
pnpm build

# Start production server
pnpm start

# Linting
pnpm lint

# Test Python script independently
python3 scripts/analyze_chat.py path/to/whatsapp-export.txt
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue in the repository.
