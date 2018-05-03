// FUNCTION Remove shit events
// find if specific event has email source from flights + if all day event
function isEventShit(object) {
  if (object.hasOwnProperty('source') == true || object.end.hasOwnProperty('date') == true) {
    return false; // came from email flight, remove it
  } else {
    return true;
  }
}

// FUNCTION Find if event is execution by created by me, and no other invitees
function isEventExecution(object) {
  if (object.hasOwnProperty('attendees') == false && object.creator.hasOwnProperty('self') == true) {
    return true;
  } else {
    return false;
  }
}

// FUNCTION Find if event was a meeting
function isEventMeeting(object) {
  if (object.hasOwnProperty('attendees') == true) {
    return true;
  } else {
    return false;
  }
}

// FUNCTION Find if event was which category 
function stringMatch(tag, title) {
  var sentence = title;
  var phrase = tag;
  if (sentence.includes(phrase)) {
    return true;
  } else {
    return false;
  }
}

// FUNCTION Find how many mins in an event
function getMins(start,end) {
  var start_time = moment(start);
  var end_time = moment(end);
  var duration = end_time.diff(start_time, 'minutes')
  return duration;
  }


  
function getData() {
 // Load data from Google Calendar
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': moment("2018-04-23 09:00").toISOString(),
    'timeMax': moment("2018-04-27 19:00").toISOString(),
    'showDeleted': false,
    'singleEvents': true,
  }).then(function(resp) {
    var events_list = resp.result.items; 
    // console.log(events_list);
  
    // remove and make final proper list 
    final_list = [];
    events_list.forEach(element => {
      if (isEventShit(element)) {
        final_list.push(element);
      }
    });

    // console.log(final_list);

    // make a list for all execution events
    execution_list =[];
    final_list.forEach(element => {
      if (isEventExecution(element)) {
        execution_list.push(element);
      }
    });
    // console.log(execution_list);

    // make a list for all meeting events
    meeting_list =[];
    final_list.forEach(element => {
      if (isEventMeeting(element)) {
        meeting_list.push(element);
      }
    });
    // console.log(meeting_list);

    // make a list of all categories
    //TODO --> make this shorter one day and maybe get from HTML form
    var category1 = '[Product strategy]'
    var listcategory1 = [];
    execution_list.forEach(element => {
      if (stringMatch(category1,element.summary)) {
        listcategory1.push(element);
      }
    });
    // console.log(listcategory1);

    var category2 = '[Product ops]'
    var listcategory2 = [];
    execution_list.forEach(element => {
      if (stringMatch(category2,element.summary)) {
        listcategory2.push(element);
      }
    });
    console.log(listcategory2);

    var category3 = '[Non core]'
    var listcategory3 = [];
    execution_list.forEach(element => {
      if (stringMatch(category3,element.summary)) {
        listcategory3.push(element);
      }
    });
    // console.log(listcategory3);

    var category4 = '[Experts ops]'
    var listcategory4 = [];
    execution_list.forEach(element => {
      if (stringMatch(category4,element.summary)) {
        listcategory4.push(element);
      }
    });
    // console.log(listcategory4);

    // FUNCTION Get total mins in a type of events list
    function getTotalMins(array) {
      total_minutes = 0;
      array.forEach(element => {
        start = element.start;
        end = element.end;
        start_time = start.dateTime;
        end_time = end.dateTime;
        total_minutes += getMins(start_time,end_time);
      });
      return total_minutes;
    }
    var total_minutes1 = getTotalMins(listcategory1);
    var total_minutes2 = getTotalMins(listcategory2);
    var total_minutes3 = getTotalMins(listcategory3);
    var total_minutes4 = getTotalMins(listcategory4);

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
      data.addColumn('number', 'Mins');
      data.addRow([category1, total_minutes1]);
      data.addRow([category2, total_minutes2]);
      data.addRow([category3, total_minutes3]);
      data.addRow(['Recruiter ops', total_minutes4]);

      // Set chart options
      var options = {'title':'Time is money',
                    'width':600,
                    'height':450};

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }

    



    }
  )};