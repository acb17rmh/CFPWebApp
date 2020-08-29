$(document).ready(async () => {
    getConferences()
});

function getConferences() {
    $.ajax({
        url: '/get_conferences',
        type: 'GET',
        success: function (response) {
            makeConferenceCards(response)
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function makeConferenceCards(conferences) {
    let deck = document.createElement('div');
    deck.className = "card-deck"
    deck.id = 'postsDeck';

    conferences.reverse().forEach((element, index) => {
        if (index % 2 === 0 && index !== 0) {
            // wrap every 2 on sm devices
            let smDiv = document.createElement("div")
            smDiv.className = "w-100 d-none d-sm-block d-md-none"
            deck.appendChild(smDiv)
        }
        if (index % 3 === 0 && index !== 0) {
            // wrap every 3 on md devices
            let mdDiv = document.createElement("div")
            mdDiv.className = "w-100 d-none d-md-block d-lg-none"
            deck.appendChild(mdDiv)
        }
        if (index % 3 === 0 && index !== 0) {
            // wrap every 3 on lg devices
            let lgDiv = document.createElement("div")
            lgDiv.className = "w-100 d-none d-lg-block d-xl-none"
            deck.appendChild(lgDiv)
        }
        if (index % 3 === 0 && index !== 0) {
            // wrap every 4 on xl devices
            let xlDiv = document.createElement("div")
            xlDiv.className = "w-100 d-none d-xl-block"
            deck.appendChild(xlDiv)
        }


        deck.appendChild(createConferenceCard(element))
    })

    $('#content').empty()
        .append(deck);
}

function createConferenceCard(conference) {
    let card = document.createElement('div');
    card.className = 'card'
    card.style = "margin-bottom: 3%"
    card.id = conference._id;

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let title = document.createElement("h5")
    let titleLink = document.createElement("a")
    titleLink.href = conference.url
    titleLink.textContent = conference.conference_name

    title.appendChild(titleLink)
    cardBody.appendChild(title)

    let locationSubtitle = document.createElement("h6")
    locationSubtitle.textContent = conference.location
    locationSubtitle.className = "card-subtitle mb-2 text-muted"
    cardBody.appendChild(locationSubtitle)


    conference.keywords.forEach((phrase) => {
        let keywordSpan = document.createElement("span")
        keywordSpan.textContent = phrase;
        keywordSpan.className = "badge badge-primary"
        keywordSpan.style =
        cardBody.append(keywordSpan)
        cardBody.append(" ")

    })

    let detailsList = document.createElement('ul')
    detailsList.className = "list-group list-group-flush"

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }


    let startDateLI = document.createElement('li')
    startDateLI.className = "list-group-item"
    startDateLI.textContent = "Start Date: " + new Date(conference.start_date).toLocaleString("en-GB", dateOptions)
    detailsList.appendChild(startDateLI)

    let submissionDeadlineLI = document.createElement('li')
    submissionDeadlineLI.className = "list-group-item"
    submissionDeadlineLI.textContent = "Submission Deadline: " + new Date(conference.submission_deadline).toLocaleString("en-GB", dateOptions)
    detailsList.appendChild(submissionDeadlineLI)

    let notificationDueLI = document.createElement('li')
    notificationDueLI.className = "list-group-item"
    notificationDueLI.textContent = "Notification Due: " + new Date(conference.notification_due).toLocaleString("en-GB", dateOptions)
    if (conference.notification_due) {
        detailsList.appendChild(notificationDueLI)
    }


    let urlLI = document.createElement('li')
    urlLI.className = "list-group-item"
    urlLI.textContent = "Final Version Deadline: " + new Date(conference.final_version_deadline).toLocaleString("en-GB", dateOptions)
    if (conference.final_version_deadline) {
        detailsList.appendChild(urlLI)
    }

    let cardFooter = document.createElement('div')
    cardFooter.className = "card-footer"
    let footerTextP = document.createElement('small')
    footerTextP.className = "text-muted"
    footerTextP.textContent = "Added on " + new Date(conference.date_added).toLocaleString("en-GB", dateOptions)
    cardFooter.appendChild(footerTextP)

    card.append(cardBody);
    card.append(detailsList);
    card.append(cardFooter)

    return card;
}