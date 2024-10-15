document.getElementById('sign-in-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  try {
      const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.authorized) {
          console.log('Login successful!');
          localStorage.setItem('authorized', 'true')
          localStorage.setItem('userId', result.studentId);
          window.location.href = '/';
      } else {
          console.log('Login failed:', result.error);
      }
  } catch (error) {
      console.error('Error:', error);
  }
});
