import { LITHUANIAN_RADIO_STATIONS } from "./stations";
import { RadioStation } from "./types";

export * from "./types";
export * from "./stations";
export { WebPlayer } from "./players/web-player";

export class LithuanianRadio {
  private stations: RadioStation[];

  constructor() {
    this.stations = LITHUANIAN_RADIO_STATIONS;
  }

  /**
   * Get all available radio stations
   */
  getStations(): RadioStation[] {
    return [...this.stations];
  }

  /**
   * Get station by ID
   */
  getStation(id: string): RadioStation | undefined {
    return this.stations.find((station) => station.id === id);
  }

  /**
   * Search stations by name or genre
   */
  searchStations(query: string): RadioStation[] {
    const lowerQuery = query.toLowerCase();
    return this.stations.filter(
      (station) =>
        station.name.toLowerCase().includes(lowerQuery) ||
        station.genre?.toLowerCase().includes(lowerQuery) ||
        station.description.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Add custom station
   */
  addStation(station: RadioStation): void {
    if (this.stations.find((s) => s.id === station.id)) {
      throw new Error(`Station with id "${station.id}" already exists`);
    }
    this.stations.push(station);
  }
}
