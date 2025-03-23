# Rutube Web Application

A web-based version of the Rutube1 Android app that allows users to play YouTube videos with real-time Russian translation of English speech.

## Features

- YouTube video playback with standard controls (play/pause, mute/unmute)
- Real-time speech recognition for English content
- Instant translation from English to Russian
- Tabbed interface to view both original speech and translations
- Dark/light theme support
- Responsive design for different screen sizes

## Technologies Used

- Frontend: React, TypeScript, TailwindCSS, shadcn/ui
- Backend: Express.js
- APIs: YouTube Player API, Web Speech API, Translation Services

## Getting Started

### Prerequisites

- Node.js (version 18+ recommended)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/rutube-web.git
cd rutube-web
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Enter a YouTube video URL in the input field
2. Click "Load" to load the video
3. Use the play/pause and mute/unmute buttons to control the video
4. Click "Start Translation" to begin speech recognition and translation
5. View translations in the panel below the video, switching between English and Russian tabs

## Project Structure

- `/client` - Frontend React application
- `/server` - Backend Express.js server
- `/shared` - Shared TypeScript types and schemas

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Original Rutube1 Android app by [serkac1000](https://github.com/serkac1000/Rutube1)