1.Visualization Project

 DESCRIPTION.: Visualization is a HTML based project built using D3 along with Leaflet library. The following are the main files that are of interest:
 
 a) index2.html: The main file that is a placeholder of all the contents.
 b) js/create_map.js: Contains the code that draws city map of chicago using leaflet and overlays markers using D3. These markers are placed at the latitude-longitude for a construction permit. The data for all the permits is obtained by calling API hosted by Chicago city database.
 c) js/slider.js: This file contains code for controls that are present on the page. The play button that animates permits and trends on a timed scale. There is an option to select density map v/s positional markers.
 d) js/create_analysis.js: This file contains visualization of the line charts showing the actual number of constructions vs predicted number of constructions.
 e) new_permits_by_ward_yyyy_mm_dd.json : File containing number of constructions per ward per month.
 f) monthly_coordinates.json : File containing the focal point of all the constructions per month.
 g) chicago_2015_wards.geojson : GeoJson file contianing the polygon definitions for all the wards in the city of chicago.
 h) future_permits_grouped.csv : This file contains number of constructions per month along with projections.
 
 INSTALLATION: The code is already deployed on AWS S3 and hosted as website. You can access the website at:
 https://dva-wasp.s3.amazonaws.com/workspace/index2.html
 
 EXECUTION: 
 Best option is to open the hosted website:
 https://dva-wasp.s3.amazonaws.com/workspace/index2.html
  
 The code can also be run on a local machine by downloading the latest code from github and run the local http server:
 <<github link>>
 
 Steps: 1) git clones -s <<github link>>
 2)goto folder workspace : cd /workspace
 3)run http server: python3 -m http.server
