const authorized = false;
const adminEmail = 'admin@mail.ru'
const adminPass = '4123'

document.getElementById('sign-in-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value; 
    const password = document.getElementById('password').value;

    if (email === adminEmail && password === adminPass) {
        localStorage.setItem('authorized', 'true');
        console.log('Authorized!');
        window.location.href = '/';
      } else {
        console.log(email);
        console.log(password);
        console.log('Invalid credentials');
      }
});