function getData() {
 // Load data from Google Calendar
gapi.client.calendar.events.list({
  'calendarId': 'primary',
  'timeMin': (new Date()).toISOString(),
  'singleEvents': 'true',
}).then(function(resp) {
  var events = resp.result.items;
  return events;
});
}

console.log(events);

  

   