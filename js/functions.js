var numberOfDaysPast = 30; // range of calendar
var domainName = 'travelcompany.io' // enterprise name
var focusEmail = 'aditya.rao310@gmail.com' // replace with candidate calculator

// Initialise empty arrays for the final questtions to be answered
var arraySmallAss = [];
var arrayExecutionAss = [];
var arrayFocusAss = [];

// test objects
const testOA = {
  attendees: [{email: 'aditya@travelcompany.io', responseStatus: 'accepted'}, {email: 'ankit@travelcompany.io', responseStatus: 'accepted'}, {email: 'rashmi@travelcompany.io', responseStatus: 'accepted'}],
  start: {
    dateTime : "2018-03-30T20:15:00+05:30",
    status: 'confirmed',
  }
}
const testOB = {
  attendees: [{email: 'aditya@travelcompany.io', responseStatus: 'accepted'}, {email: 'aditya.rao310@gmail.com', responseStatus: 'accepted'}, {email: 'rashmi@travelcompany.io', responseStatus: 'accepted'}],
  start: {
    dateTime : "2018-03-29T15:15:00+05:30",
    status: 'confirmed',
  }
}
const testOC = {
  // attendees: [{email: 'aditya@travelcompany.io', responseStatus: 'accepted'}, {email: 'aditya.rao310@gmail.com', responseStatus: 'accepted'}, {email: 'rashmi@travelcompany.io', responseStatus: 'accepted'}],
  start: {
    dateTime : "2018-03-29T17:15:00+05:30",
    status: 'confirmed',
  }
}

// Define working hours. Monday to Friday,  AM to  PM excluding commute
const working = {
  startWork : 10,
  endWork : 20,
  workingDays : [1,2,3,4,5,6], // ["Monday","Tuesday", "Wednesday", "Thursday", "Friday"], 
  commute : 0.5,
  sleep: 7,
}
// TODO: Fix the prelim calculation of working hours to actual ones based on days
var workingHoursAvailable = (working.endWork-working.startWork) * numberOfDaysPast * .8;

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

// Get time diff between two events
function getTimeDiff(start,end) {
var a = moment(start);
var b = moment(end);
var duration = a.diff(b, 'minutes')
return duration;
}

// Define if an event lies within working hours or not
function isworkingHours(event) {
  var baseHour = moment(event).hour(); // gives hour of that moment 0 to 23
  var baseDay = moment(event).day(); // gives sunday as 0 and saturday as 6. weekend = 0
  // console.log(baseHour);
  if (baseHour >= working.startWork && baseHour <= working.endWork && baseDay != 0) {
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

  // Find total hours worked in ExecutionAss
  var totalExecutionTime = 0;
  for(i=0; i<arrayExecutionAss.length; i++) {
    totalExecutionTime += getTimeDiff(arrayExecutionAss[i].end.dateTime, arrayExecutionAss[i].start.dateTime);
  }


  // print data pulled into html
  appendPre('Events in past '+ String(numberOfDaysPast) + ' days');
  appendPre(arraySmallAss.length);
  appendPre('Total time spent in alone execution mode in past ' + String(numberOfDaysPast) + ' days');
  appendPre(String(totalExecutionTime/60) + ' hours');
  appendPre('% time spent in non candidate facing work vs total available time ');
  appendPre(String(totalExecutionTime/workingHoursAvailable/60*100)+'%');

  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Type of work');
    data.addColumn('number', 'Hours');
    data.addRows([
      ['Candidate Calling', 153],
      ['Strategy Thinking', (totalExecutionTime/60)],
      ['Time with HMs', 35.1],
    ]);

    // Set chart options
    var options = {'title':'Where does your time go?',
                   'width':600,
                   'height':450};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

});
}



   


   