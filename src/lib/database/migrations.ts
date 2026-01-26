import { db } from './db';

export async function backupDatabase() {
  const exportData = {
    daily_logs: await db.daily_logs.toArray(),
    categories: await db.categories.toArray(),
    exported_at: new Date().toISOString(),
    version: 1
  };
  
  const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `daily-log-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  
  URL.revokeObjectURL(url);
}

export async function restoreDatabase(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  
  await db.transaction('rw', db.daily_logs, db.categories, async () => {
    await db.daily_logs.clear();
    await db.categories.clear();
    
    if (data.daily_logs) {
      await db.daily_logs.bulkAdd(data.daily_logs);
    }
    if (data.categories) {
      await db.categories.bulkAdd(data.categories);
    }
  });
}
