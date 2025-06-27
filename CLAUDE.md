# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WhatsApp Chat Analyzer - a Next.js web application that allows users to upload WhatsApp chat export files (.txt) and generates comprehensive visualizations and statistics about their conversations.

### Architecture

- **Frontend**: Next.js 15.2.4 with React 19, TypeScript, and Tailwind CSS
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Charts**: Recharts library for data visualization
- **Backend Analysis**: Python script (`scripts/analyze_chat.py`) for chat parsing and analysis. When updating any field to return, make sure to update the `types/analysis.ts` file.
- **API**: Next.js API route (`app/api/analyze-chat/route.ts`) that bridges frontend and Python backend

### Key Components

- **Main App**: `app/page.tsx` - File upload interface and results display
- **Analysis Component**: `components/chat-analysis.tsx` - Comprehensive data visualization with tabs for different analysis views
- **Python Analyzer**: `scripts/analyze_chat.py` - WhatsApp message parsing and statistical analysis
- **API Bridge**: `app/api/analyze-chat/route.ts` - Handles file uploads and Python script execution

## Development Commands

```bash
# Development server
pnpm dev # never run, the user is already running the server
# Build application
pnpm build
# Start production server
pnpm start
# Linting
pnpm lint
```

## Python Dependencies

The application requires Python 3 with standard library modules:

- `re`, `json`, `sys`, `datetime`, `collections`, `argparse`

Test the Python script independently:

```bash
python3 scripts/analyze_chat.py path/to/whatsapp-export.txt
```

## Data Flow

1. User uploads WhatsApp .txt export via `app/page.tsx`
2. File sent to `/api/analyze-chat` endpoint
3. API creates temporary file and spawns Python process
4. Python script parses chat and returns JSON analysis
5. Frontend displays results through `ChatAnalysis` component

## Key Features Analyzed

- Message counts by participant, year, month, hour, weekday
- Word counts and average message lengths
- Media type breakdowns (text, images, stickers, audio, video, documents)
- Most active days and timeline visualizations
- Comprehensive participant statistics

## Component Structure

- Uses shadcn/ui design system with `components.json` configuration
- All UI components in `components/ui/` directory
- Custom hooks in `hooks/` directory
- Utilities in `lib/utils.ts`
- Global styles in `app/globals.css`

## Environment Requirements

- Node.js with pnpm package manager
- Python 3 available in system PATH as `python3`
- Next.js development/production environment
