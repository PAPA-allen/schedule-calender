# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# React Native Event Scheduler App

This is a React Native app built using Expo that allows users to schedule events, select event dates and times, and view them on a calendar. The app also includes options for repeating events weekly, monthly, or daily.

## Features:
- **Calendar View**: Displays a calendar where users can select event dates.
- **Date/Time Picker**: Users can pick the start and end dates and times for their events.
- **Repeat Options**: Allows the user to select a repeat frequency for the event (Daily, Weekly, Monthly).
- **Redux Store**: Events are managed using Redux and saved in AsyncStorage for persistence.
- **Event Details Screen**: After saving an event, users can navigate to the event details screen.

## Requirements

- **Node.js**: Make sure you have Node.js installed on your machine. You can check if it’s installed and which version you're using by running the following in your terminal:
  
  ```bash
  node -v
