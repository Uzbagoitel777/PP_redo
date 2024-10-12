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
const unprotectedUrls = ['/sign_in.html', '/register.html', '/auth.html']
document.addEventListener('DOMContentLoaded', function() {
  if (unprotectedUrls.includes(window.location.pathname)) {
    return;
  }
  if (localStorage.getItem('authorized') !== 'true') {
    window.location.href = '/auth.html';
  }
});