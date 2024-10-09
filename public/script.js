//fetch('/check-auth')
//    .then(response => response.json())
//    .then(data => {
//      if (!data.authorized) {
//        window.location.href = '/auth.html';
//      }
//    })
//    .catch(error => {
//      console.error('Error checking authorization:', error);
//    });
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname === '/sign_in.html' || window.location.pathname === '/auth.html') {
    return;
  }
  if (localStorage.getItem('authorized') !== 'true') {
    window.location.href = '/auth.html';
  }
});