export function initializeTheme(){
  if(localStorage.getItem('bloom-theme')==='dark') document.body.classList.add('dark');
}
export function toggleTheme(){
  document.body.classList.toggle('dark');
  localStorage.setItem('bloom-theme',document.body.classList.contains('dark')?'dark':'light');
}
