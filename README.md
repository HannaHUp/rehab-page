# 身体小助理 (Body Assistant) App

A personal rehabilitation and fitness tracking app designed to help you monitor daily exercises, breathing routines, track progress, and perform weekend assessments.

## Features

- 📅 **Daily Plan**: Track CrossFit and rehabilitation exercises with images and descriptions
- 🌬 **Breathing Exercises**: Record breathing exercises throughout the day (morning, after meals, during work breaks, before sleep)
- 📊 **Statistics**: View completion rates, heatmaps, and track your progress
- 🧘‍♀️ **Weekend Assessment**: Self-assessment tools and foam roller guides
- ⚙️ **Settings**: Customize notifications and app preferences

## Screenshots

(Screenshots will be available after development is complete)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo Go app on your mobile device (for mobile testing)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/rehab-page.git
cd rehab-page
```

2. Install dependencies
```bash
npm install
# or 
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. For mobile development:
   - Open the Expo Go app on your mobile device and scan the QR code to launch the app

5. For web development:
```bash
npm run web
# or
yarn web
```

## Deployment to GitHub Pages

### Manual Deployment

1. Update the `homepage` field in `package.json` with your GitHub username:
```json
"homepage": "https://YOUR_USERNAME.github.io/rehab-page"
```

2. Build and deploy the app:
```bash
npm run deploy
# or
yarn deploy
```

### Automated Deployment with GitHub Actions

This repository is configured with GitHub Actions to automatically deploy to GitHub Pages:

1. Push your changes to the `main` branch.
2. GitHub Actions will automatically build and deploy the app to the `gh-pages` branch.
3. Your app will be available at `https://YOUR_USERNAME.github.io/rehab-page`.

## Usage

### Daily Plan
- View your daily exercises
- Check-in completed exercises
- Add notes about your experience

### Breathing Exercises
- Follow the animated breathing guide
- Track completion of breathing exercises
- Mark each session as complete

### Statistics
- View weekly completion rates
- See your progress on the calendar heatmap
- Record daily notes and observations

### Weekend Assessment
- Follow foam roller guides
- Record how each body area feels
- Track improvements over time

### Settings
- Customize notification times
- Enable/disable specific notifications
- Export your data

## Technology Stack

- React Native / React Native Web for web deployment
- TypeScript
- AsyncStorage for mobile / LocalStorage for web
- Custom UI components
- GitHub Pages for hosting

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

This project is licensed under the MIT License - see the LICENSE file for details. 