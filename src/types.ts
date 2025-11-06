export interface RadioStation {
  id: string;
  name: string;
  description: string;
  streamUrl: string;
  website?: string;
  genre?: string;
  country: string;
}

export interface PlayerEvents {
  play: () => void;
  pause: () => void;
  stop: () => void;
  error: (error: Error) => void;
  volumeChange: (volume: number) => void;
  stationChange: (station: RadioStation) => void;
}

export interface PlayerOptions {
  autoplay?: boolean;
  volume?: number;
  preload?: boolean;
}
