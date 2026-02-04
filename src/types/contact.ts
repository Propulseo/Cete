export interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface ContactInfo {
  company: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  businessHours: BusinessHours;
  maps: MapCoordinates;
}
