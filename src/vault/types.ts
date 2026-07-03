export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  locked: boolean;
  pinned: boolean;
  archived: boolean;
  favorite: boolean;
  tags: string[];
}
