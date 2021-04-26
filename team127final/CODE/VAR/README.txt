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