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
    deck.id = 'postsDeck';

    conferences.forEach((element) => {
        deck.appendChild(createConferenceCard(element))
    })

    $('#content').empty()
        .append(deck);
}

function createConferenceCard(conference) {
    let card = document.createElement('div');
    card.className = 'card';
    card.id = conference._id;

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let title = document.createElement("h5")
    title.textContent = conference.conference_name;
    cardBody.appendChild(title)

    let detailsList = document.createElement('ul')
    detailsList.className = "list-group list-group-flush"

    let locationLI = document.createElement('li')
    locationLI.className = "list-group-item"
    locationLI.textContent = conference.location
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

    let finalVersionDeadlineLI = document.createElement('li')
    finalVersionDeadlineLI.className = "list-group-item"
    finalVersionDeadlineLI.textContent = "Final Version Deadline: " + conference.final_version_deadline
    detailsList.appendChild(finalVersionDeadlineLI)

    card.append(cardBody);
    card.append(detailsList);

    return card;
}