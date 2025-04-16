if (window.innerWidth > 768) {
  const cursor = document.getElementById('cursor');
  document.addEventListener('mousemove', (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
  });
}
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
toggleButton.textContent = savedTheme === 'dark' ? 'Light Theme' : 'Dark Theme';
toggleButton.addEventListener('click', () => {
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', newTheme);
  toggleButton.textContent = newTheme === 'dark' ? 'Light Theme' : 'Dark Theme';
  localStorage.setItem('theme', newTheme);
});