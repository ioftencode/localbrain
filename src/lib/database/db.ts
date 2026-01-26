import Dexie, { type EntityTable } from 'dexie';

export interface Todo {
  id: string;
  date: string;
  task: string;
  category: string;
  time_expected?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyLog {
  date: string;
  general_note: string;
  todos: Todo[];
}

export interface Category {
  name: string;
  color_code: string;
  icon?: string;
  created_at: string;
}

class DailyLogDB extends Dexie {
  daily_logs!: EntityTable<
    DailyLog,
    'date'
  >;
  categories!: EntityTable<
    Category,
    'name'
  >;

  constructor() {
    super('DailyLogDB');
    
    this.version(1).stores({
      daily_logs: 'date',
      categories: 'name'
    });
    
    // Initialize with default categories
    this.on('populate', async () => {
      await this.categories.bulkPut([
        {
          name: 'Learning',
          color_code: '#6bf65c',
          created_at: new Date().toISOString()
        },
        {
          name: 'College External',
          color_code: '#f63b95',
          created_at: new Date().toISOString()
        },
        {
          name: 'Project',
          color_code: '#f4f65c',
          created_at: new Date().toISOString()
        },
        {
          name: 'Personal',
          color_code: '#1091b9',
          created_at: new Date().toISOString()
        },
        {
          name: 'Health',
          color_code: '#EF4444',
          created_at: new Date().toISOString()
        },
        
      ]);
    });
  }
}

export const db = new DailyLogDB();
