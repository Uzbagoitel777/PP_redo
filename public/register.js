document.getElementById("register-form").addEventListener('submit', async (e) =>{
    e.preventDefault();
    const formData = {
        email: document.getElementById('email').value.trim(), 
        password: document.getElementById('password').value, 
        firstName: document.getElementById('first-name').value.trim(), 
        surname: document.getElementById('surname').value.trim(), 
        paternalName: document.getElementById('paternal-name').value.trim(), 
        academicYear: document.getElementById('academic-year').value 
    }

    try{
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:  JSON.stringify(formData),
        });

        if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json();

        if (result.success){
            console.log('Registration successful!');
            window.location.href = '/sign_in.html';
            alert('Registration successful! Try to sign in now')
        }
    } catch(error){
        console.error('Error:', error);
    }
})