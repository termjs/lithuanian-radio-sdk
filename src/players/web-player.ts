import { RadioStation, PlayerEvents, PlayerOptions } from "../types";

export class WebPlayer {
  private audio: HTMLAudioElement;
  private currentStation: RadioStation | null = null;
  private eventHandlers: Map<keyof PlayerEvents, Function[]> = new Map();

  constructor(options: PlayerOptions = {}) {
    this.audio = new Audio();
    this.audio.volume = options.volume ?? 0.7;
    this.audio.preload = options.preload ? "auto" : "none";

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.audio.addEventListener("play", () => this.emit("play"));
    this.audio.addEventListener("pause", () => this.emit("pause"));
    this.audio.addEventListener("ended", () => this.emit("stop"));
    this.audio.addEventListener("error", (e) => {
      const error = new Error(
        `Audio error: ${this.audio.error?.message || "Unknown error"}`
      );
      this.emit("error", error);
    });
    this.audio.addEventListener("volumechange", () => {
      this.emit("volumeChange", this.audio.volume);
    });
  }

  /**
   * Play a radio station
   */
  async play(station: RadioStation): Promise<void> {
    try {
      if (this.currentStation?.id !== station.id) {
        this.audio.src = station.streamUrl;
        this.currentStation = station;
        this.emit("stationChange", station);
      }

      await this.audio.play();
    } catch (error) {
      throw new Error(`Failed to play station: ${error}`);
    }
  }

  /**
   * Pause playback
   */
  pause(): void {
    this.audio.pause();
  }

  /**
   * Stop playback and clear source
   */
  stop(): void {
    this.audio.pause();
    this.audio.src = "";
    this.currentStation = null;
    this.emit("stop");
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.audio.volume;
  }

  /**
   * Check if playing
   */
  isPlaying(): boolean {
    return !this.audio.paused;
  }

  /**
   * Get current station
   */
  getCurrentStation(): RadioStation | null {
    return this.currentStation;
  }

  /**
   * Register event listener
   */
  on<K extends keyof PlayerEvents>(event: K, handler: PlayerEvents[K]): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * Remove event listener
   */
  off<K extends keyof PlayerEvents>(event: K, handler: PlayerEvents[K]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit<K extends keyof PlayerEvents>(event: K, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stop();
    this.eventHandlers.clear();
    this.audio.remove();
  }
}
