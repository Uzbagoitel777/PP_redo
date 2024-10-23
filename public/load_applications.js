document.addEventListener('DOMContentLoaded', function() {
    fetchApplications(localStorage.getItem('userId'));
});

async function fetchApplications(id) {
    try {
        const response = await fetch(`/api/applications/${id}`);
        const data = await response.json();
        let asyncFlag = false;
        if (data.success) {
            let offers = [];
            await data.applications.forEach(async (application, idx, array) => {
                const offResponse = await fetch(`/api/offers/${+application.offerID}`);
                const offData = await offResponse.json();
                if (offData.success){
                    offers.push(offData.offer)
                    if(idx === array.length-1){
                        if (data.applications.length ===  offers.length) { 
                            console.log(`${data} ${offers}\n${data.applications} ${offers}`);                 
                            renderApplications(data.applications,  offers);
                        } else{
                            console.error(`Applications-offers mismatch:\n${data.applications}\n${offers}`);
                        }
                    }
                } else{
                    console.error('Failed to fetch offer linked to application:', offData.error);
                }
            });
        } else {
            console.error('Failed to fetch applications:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderApplications(applications, offers) {
    const container = document.getElementById('applications-container');
    const statuses = [" applied", " accepted", " denied"]
    for (let i = 0; i < applications.length; i++) {
        let applicationElement = document.createElement('div');
        //offer card elements' css reused
        applicationElement.className = `offer-card${statuses[applications[i].status]}`;
        applicationElement.innerHTML = `
            <div class="offer-text">
                <div class="offer-title">${offers[i].title}</div>
                <div class="offer-brief">${applications[i].topic}</div>
            </div>
            <img src="${offers[i].path}" alt="Offer image" class="offer-image">
        `;
        console.log(applicationElement.innerHTML)
        container.appendChild(applicationElement);
    }
}