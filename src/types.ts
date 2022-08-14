export interface PlaceType {
  "LocationID": string,
  "State": string,
  "County": string,
  "City": string,
  "FacilityName": string,
  "Latitude": number,
  "Longitude": number
}

export interface PositionType {
  origin: PlaceType | null;
  destination: PlaceType | null;
}
