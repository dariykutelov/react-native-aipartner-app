export type AIAgent = {
  id: string;
  name: string;
  bio?: string;
  gender: 'male' | 'female';
  imageurl: string;
  interests?: string;
  personality: string;
  quirks?: string;
  style?: string;
  traits: string;
  created_at: string;
};
