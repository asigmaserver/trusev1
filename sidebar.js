// No JS required for navigation if using <a href="..."> links!
// If you want to highlight the current section, you can do so with JS:

// Optional: Highlight nav item for current page
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('.sidebar .nav-link').forEach(link => {
  if(link.getAttribute('href') === currentPage) {
    link.querySelector('.icon').style.opacity = "1";
    link.querySelector('.icon').style.color = "#fff";
  }
});