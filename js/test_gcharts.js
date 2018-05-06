google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

var data_pie = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
]);

var options_pie = {
};

var chart = new google.visualization.PieChart(document.getElementById('pie_chart_total'));

chart.draw(data_pie, options_pie);

var data_line = google.visualization.arrayToDataTable([
    ['Day',    'Execution hours', 'Meeting hours'],
    ['Mon',  2.4,               3.2],
    ['Tue',  4.4,               2.0],
    ['Wed',  5.1,               1.2],
    ['Thu',  3.1,               4.2],
    ['Fri',  1.4,               3.2],
  ]);

  var options_line = {
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('line_chart_execution'));

  chart.draw(data_line, options_line);

}