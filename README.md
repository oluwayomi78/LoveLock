# Love Lock 💕

A modern web application built with Next.js where users can create and share virtual love locks on Valentine's Day.

## Features

- 🔐 Create personalized love locks with custom messages
- 💝 Share love locks with unique URLs
- 📱 Responsive design for all devices
- ✨ Interactive and engaging user experience
- 🗄️ Database integration for persistent storage

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: CSS (PostCSS)
- **Database**: Integrated database layer
- **Package Manager**: npm

## Project Structure

```
src/
├── app/
│   ├── layout.js           # Root layout component
│   ├── page.js            # Home page
│   ├── globals.css        # Global styles
│   ├── api/
│   │   └── love-lock/
│   │       └── route.js   # Love lock API endpoints
│   └── lock/
│       └── [id]/
│           └── page.js    # Individual lock view page
└── lib/
    └── db.js              # Database configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

### Love Lock Routes

- **POST** `/api/love-lock` - Create a new love lock
- **GET** `/api/love-lock/[id]` - Retrieve a specific love lock

## Usage

1. Navigate to the home page
2. Fill in your love lock message
3. Submit to create your lock
4. Share the unique URL with your loved one
5. View shared locks by visiting the lock page

## Deployment

This project is configured for deployment on [Vercel](https://vercel.com/). Configuration is handled in `vercel.json`.

### Deploy on Vercel

```bash
npm run build
vercel deploy
```

## Development

### Build

```bash
npm run build
```

### Run Production Build

```bash
npm start
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is open source and available under the MIT License.

---

Made with ❤️ for Valentine's Day
