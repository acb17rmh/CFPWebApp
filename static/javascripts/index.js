// Minified icsFormatter.js by matthiasanderer, forked from nwcell, https://github.com/nwcell/ics.js/blob/master/ics.deps.min.js
// Free to reproduce here under terms of the MIT License, https://github.com/nwcell/ics.js/blob/master/LICENSE
let icsFormatter=function(){"use strict";if(!(navigator.userAgent.indexOf("MSIE")>-1&&-1==navigator.userAgent.indexOf("MSIE 10"))){let t=-1!==navigator.appVersion.indexOf("Win")?"\r\n":"\n",e=[],n=["BEGIN:VCALENDAR","VERSION:2.0"].join(t),i=t+"END:VCALENDAR";return{events:function(){return e},calendar:function(){return n+t+e.join(t)+i},addEvent:function(n,i,r,o,s){if(void 0===n||void 0===i||void 0===r||void 0===o||void 0===s)return!1;let a=new Date(o),c=new Date(s),u=("0000"+a.getFullYear().toString()).slice(-4),g=("00"+(a.getMonth()+1).toString()).slice(-2),d=("00"+a.getDate().toString()).slice(-2),l=("00"+a.getHours().toString()).slice(-2),E=("00"+a.getMinutes().toString()).slice(-2),S=("00"+a.getMinutes().toString()).slice(-2),f=("0000"+c.getFullYear().toString()).slice(-4),A=("00"+(c.getMonth()+1).toString()).slice(-2),v=("00"+c.getDate().toString()).slice(-2),N=("00"+c.getHours().toString()).slice(-2),T=("00"+c.getMinutes().toString()).slice(-2),D=("00"+c.getMinutes().toString()).slice(-2),p="",M="";E+S+T+D!==0&&(p="T"+l+E+S,M="T"+N+T+D);let m=["BEGIN:VEVENT","CLASS:PUBLIC","DESCRIPTION:"+i,"DTSTART;VALUE=DATE:"+(u+g+d+p),"DTEND;VALUE=DATE:"+(f+A+v+M),"LOCATION:"+r,"SUMMARY;LANGUAGE=en-us:"+n,"TRANSP:TRANSPARENT","END:VEVENT"].join(t);return e.push(m),m},download:function(r,o){if(e.length<1)return!1;o=void 0!==o?o:".ics",r=void 0!==r?r:"calendar";let s=n+t+e.join(t)+i;window.open("data:text/calendar;charset=utf8,"+escape(s))}}}console.log("Unsupported Browser")};"function"==typeof define&&define.amd?define("icsFormatter",[],function(){return icsFormatter()}):"object"==typeof module&&module.exports?module.exports=icsFormatter():this.myModule=icsFormatter();

$(document).ready(async () => {
    getConferences()

    document.getElementById("newEntryForm").addEventListener("click", (function() {
        console.log("Button was clicked!")
        postConference();
    }));

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

function postConference(text) {
    $.ajax({
        method: 'POST',
        url: '/api/',
        data: {content: text},
        dataType : "json",
        success: function (data) {
            console.log(data)
            let card = createConferenceCard(data)
            document.getElementById("demo_results").appendChild(card)
        },
        error: function (error) {
            console.log(error)
        }
    })
};


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

    let cal = icsFormatter()
    cal.addEvent('Submission deadline: ' + conference.conference_name, 'Remember to submit your paper!',
        conference.url, new Date(conference.submission_deadline), new Date(conference.submission_deadline));

    let nextDay = new Date(conference.start_date)
    cal.addEvent('CONFERENCE: ' + conference.conference_name, "", conference.location,
        new Date(conference.start_date), nextDay.setDate(new Date(conference.start_date).getDate() + 1))
    let calDownloadLI = document.createElement('li')
    calDownloadLI.className = "list-group-item"
    let calDownloadLink = document.createElement("a")
    calDownloadLink.className = "btn btn-primary btn-lg btn-block text-light"
    calDownloadLink.textContent = "Add to Calendar"
    calDownloadLink.addEventListener("click", function(event) {
        let filename = "calendar_" + conference._id;
        cal.download()
    })

    calDownloadLI.appendChild(calDownloadLink)
    detailsList.append(calDownloadLI)

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



