// Simple persistent hits counter using localStorage
let hits = parseInt(localStorage.getItem('hits') || '0', 10);
document.getElementById('hits-count').textContent = hits;

// Call this function whenever you get a new hit:
function addHit() {
  hits++;
  localStorage.setItem('hits', hits);
  document.getElementById('hits-count').textContent = hits;
}
// Example: Call addHit() when a hit event occurs
// addHit();