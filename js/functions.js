
// VARIABLES enter the required dates here
var last_date = moment("2018-04-27 09:00").toISOString();
var first_date = moment("2018-04-27 19:00").toISOString();

// FUNCTION Remove shit events i.e. find if specific event has email source from flights + if all day event
function isEventShit(object) {
  if (object.hasOwnProperty('source') == true || object.end.hasOwnProperty('date') == true) {
    return false; // came from email flight, remove it
  } else {
    return true;
  }
}

// FUNCTION Find if event is execution i.e. by created by me, and no other invitees
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

// FUNCTION Find string matches in a sentence - used for category of execution work
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

 // FUNCTION Main function to load the gcal stuff and print shit 
function getData() {


  // Load data from Google Calendar
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': moment("2018-04-27 17:00").toISOString(),
    'timeMax': moment("2018-04-27 19:00").toISOString(),
    'showDeleted': false,
    'singleEvents': true,
  }).then(function(resp) {
    var events_list = resp.result.items; 
    console.log(events_list);
  
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


    function insertData() {
      var dates_looking = 0;
      var summary_work_hours = 0;
      var summary_real_work_hours = 0;
      var summary_percent_accounted = 0;
    }

    // Load the Visualization API and the corechart package.
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    // Callback that creates and populates a data table, instantiates the pie chart, passes data to draw
    function drawChart() {
      // Create the new pie chart.
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Type of work');
      data.addColumn('number', 'Mins');
      data.addRow([category1, total_minutes1]);
      data.addRow([category2, total_minutes2]);
      data.addRow([category3, total_minutes3]);
      data.addRow(['Recruiter ops', total_minutes4]);

      // Set chart options
      var options = {
                    'width':600,
                    'height':450
                    };

      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.PieChart(document.getElementById('pie_graph_chart'));
      chart.draw(data, options);

      // Material line chart

      google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(drawChart);

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Day');
      data.addColumn('number', 'Execution Hours');
      data.addColumn('number', 'Meeting Hours');

      data.addRows([
        ['XXX',  37.8, 80.8],
        ['Tue',  30.9, 69.5],
        ['Wed',  25.4,   57],
        ['Thu',  11.7, 18.8],
        ['Fri',  11.9, 17.6],
      ]);

      var options = {
        chart: {
          title: 'Meetings vs Execution every day',
          subtitle: 'in number of hours'
        },
        width: 900,
        height: 500
      };

      var chart = new google.charts.Line(document.getElementById('line_graph_chart'));

      chart.draw(data, google.charts.Line.convertOptions(options));
    }


    }
    }
  )};