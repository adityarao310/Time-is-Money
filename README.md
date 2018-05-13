# Actionable-Time-Management-Insights-for-Busy-Managers
Works best if you manage your day on google calendar as a tool. 

## Steps to use 
* Replace the key and client_id with your Google Calendar API key .. this is the part for OAuth 
* You can probably play around with the time in vanilla JS, but momentjs turned out to be a much simpler solution and made life easier
* Replace the logic on which kinda calendar events in your pie chart at main.js 
* It is currently not built for pulling text from calendar titles, but you can do that by simply using the key and value pair for "Title" in the final_list array
* Set up a quick webserver by any method e.g. python -m SimpleHTTPServer 8000 in your directory 
* Click on "Authorize" link to log in to your google calendar
* Unless you provide values in the code, the pie chart will be empty 
