  
  //All global variables for the dashboard
   var numberOfDaysPast = 2;

   // All useful functions

   // Get timeMin
   function getTimeMinMax(days) {
    var timeStamp = new Date();
    var lastDate = timeStamp.getDate() - days;
    timeStamp.setDate(lastDate);
    var timeMin = timeStamp.toISOString();
    return timeMin;
   }

   // Get hours between two events
  function getHoursBetween(start,end) {
    var a = moment(start);
    var b = moment(end);
    var duration = a.diff(b, 'minutes')
   // console.log(duration);
    return duration;
  }

  // Get all meetings starttime and endtimes in an array



   // Append message before results
   // Append a pre element to the body containing the given message as its text node. Used to display the results of the API call. @param {string} message Text to be placed in pre element.
  function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  }


   function printResults() {
     // Run function1 to get range data and other things for gcal 
    var timeMin = getTimeMinMax(numberOfDaysPast);
    var timeMax = new Date().toISOString();

    // Load data from Google Calendar
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': timeMin,
      'timeMax': timeMax,
      'singleEvents': 'true',
    })
    .then(function(response) {
      var events = response.result.items;
      console.log(events);
    
    // initialise emoty array to store duration of each event in case needed later
    var durationArray = [];
     for (i=0; i<events.length; i++) {
       var duration = getHoursBetween(events[i].end.dateTime, events[i].start.dateTime);
       durationArray.push(duration);
     }
     console.log(durationArray);
      appendPre('Events in past '+ String(numberOfDaysPast) + ' days');
      appendPre(events.length);
    });
  }

//TODO: figure out what appears in list of response and how to get time, email ID etc from each event
// events --> array of objects. each object has keypaid values with all details like attendees, creators etc
// https://www.toptal.com/software/definitive-guide-to-datetime-manipulation
// https://www.milanlund.com/blog/javascript-library-google-calendar 
//TODO: instead of past 24 hours, make it about today and yesterday