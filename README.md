# FinanceAI Frontend

Frontend application for **FinanceAI**, a personal finance tracker with AI-powered insights.

## Tech Stack
- React (Vite)
- TypeScript
- Tailwind CSS
- Axios
- React Router

## Features
- Authentication (JWT-based)
- Dashboard with income, expense & savings summary
- Category-wise expense breakdown charts
- AI-generated insights with graceful fallback
- Advanced transaction table:
  - Search, filters, sorting
  - Client-side pagination
- CSV statement import preview
- Dark / Light mode support

## Architecture Notes
- Uses interceptor-based auth handling
- Optimistic UI updates for transactions
- AI service warm-up to avoid cold-start latency
- Default fallback data to prevent UI blank states

## Environment Variables
- VITE_API_BASE_URL=your_backend_url
- VITE_AI_API_BASE_URL=your_ai_service_url
