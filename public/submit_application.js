import { fetchOfferDetails, renderOfferDetails } from "./shared.js";

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const offerId = urlParams.get('offerId');
    
    fetchOfferDetails(offerId);
    
    document.getElementById('application-form').addEventListener('submit', submitApplication);
    document.getElementById('cancel-btn').addEventListener('click', () => {
        window.location.href = '/';
    });
});

async function submitApplication(event) {
    event.preventDefault();
    
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Please log in to submit an application.');
        return;
    }
    
    const offerId = new URLSearchParams(window.location.search).get('offerId');
    const topic = document.getElementById('topic').value;
    const applicationText = document.getElementById('applicationText').value;
    
    try {
        const response = await fetch('/api/submit-application', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, offerId, topic, applicationText }),
        });
        
        if (response.ok) {
            window.location.href = '/applied.html';
        } else {
            alert('Failed to submit application. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}