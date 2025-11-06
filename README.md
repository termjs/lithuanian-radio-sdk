# Lithuanian Radio Stations SDK

Production-ready TypeScript SDK for streaming Lithuanian radio stations in web applications. This package provides easy-to-use APIs for accessing and playing Lithuanian radio stations with full TypeScript support.

## 📦 Installation

```bash
npm install lithuanian-radio-sdk
```

## 🎯 Features

- **Pre-configured Lithuanian radio stations** (ZIP FM, M-1, M-1 PLIUS, M-1 DANCE, LALUNA, Lietus)
- **Web audio player** with event system
- **TypeScript support** with full type definitions
- **Search and filter** stations by name, genre, or description
- **Custom station support** - add your own stations
- **Volume control** with min/max safeguards
- **Playback state management**

## 📚 Table of Contents

- [Core API](#core-api)
  - [LithuanianRadio Class](#lithuanianradio-class)
  - [WebPlayer Class](#webplayer-class)
- [Types](#types)
- [Usage Examples](#usage-examples)
  - [Basic Usage](#basic-usage)
  - [Next.js 15+ Example](#nextjs-15-example)
- [Available Radio Stations](#available-radio-stations)

---

## Core API

The SDK provides two main classes for working with Lithuanian radio stations: `LithuanianRadio` for managing station data and `WebPlayer` for audio playback control.

### LithuanianRadio Class

The main class for managing and accessing Lithuanian radio stations.

#### Constructor

```typescript
const radio = new LithuanianRadio();
```

Creates a new instance with all pre-configured Lithuanian radio stations.

#### Methods

##### `getStations(): RadioStation[]`

Returns all available radio stations as an array.

**Returns:** `RadioStation[]` - Array of all radio stations

**Example:**

```typescript
const stations = radio.getStations();
console.log(stations); // [{ id: 'zipfm', name: 'ZIP FM', ... }, ...]
```

---

##### `getStation(id: string): RadioStation | undefined`

Retrieves a single station by its unique ID.

**Parameters:**

- `id` (string) - The unique identifier of the station

**Returns:** `RadioStation | undefined` - The station object or undefined if not found

**Example:**

```typescript
const zipfm = radio.getStation("zipfm");
console.log(zipfm?.name); // "ZIP FM"

const notFound = radio.getStation("invalid-id");
console.log(notFound); // undefined
```

---

##### `searchStations(query: string): RadioStation[]`

Searches stations by name, genre, or description. Case-insensitive search.

**Parameters:**

- `query` (string) - Search term to match against station name, genre, or description

**Returns:** `RadioStation[]` - Array of matching stations

**Example:**

```typescript
// Search by name
const zipStations = radio.searchStations("zip");
// Returns: ZIP FM and ZIP FM (Iš Kasetės)

// Search by genre
const danceStations = radio.searchStations("dance");
// Returns: ZIP FM, M-1 DANCE, ZIP FM (Iš Kasetės)

// Search by description
const retroStations = radio.searchStations("90s");
// Returns: ZIP FM (Iš Kasetės)
```

---

##### `addStation(station: RadioStation): void`

Adds a custom radio station to the collection.

**Parameters:**

- `station` (RadioStation) - Complete station object with all required fields

**Throws:** `Error` - If a station with the same ID already exists

**Example:**

```typescript
radio.addStation({
  id: "my-custom-station",
  name: "My Custom Radio",
  description: "My personal radio station",
  streamUrl: "https://example.com/stream.mp3",
  website: "https://example.com",
  genre: "Various",
  country: "LT",
});
```

---

### WebPlayer Class

Browser-based audio player for streaming radio stations with event handling.

#### Constructor

```typescript
const player = new WebPlayer(options?: PlayerOptions);
```

**Parameters:**

- `options` (PlayerOptions, optional) - Configuration object
  - `autoplay` (boolean, optional) - Enable autoplay (default: false)
  - `volume` (number, optional) - Initial volume 0-1 (default: 0.7)
  - `preload` (boolean, optional) - Preload audio (default: false)

**Example:**

```typescript
const player = new WebPlayer({
  volume: 0.5,
  preload: true,
});
```

#### Methods

##### `async play(station: RadioStation): Promise<void>`

Starts playing the specified radio station. If a different station is already playing, it switches to the new station.

**Parameters:**

- `station` (RadioStation) - The station to play

**Returns:** `Promise<void>` - Resolves when playback starts

**Throws:** `Error` - If playback fails

**Example:**

```typescript
const station = radio.getStation("zipfm");
await player.play(station);
```

---

##### `pause(): void`

Pauses the current playback without clearing the station.

**Example:**

```typescript
player.pause();
```

---

##### `stop(): void`

Stops playback completely and clears the audio source and current station.

**Example:**

```typescript
player.stop();
```

---

##### `setVolume(volume: number): void`

Sets the playback volume with automatic clamping to valid range.

**Parameters:**

- `volume` (number) - Volume level between 0 (mute) and 1 (max)

**Note:** Values outside 0-1 are automatically clamped to the valid range.

**Example:**

```typescript
player.setVolume(0.5); // Set to 50%
player.setVolume(1); // Set to maximum
player.setVolume(0); // Mute
player.setVolume(1.5); // Clamped to 1
```

---

##### `getVolume(): number`

Gets the current volume level.

**Returns:** `number` - Current volume (0-1)

**Example:**

```typescript
const currentVolume = player.getVolume();
console.log(currentVolume); // 0.7
```

---

##### `isPlaying(): boolean`

Checks if audio is currently playing.

**Returns:** `boolean` - True if playing, false if paused or stopped

**Example:**

```typescript
if (player.isPlaying()) {
  console.log("Currently playing");
} else {
  console.log("Not playing");
}
```

---

##### `getCurrentStation(): RadioStation | null`

Gets the currently loaded station.

**Returns:** `RadioStation | null` - Current station or null if none is loaded

**Example:**

```typescript
const current = player.getCurrentStation();
console.log(current?.name); // "ZIP FM"
```

---

##### `on<K extends keyof PlayerEvents>(event: K, handler: PlayerEvents[K]): void`

Registers an event listener for player events.

**Parameters:**

- `event` (keyof PlayerEvents) - Event name ('play' | 'pause' | 'stop' | 'error' | 'volumeChange' | 'stationChange')
- `handler` (Function) - Callback function for the event

**Available Events:**

- `play` - Fired when playback starts
- `pause` - Fired when playback pauses
- `stop` - Fired when playback stops
- `error` - Fired on errors (receives Error object)
- `volumeChange` - Fired when volume changes (receives new volume)
- `stationChange` - Fired when station changes (receives new RadioStation)

**Example:**

```typescript
player.on("play", () => {
  console.log("Playback started");
});

player.on("error", (error) => {
  console.error("Player error:", error);
});

player.on("stationChange", (station) => {
  console.log("Now playing:", station.name);
});

player.on("volumeChange", (volume) => {
  console.log("Volume changed to:", volume);
});
```

---

##### `off<K extends keyof PlayerEvents>(event: K, handler: PlayerEvents[K]): void`

Removes a previously registered event listener.

**Parameters:**

- `event` (keyof PlayerEvents) - Event name
- `handler` (Function) - The exact handler function to remove

**Example:**

```typescript
const handlePlay = () => console.log("Playing");
player.on("play", handlePlay);
player.off("play", handlePlay); // Remove the listener
```

---

##### `destroy(): void`

Cleans up all resources, stops playback, removes all event listeners, and removes the audio element.

**Important:** Always call this when done with the player to prevent memory leaks.

**Example:**

```typescript
player.destroy();
```

---

## Types

### RadioStation

```typescript
interface RadioStation {
  id: string; // Unique identifier
  name: string; // Station name
  description: string; // Station description
  streamUrl: string; // Direct stream URL
  website?: string; // Official website (optional)
  genre?: string; // Music genre (optional)
  country: string; // Country code (e.g., 'LT')
}
```

### PlayerOptions

```typescript
interface PlayerOptions {
  autoplay?: boolean; // Auto-start playback (default: false)
  volume?: number; // Initial volume 0-1 (default: 0.7)
  preload?: boolean; // Preload audio data (default: false)
}
```

### PlayerEvents

```typescript
interface PlayerEvents {
  play: () => void;
  pause: () => void;
  stop: () => void;
  error: (error: Error) => void;
  volumeChange: (volume: number) => void;
  stationChange: (station: RadioStation) => void;
}
```

---

## Usage Examples

### Basic Usage

```typescript
import { LithuanianRadio, WebPlayer } from "lithuanian-radio-sdk";

// Initialize
const radio = new LithuanianRadio();
const player = new WebPlayer({ volume: 0.5 });

// Get all stations
const stations = radio.getStations();
console.log(`Found ${stations.length} stations`);

// Search for dance stations
const danceStations = radio.searchStations("dance");

// Play a station
const zipfm = radio.getStation("zipfm");
if (zipfm) {
  await player.play(zipfm);
}

// Volume control
player.setVolume(0.8);

// Listen to events
player.on("play", () => console.log("Started playing"));
player.on("error", (error) => console.error("Error:", error));

// Pause/Stop
player.pause();
player.stop();

// Cleanup
player.destroy();
```

---

## Next.js 15+ Example

Complete implementation of a radio player component in Next.js 15+ using App Router and React Server Components.

### Project Structure

```
app/
├── radio/
│   └── page.tsx          # Radio player page
├── components/
│   └── RadioPlayer.tsx   # Client component
└── layout.tsx
```

### Installation

```bash
npm install lithuanian-radio-sdk
```

### Component Implementation

**`app/components/RadioPlayer.tsx`** (Client Component)

```tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { LithuanianRadio, WebPlayer, RadioStation } from "lithuanian-radio-sdk";

export default function RadioPlayer() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const radioRef = useRef<LithuanianRadio | null>(null);
  const playerRef = useRef<WebPlayer | null>(null);

  // Initialize radio and player
  useEffect(() => {
    radioRef.current = new LithuanianRadio();
    playerRef.current = new WebPlayer({ volume: 0.7 });

    // Load all stations
    setStations(radioRef.current.getStations());

    // Setup event listeners
    const player = playerRef.current;

    player.on("play", () => {
      setIsPlaying(true);
      setError(null);
    });

    player.on("pause", () => {
      setIsPlaying(false);
    });

    player.on("stop", () => {
      setIsPlaying(false);
      setCurrentStation(null);
    });

    player.on("error", (err: Error) => {
      setError(err.message);
      setIsPlaying(false);
    });

    player.on("stationChange", (station: RadioStation) => {
      setCurrentStation(station);
    });

    player.on("volumeChange", (vol: number) => {
      setVolume(vol);
    });

    // Cleanup on unmount
    return () => {
      player.destroy();
    };
  }, []);

  const handlePlay = async (station: RadioStation) => {
    try {
      await playerRef.current?.play(station);
    } catch (err: unknown) {
      setError("Failed to play station");
    }
  };

  const handlePause = () => {
    playerRef.current?.pause();
  };

  const handleStop = () => {
    playerRef.current?.stop();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    playerRef.current?.setVolume(newVolume);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setStations(radioRef.current?.getStations() || []);
    } else {
      setStations(radioRef.current?.searchStations(query) || []);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Lithuanian Radio Stations
          </h1>
          <p className="text-gray-600">
            Stream your favorite Lithuanian radio stations
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="Search stations by name, genre, or description..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full px-4 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Now Playing */}
        {currentStation && (
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm opacity-90 mb-1">Now Playing</p>
                <h2 className="text-2xl font-bold mb-2">
                  {currentStation.name}
                </h2>
                <p className="text-sm opacity-90 mb-2">
                  {currentStation.description}
                </p>
                {currentStation.genre && (
                  <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-xs">
                    {currentStation.genre}
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                {isPlaying ? (
                  <button
                    onClick={handlePause}
                    className="bg-white text-indigo-600 p-4 rounded-full hover:bg-gray-100 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlay(currentStation)}
                    className="bg-white text-indigo-600 p-4 rounded-full hover:bg-gray-100 transition"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className="bg-white text-indigo-600 p-4 rounded-full hover:bg-gray-100 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Volume Control */}
            <div className="mt-4 flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-2 bg-white/30 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium w-12 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Station List */}
        <div className="grid gap-4">
          {stations.map((station) => (
            <div
              key={station.id}
              className={`bg-white rounded-lg shadow-md p-6 transition hover:shadow-lg ${
                currentStation?.id === station.id
                  ? "ring-2 ring-indigo-500"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {station.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {station.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {station.genre && (
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                        {station.genre}
                      </span>
                    )}
                    {station.website && (
                      <a
                        href={station.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full flex items-center justify-center text-xs font-medium hover:bg-gray-200 transition"
                      >
                        🌐 Website
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handlePlay(station)}
                  disabled={isPlaying && currentStation?.id === station.id}
                  className={`ml-4 px-6 py-3 rounded-lg font-medium transition ${
                    isPlaying && currentStation?.id === station.id
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isPlaying && currentStation?.id === station.id
                    ? "Playing"
                    : "Play"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {stations.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">
              No stations found for "{searchQuery}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**`app/radio/page.tsx`** (Server Component)

```tsx
import RadioPlayer from "../components/RadioPlayer";

export default function RadioPage() {
  return <RadioPlayer />;
}
```

**`app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lithuanian Radio Player",
  description: "Stream Lithuanian radio stations online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Features in the Next.js Example

- **Full player controls** - Play, pause, and stop
- **Volume slider** - Adjustable volume with visual feedback
- **Real-time search** - Filter stations dynamically
- **Error handling** - User-friendly error messages
- **Responsive design** - Works on all screen sizes
- **Visual feedback** - Currently playing station highlighted
- **Event-driven updates** - Reactive state management
- **Proper cleanup** - Memory leak prevention
- **TypeScript support** - Full type safety
- **Tailwind CSS styling** - Modern, beautiful UI

### Running the Next.js App

```bash
# Navigate to your Next.js project
cd your-nextjs-app

# Install dependencies
npm install lithuanian-radio-sdk

# Run development server
npm run dev
```

Visit `http://localhost:3000/radio` to see your radio player in action!

---

## Available Radio Stations

| ID             | Name                | Genre                  | Description                                            |
| -------------- | ------------------- | ---------------------- | ------------------------------------------------------ |
| `zipfm`        | ZIP FM              | Dance/Pop/Electronic   | Youth-oriented station with global dance-pop hits      |
| `zipfm-kasete` | ZIP FM (Iš Kasetės) | Retro/Dance/90s-Club   | 90s/00s club anthems and nostalgic hits                |
| `m1`           | M-1                 | Pop/Top 40             | First commercial station (since 1989), mainstream hits |
| `m1-plius`     | M-1 PLIUS           | Adult Contemporary     | Softer hits and easy-listening favorites               |
| `m1-dance`     | M-1 DANCE           | Electronic/House/Dance | High-energy club-ready house and electronic            |
| `m1-laluna`    | LALUNA              | Pop/Top 40/Feel-Good   | Klaipėda's feel-good pop with beachy vibes             |
| `m1-lietus`    | Lietus              | Lithuanian Pop/Classic | Lithuanian-language domestic classics                  |

---

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

Kasparas Mickevičius

## 📮 Repository

https://github.com/termjs/lithuanian-radio-sdk

---

## 🐛 Troubleshooting

### Playback Issues

If you encounter playback issues:

1. Check CORS settings on your domain
2. Ensure HTTPS is used in production
3. Verify stream URLs are accessible
4. Check browser console for errors

### Autoplay Restrictions

Modern browsers restrict autoplay. To enable:

1. User must interact with the page first
2. Use muted autoplay (limited use case for radio)
3. Request user permission explicitly

### Memory Leaks

Always call `player.destroy()` when unmounting components to prevent memory leaks:

```typescript
useEffect(() => {
  const player = new WebPlayer();
  return () => player.destroy();
}, []);
```

---

Made with ❤️ for Lithuanian radio listeners
