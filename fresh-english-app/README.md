# English Learning App

A modern, cross-platform application designed to help users learn English through interactive lessons, exercises, and real-time feedback. Built with React Native and Expo for iOS, Android, and Web platforms.

## Features

- 📚 Structured English lessons
- 🎯 Interactive exercises
- 🗣️ Speech recognition practice
- 📊 Progress tracking
- 🎨 Beautiful, modern UI
- 📱 Cross-platform support (iOS, Android, Web)
- 🌙 Dark mode support (coming soon)

## Tech Stack

- React Native / Expo
- TypeScript
- Firebase (Authentication & Firestore)
- React Navigation
- Expo Speech & AV

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/english-learning-app.git
cd english-learning-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for web browser

## Project Structure

```
english-learning-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API and business logic
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── theme/          # Theme configuration
├── assets/            # Images, fonts, etc.
└── App.tsx           # Root component
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Firebase Setup

1. Create a new Firebase project
2. Enable Authentication and Firestore
3. Create a web app in your Firebase project
4. Copy the configuration to `src/config/firebase.ts`

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Expo team for the amazing cross-platform development tools
- React Native community for the extensive ecosystem
- Firebase team for the backend infrastructure 