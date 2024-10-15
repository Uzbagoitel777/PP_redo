import { fetchOfferDetails, renderOfferDetails } from './shared.js';

document.addEventListener('DOMContentLoaded', function() {
    fetchOffers();
});

async function fetchOffers() {
    try {
        const response = await fetch('/api/offers');
        const data = await response.json();
        if (data.success) {
            renderOffers(data.offers);
        } else {
            console.error('Failed to fetch offers:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderOffers(offers) {
    const container = document.getElementById('offers-container');
    offers.forEach(offer => {
        const offerElement = document.createElement('div');
        offerElement.className = 'offer-card';
        offerElement.innerHTML = `
            <div class="offer-text">
                <div class="offer-title">${offer.title}</div>
                <div class="offer-brief">${offer.brief}</div>
            </div>
            <img src="placeholder.png" alt="Offer image" class="offer-image">
        `;
        offerElement.addEventListener('click', () => {
            fetchOfferDetails(offer.ID);
        });
        container.appendChild(offerElement);
    });
}