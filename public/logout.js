document.getElementById('profile-btn').addEventListener('click', (e) => {
    e.preventDefault()

    localStorage.setItem('authorized', 'false');
    console.log('User logged out');
    window.location.href = '/auth.html';
});