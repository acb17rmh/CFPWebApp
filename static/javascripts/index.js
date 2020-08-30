// Minified ics.js by nwcell, https://github.com/nwcell/ics.js/blob/master/ics.deps.min.js
// Free to reproduce here under terms of the MIT License, https://github.com/nwcell/ics.js/blob/master/LICENSE
var saveAs=saveAs||function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
var ics=function(e,t){"use strict";{if(!(navigator.userAgent.indexOf("MSIE")>-1&&-1==navigator.userAgent.indexOf("MSIE 10"))){void 0===e&&(e="default"),void 0===t&&(t="Calendar");var r=-1!==navigator.appVersion.indexOf("Win")?"\r\n":"\n",n=[],i=["BEGIN:VCALENDAR","PRODID:"+t,"VERSION:2.0"].join(r),o=r+"END:VCALENDAR",a=["SU","MO","TU","WE","TH","FR","SA"];return{events:function(){return n},calendar:function(){return i+r+n.join(r)+o},addEvent:function(t,i,o,l,u,s){if(void 0===t||void 0===i||void 0===o||void 0===l||void 0===u)return!1;if(s&&!s.rrule){if("YEARLY"!==s.freq&&"MONTHLY"!==s.freq&&"WEEKLY"!==s.freq&&"DAILY"!==s.freq)throw"Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";if(s.until&&isNaN(Date.parse(s.until)))throw"Recurrence rrule 'until' must be a valid date string";if(s.interval&&isNaN(parseInt(s.interval)))throw"Recurrence rrule 'interval' must be an integer";if(s.count&&isNaN(parseInt(s.count)))throw"Recurrence rrule 'count' must be an integer";if(void 0!==s.byday){if("[object Array]"!==Object.prototype.toString.call(s.byday))throw"Recurrence rrule 'byday' must be an array";if(s.byday.length>7)throw"Recurrence rrule 'byday' array must not be longer than the 7 days in a week";s.byday=s.byday.filter(function(e,t){return s.byday.indexOf(e)==t});for(var c in s.byday)if(a.indexOf(s.byday[c])<0)throw"Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"}}var g=new Date(l),d=new Date(u),f=new Date,S=("0000"+g.getFullYear().toString()).slice(-4),E=("00"+(g.getMonth()+1).toString()).slice(-2),v=("00"+g.getDate().toString()).slice(-2),y=("00"+g.getHours().toString()).slice(-2),A=("00"+g.getMinutes().toString()).slice(-2),T=("00"+g.getSeconds().toString()).slice(-2),b=("0000"+d.getFullYear().toString()).slice(-4),D=("00"+(d.getMonth()+1).toString()).slice(-2),N=("00"+d.getDate().toString()).slice(-2),h=("00"+d.getHours().toString()).slice(-2),I=("00"+d.getMinutes().toString()).slice(-2),R=("00"+d.getMinutes().toString()).slice(-2),M=("0000"+f.getFullYear().toString()).slice(-4),w=("00"+(f.getMonth()+1).toString()).slice(-2),L=("00"+f.getDate().toString()).slice(-2),O=("00"+f.getHours().toString()).slice(-2),p=("00"+f.getMinutes().toString()).slice(-2),Y=("00"+f.getMinutes().toString()).slice(-2),U="",V="";y+A+T+h+I+R!=0&&(U="T"+y+A+T,V="T"+h+I+R);var B,C=S+E+v+U,j=b+D+N+V,m=M+w+L+("T"+O+p+Y);if(s)if(s.rrule)B=s.rrule;else{if(B="rrule:FREQ="+s.freq,s.until){var x=new Date(Date.parse(s.until)).toISOString();B+=";UNTIL="+x.substring(0,x.length-13).replace(/[-]/g,"")+"000000Z"}s.interval&&(B+=";INTERVAL="+s.interval),s.count&&(B+=";COUNT="+s.count),s.byday&&s.byday.length>0&&(B+=";BYDAY="+s.byday.join(","))}(new Date).toISOString();var H=["BEGIN:VEVENT","UID:"+n.length+"@"+e,"CLASS:PUBLIC","DESCRIPTION:"+i,"DTSTAMP;VALUE=DATE-TIME:"+m,"DTSTART;VALUE=DATE-TIME:"+C,"DTEND;VALUE=DATE-TIME:"+j,"LOCATION:"+o,"SUMMARY;LANGUAGE=en-us:"+t,"TRANSP:TRANSPARENT","END:VEVENT"];return B&&H.splice(4,0,B),H=H.join(r),n.push(H),H},download:function(e,t){if(n.length<1)return!1;t=void 0!==t?t:".ics",e=void 0!==e?e:"calendar";var a,l=i+r+n.join(r)+o;if(-1===navigator.userAgent.indexOf("MSIE 10"))a=new Blob([l]);else{var u=new BlobBuilder;u.append(l),a=u.getBlob("text/x-vCalendar;charset="+document.characterSet)}return saveAs(a,e+t),l},build:function(){return!(n.length<1)&&i+r+n.join(r)+o}}}console.log("Unsupported Browser")}};

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

    let cal = ics()
    cal.addEvent('Submission deadline: ' + conference.conference_name, 'Remember to submit your paper!',
        conference.url, new Date(conference.submission_deadline), new Date(conference.submission_deadline));

    let nextDay = new Date(conference.start_date)
    cal.addEvent('CONFERENCE: ' + conference.conference_name, "", conference.location,
        new Date(conference.start_date), nextDay.setDate(new Date(conference.start_date).getDate() + 1))
    let calDownloadLI = document.createElement('li')
    calDownloadLI.className = "list-group-item"
    let calDownloadLink = document.createElement("a")
    calDownloadLink.className = "btn btn-primary btn-lg btn-block"
    calDownloadLink.textContent = "Add to Calendar"
    calDownloadLink.addEventListener("click", function(event) {
        let filename = "calendar_" + conference._id;
        cal.download(filename)
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

