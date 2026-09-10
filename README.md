# Wondrx Field Log Queue

A lightweight Expo + React Native application for capturing field service logs in an offline-first workflow. It lets users add customer logs, keeps them in a local queue when the device is offline, and retries sync when connectivity is restored.

## Project overview

This app is designed to simulate a real-world field operations workflow:

- Add a customer name and notes for a service visit
- Save entries locally immediately
- Show pending and failed sync states in the UI
- Automatically flush queued logs when online again
- Allow manual retry for failed entries
- Support a forced offline mode for testing edge cases

The project uses Expo SDK 57 with React Native 0.86 and TypeScript.

## Tech stack

- Expo
- React Native
- Expo Router
- TypeScript
- AsyncStorage
- NetInfo
- UUID

## Prerequisites

Before running the app, make sure you have:

- Node.js 20 LTS or newer
- npm
- Expo CLI available via the project dependencies
- An Android emulator, iOS simulator, or the Expo Go app installed on a device

## Setup instructions

1. Open a terminal in the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the app:

   ```bash
   npx expo start
   ```

4. In the terminal output, choose one of the available launch options:

   - Press `a` to open in Android
   - Press `i` to open in iOS simulator
   - Press `w` to open in a web browser
   - Scan the QR code with the Expo Go app on a mobile device

## Useful scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

## App behavior

- Logs are stored using `AsyncStorage` so they persist across app restarts.
- When the app detects the device is offline, new entries stay in the local queue.
- When connectivity returns, queued items are submitted in order.
- Failed submissions are marked and can be retried manually.
- The `Force Offline` toggle helps simulate offline conditions during testing.

## Project structure

```text
src/
  app/
    _layout.tsx
    index.tsx
  components/
    logRow.tsx
    statusBadge.tsx
  data/
    mock-data.ts
  hooks/
    useLogQueue.ts
  services/
    mock-api.ts
  storage/
    log-store.ts
  types/
    field-logs.ts
```

## Notes

- Seeded mock logs are loaded when storage is empty.
- The app is intentionally built as an offline-first example and is useful for testing queueing and retry behavior.
- If you want a clean start for local testing, remove the stored AsyncStorage data or clear the app state before re-running the app.
