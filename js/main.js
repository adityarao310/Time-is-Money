////////////// ------- |||||| ACTUAL STUFF ////////////// ------- |||||| 
////////////// ------- |||||| ACTUAL STUFF ////////////// ------- |||||| 
////////////// ------- |||||| ACTUAL STUFF ////////////// ------- |||||| 


// VARIABLES enter the required dates here
var last_date = moment("2018-05-06 09:00").toISOString();
var first_date = moment("2018-05-11 19:00").toISOString();
// VARIABLES work starts and ends when usually?
start_work = moment("09", "HH");
end_work = moment("19", "HH");

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

  function getData() {
    // Load data from Google Calendar
    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': last_date,
      'timeMax': first_date,
      'showDeleted': false,
      'singleEvents': true,
    }).then(function(resp) {
      var events_list = resp.result.items; 
      // console.log(events_list);
    
      // remove shit and make final proper list 
      final_list = [];
      events_list.forEach(element => {
        if (isEventShit(element)) {
          final_list.push(element);
        }
      }); 
      // console.log(final_list);

      // make a list of all meeting events from final list
      meeting_list = [];
      final_list.forEach(element => {
          if (isEventMeeting(element)) {
              meeting_list.push(element);
          }
      });
      // console.log(meeting_list);
  
      // make a list of all execution events from final list
      execution_list =[];
      final_list.forEach(element => {
        if (isEventExecution(element)) {
          execution_list.push(element);
        }
      });
      // console.log(execution_list);
  
  
      // make a list of all categories from execution list
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

      var category5 = '[Candidate call]'
      var listcategory5 = [];
      execution_list.forEach(element => {
        if (stringMatch(category4,element.summary)) {
          listcategory5.push(element);
        }
      });
      // console.log(listcategory5);
  
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

      // Store and change all inputs that will go into the design in this section

      // Header Summary Score - 1
      var avg_office_day = (getTotalMins(final_list)/5/60).toFixed(2);
      var summary_score_1 = document.getElementById('summary_score_1');
      summary_score_1.innerHTML = avg_office_day;
      
      // Header Summary Score - 2
      var meetings_in_week = meeting_list.length;
      var summary_score_2 = document.getElementById('summary_score_2');
      summary_score_2.innerHTML = meetings_in_week;

      // Header Summary Score - 3
      var avg_execution_day = (getTotalMins(execution_list)/5/60).toFixed(2);
      var summary_score_3 = document.getElementById('summary_score_3');
      summary_score_3.innerHTML = avg_execution_day;

      // Header Summary Score - 4. Assume 5 days, 9 AM - 7 PM should be total time
      var total_accountable_minutes_week = (end_work.diff(start_work, 'hours'))*5*60;
      var minutes_unaccounted = total_accountable_minutes_week - getTotalMins(final_list);
      var minutes_unaccounted_percent = (minutes_unaccounted/total_accountable_minutes_week*100).toFixed(2);
      var summary_score_4 = document.getElementById('summary_score_4');
      summary_score_4.innerHTML = minutes_unaccounted_percent;

      // Overall time split - pie chart data. Format is [(name, total_minutes)]
      var total_minutes1 = getTotalMins(listcategory1);
      var total_minutes2 = getTotalMins(listcategory2);
      var total_minutes3 = getTotalMins(listcategory3);
      var total_minutes4 = getTotalMins(listcategory4);
      var total_minutes5 = getTotalMins(listcategory5);

        // Load the Visualization API and the corechart package.
        // Set a callback to run when the Google Visualization API is loaded.
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);

        // Callback that creates and populates a data table, instantiates the pie chart, passes data to draw
        function drawChart() {
        // Create the new pie chart.
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Type of execution');
        data.addColumn('number', 'Mins');
        data.addRow([category1, total_minutes1]);
        data.addRow([category2, total_minutes2]);
        data.addRow([category3, total_minutes3]);
        data.addRow([category4, total_minutes4]);
        data.addRow([category5, total_minutes5]);

        // Set chart options
        var options = {

                    };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart(document.getElementById('pie_graph_chart'));
        chart.draw(data, options);
        }

    }
    )};