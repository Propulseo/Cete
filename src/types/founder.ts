export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  imagePosition?: string;
  specialties: string[];
  visible?: boolean;
  formerOrg?: string;
  currentEntity?: string;
}
