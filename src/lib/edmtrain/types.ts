export interface EdmtrainEvent {
  id: number;
  link: string;
  name?: string;
  ages: string;
  festivalInd: boolean;
  electronicGenreInd: boolean;
  otherGenreInd: boolean;
  date: string;
  startTime?: string;
  endTime?: string;
  createdDate: string;
  lastModifiedDate: string;
  venue: EdmtrainVenue;
  artists: EdmtrainArtist[];
  ticketLinks: EdmtrainTicketLink[];
}

export interface EdmtrainVenue {
  id: number;
  name: string;
  location: string;
  address: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface EdmtrainArtist {
  id: number;
  name: string;
  link: string;
  b2bInd: boolean;
}

export interface EdmtrainTicketLink {
  platform: string;
  url: string;
}

export interface EdmtrainLocation {
  id: number;
  city: string;
  state: string;
  stateCode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface EdmtrainApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface EventSearchParams {
  locationIds?: number[];
  startDate?: string;
  endDate?: string;
  festivalInd?: boolean;
  includeElectronicGenreInd?: boolean;
  includeOtherGenreInd?: boolean;
  artistIds?: number[];
  venueIds?: number[];
  eventName?: string;
}

export interface NearbyEventsParams {
  latitude: number;
  longitude: number;
  state: string;
  includeElectronicGenreInd?: boolean;
  includeOtherGenreInd?: boolean;
}

export interface LocationSearchParams {
  state?: string;
  city?: string;
}
