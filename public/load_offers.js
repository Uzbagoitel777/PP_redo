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

async function fetchOfferDetails(id) {
    try {
        const response = await fetch(`/api/offers/${id}`);
        const data = await response.json();
        if (data.success) {
            renderOfferDetails(data.offer);
        } else {
            console.error('Failed to fetch offer details:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderOfferDetails(offer) {
    const detailsContainer = document.getElementById('offer-details-container');
    
    const elements = [];
    
    const titleElement = document.getElementById('offer-title');
    titleElement.textContent = offer.title;
    elements.push(titleElement);
    
    const briefElement = document.createElement('p');
    briefElement.textContent = offer.brief;
    briefElement.style.color = '#6c757d';
    elements.push(briefElement);

    const imageElement = document.createElement('img');
    imageElement.src = 'placeholder.png';
    imageElement.alt = 'Offer image';
    elements.push(imageElement);

    const salaryElement = document.createElement('p');
    if (offer.salary_upper <= 0 || (!offer.salary_upper && !offer.salary_lower)) {
        salaryElement.textContent = 'Unpaid internship';
        salaryElement.style.color = '#6c757d';
    } else if (offer.salary_lower && offer.salary_upper) {
        salaryElement.textContent = `Salary: ${offer.salary_lower} - ${offer.salary_upper} RUB`;
    } else if (offer.salary_lower) {
        salaryElement.textContent = `Salary: more than ${offer.salary_lower} RUB`;
    } else if (offer.salary_upper) {
        salaryElement.textContent = `Salary: up to ${offer.salary_upper} RUB`;
    }
    salaryElement.className = 'offer-salary';
    elements.push(salaryElement);

    const textElement = document.createElement('p');
    textElement.textContent = offer.desc;
    elements.push(textElement);

    const applyButton = document.createElement('button');
    applyButton.textContent = 'Send application';
    applyButton.className = 'btn btn-primary';
    //Link is yet to be added 
    elements.push(applyButton);

    detailsContainer.innerHTML = '';
    elements.forEach(element => detailsContainer.appendChild(element));

    detailsContainer.classList.remove('d-none');
}