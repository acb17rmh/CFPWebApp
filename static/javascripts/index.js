$(document).ready(async () => {
    console.log("Hello world!")
    getConferences()
});

function getConferences() {
    console.log("In here!")
    $.ajax({
        url: '/get_conferences',
        type: 'GET',
        success: function (response) {
            console.log(typeof (response))
            makeConferenceCards(response)
        },
        error: function (error) {
            console.log(error)
        }
    });
}

function makeConferenceCards(conferences) {
    let deck = document.createElement('div');
    deck.className = "row justify-content-center"
    deck.id = 'postsDeck';

    conferences.forEach((element) => {
        let col = document.createElement('div')
        col.className = "col auto mb-3"
        col.appendChild(createConferenceCard(element))
        deck.appendChild(col)
    })

    $('#content').empty()
        .append(deck);
}

function createConferenceCard(conference) {
    let card = document.createElement('div');
    card.className = 'card mb-4 h-100';
    card.style = "width: 24rem;"
    card.id = conference._id;

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let title = document.createElement("h5")
    let titleLink = document.createElement("a")
    titleLink.href = conference.url
    titleLink.textContent = conference.conference_name
    title.appendChild(titleLink)
    cardBody.appendChild(title)

    let detailsList = document.createElement('ul')
    detailsList.className = "list-group list-group-flush"

    let locationLI = document.createElement('li')
    locationLI.className = "list-group-item"
    locationLI.textContent = "Location: " + conference.location
    detailsList.appendChild(locationLI)

    let startDateLI = document.createElement('li')
    startDateLI.className = "list-group-item"
    startDateLI.textContent = "Start Date: " + conference.start_date
    detailsList.appendChild(startDateLI)

    let submissionDeadlineLI = document.createElement('li')
    submissionDeadlineLI.className = "list-group-item"
    submissionDeadlineLI.textContent = "Submission Deadline: " + conference.submission_deadline
    detailsList.appendChild(submissionDeadlineLI)

    let notificationDueLI = document.createElement('li')
    notificationDueLI.className = "list-group-item"
    notificationDueLI.textContent = "Notification Due: " + conference.notification_due
    detailsList.appendChild(notificationDueLI)

    let urlLI = document.createElement('li')
    urlLI.className = "list-group-item"
    urlLI.textContent = "Final Version Deadline: " + conference.url
    detailsList.appendChild(urlLI)

    card.append(cardBody);
    card.append(detailsList);

    return card;
}