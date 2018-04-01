var numberOfDaysPast = 5; // range of calendar
var domainName = 'travelcompany.io' // enterprise name
// Initialise empty arrays for the final questtions to be answered
var arrayPART1 = []
var arrayPART2 = []
var arrayPART3 = []
var arrayPART4 = []
var arraySmallAss = []
var arrayExecutionAss = []
var arrayOneAss = []

// Define working hours. Monday to Friday,  AM to  PM excluding commute
const working = {
  startWork : 9,
  endWork : 20,
  workingDays : ["Monday","Tuesday", "Wednesday", "Thursday", "Friday"], 
  commute : 0.5,
  sleep: 7,
}
var workingHoursAvailable = (working.endWork-working.startWork) * working.workingDays.length

// Function to print data into the HTML
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

// Function to define range to be used in gcal api
function getTimeMinMax(days) {
  var timeStamp = new Date();
  var lastDate = timeStamp.getDate() - days;
  timeStamp.setDate(lastDate);
  var timeMin = timeStamp.toISOString();
  return timeMin;
}

// Define if an event lies within working hours or not
function isworkingHours(event) {
  var baseHour = moment(event).hour(); // gives hour of that moment 0 to 23
  var baseDay = moment(event).day(); // gives sunday as 0 and saturday as 6. weekend = 0,6
  // console.log(baseHour);
  if (baseHour >= working.startWork && baseHour <= working.endWork && baseDay != 0 && baseDay != 6) {
    return true;
  } else {
    return false;
  }  
}

// Define if event is execution focused, not a meeting.. attendees
function isEventExecution(object) {
  if (object.hasOwnProperty('attendees') == false) {
    return true;
  } else {
    return false;
  }
}

// Define if event is 1-1 company event. If only 2 attendees and has email id = domain name 



// Assume timemax as now
var timeMin = getTimeMinMax(numberOfDaysPast);
var timeMax = new Date().toISOString();
  
function getData() {
 // Load data from Google Calendar
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': timeMin,
    'timeMax': timeMax,
    'singleEvents': 'true',
}).then(function(resp) {
  var arrayBigAss = resp.result.items; // all events
  // console.log(arrayBigAss);

  // Create smallAss based on how many events in working range
  for (i=0; i<arrayBigAss.length; i++) {
    if (isworkingHours(arrayBigAss[i].start.dateTime)) {
      // add to smallAss
      arraySmallAss.push(arrayBigAss[i]);
    }
  }
  console.log(arraySmallAss);


  // Create executionAss based on how many such events
  for (i=0; i<arraySmallAss.length; i++) {
    if (isEventExecution(arraySmallAss[i])) {
      // add to execution ass
      arrayExecutionAss.push(arraySmallAss[i]);
    }
  }
  console.log(arrayExecutionAss);

  // Create OneAss based on how many such events



  // print data pulled into html
  appendPre('Events in past '+ String(numberOfDaysPast) + ' days');
  appendPre(arraySmallAss.length);
});
}






  
  
  
  




/*
   // Get hours between two events
  function getHoursBetween(start,end) {
    var a = moment(start);
    var b = moment(end);
    var duration = a.diff(b, 'minutes')
   // console.log(duration);
    return duration;
  }
  */

    /*
  // initialise emoty array to store duration of each event in case needed later
  var durationArray = [];
  for (i=0; i<events.length; i++) {
    var duration = getHoursBetween(events[i].end.dateTime, events[i].start.dateTime);
    durationArray.push(duration);
  }
  console.log(durationArray);

    */




   


   