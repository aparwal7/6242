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
 https://github.com/aparwal7/6242.git
 
 Steps: 1) git clones -s https://github.com/aparwal7/6242.git
 2)goto folder workspace : cd /workspace
 3)run http server: python3 -m http.server
 4)goto browser and open : http://localhost:8000/index2.html
 
 
 2. VAR Analysis:
 
 DECRIPTION

	This README concerns "VAR.py" which contains all the code needed for the training, testing, and analysis of the Chicago building permit data set using a Vectorized Auto Regression.
	Data comes in through API with get_data(). The data is cleaned, aggregated, and split with clean_data(), get_annual_coordinates(), and split_data() respectively.
	Testing_harness() operates on training data to tune the hyperparameter p which is used in generate_final_predictions() to make forecasts for 2022 and 2023.
	Independently, get_monthly_means() function can be called to generate a json file with the monthly average coordinate data used in the visualization.
	
	
INSTALLATION

	1) Pull the project files from github: git clone https://github.com/aparwal7/6242.git
	2) Locate ./VAR/VAR.py
	
	
EXECUTION

	From the command line, run: "python VAR.py"
	Alternatively, run the VAR.py file from your IDE. Demo code is already included in the main function.


3. ARIMA Analysis

   DESCRIPTION:
   
   We have a python notebook, tsa.ipynb, that walks us through loading data into a pandas dataframe, performing some exploratory analysis, followed by our complete    ARIMA        analysis i.e. model training, fit and forecast and RMSE calculation.
   
   INSTALLATION : 
   
	1) Pull the project files from github: git clone https://github.com/aparwal7/6242.git
	2) Locate ./ARIMA/tsa.ipynb
	3) Before running, make sure you import key python packages - Pandas, Numpy, statsmodels.tsa.arima_model and pmdarima
