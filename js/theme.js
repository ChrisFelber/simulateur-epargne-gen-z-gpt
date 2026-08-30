const STORAGE_KEY = 'bloom-theme';

export function initializeTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') document.body.classList.add('dark');
}

export function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem(STORAGE_KEY, document.body.classList.contains('dark') ? 'dark' : 'light');
}
