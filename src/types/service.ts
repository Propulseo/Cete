export interface Service {
  id: string;
  category: "Expertise" | "Conseil";
  type: "expertise" | "service";
  title: string;
  description: string;
  shortDescription: string;
  features: string[];
  icon: string;
  imageUrl: string;
  pillar?: boolean;
}
