import pandas as pd
from statsmodels.tsa.vector_ar.var_model import VAR
import matplotlib.pyplot as plt


def get_data():
    raw_data = pd.read_json('https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=latitude>0&$limit=4000')
    return raw_data


def clean_data(raw_data):
    '''
    Input is the raw_data from get_data().

    
    Returns
    -------
    Cleaned dataframe. Ready for processing and calculations.
    Columns are ['issue_date', 'latitude', 'longitude', 'year', 'month']

    '''
    data = raw_data[['issue_date', 'latitude', 'longitude']]
    data.loc[:, 'issue_date'] = pd.to_datetime(data.loc[:, 'issue_date'])
    data['year'] = data['issue_date'].dt.year
    data['month'] = data['issue_date'].dt.month
    return data


def get_annual_coordinates(clean_data):
    '''
    Gets the average ANNUAL coordinates.

    Returns DF with columns = ['avg_latitude', 'avg_longitude']

    '''
    grouped = clean_data.groupby(['year']).mean()
    df_coords = grouped.reset_index() # columns = ['year', 'month', 'latitude', 'longitude'] This is sorted

    df_coords = df_coords.drop(['year', 'month'], axis=1)

    # Index gets messed up by year filtering
    df_coords = df_coords.reset_index()
    df_coords = df_coords.drop(['index'], axis=1)
    df_coords = df_coords.rename(columns={'latitude': 'avg_latitude', 'longitude': 'avg_longitude'})

    return df_coords


def split_data(df, train_size=0.8):
    split_index = int(train_size * len(df))
    df_train = df.iloc[:split_index, :]
    df_test = df.iloc[split_index:, :]
    return df_train.reset_index(drop=True), df_test.reset_index(drop=True)




def assess_performance(df_train, maxlags):
    '''
    

    Input is maxlags, train data, test data

    Return the AIC, LL for a given lag order
        
    '''
    model = VAR(endog=df_train)
    results = model.fit(maxlags=maxlags, ic='aic')

    aic = results.aic
    loglike = results.llf
    return (aic, loglike)


def testing_harness(df_train, display=False):
    '''
    Single function to call to collect data about parameter tuning

    Parameters
    ----------
    df_train : pandas DF of training samples.

    Returns
    -------
    results : pandas DF containing the AIC and log likelihood of various maxlags

    '''
    results = []
    for i in range(4):
        hold = [i]
        aic, ll = assess_performance(df_train, maxlags=i)
        hold.append(aic)
        hold.append(ll)
        results.append(hold)
    results = pd.DataFrame(results, columns=['order', 'AIC', 'log_likelihood'])
    if display:
        print()
        print('Results of parameter tuning: ')
        print()
        print(results)
        fig, (ax1, ax2) = plt.subplots(2, sharex=True)
        fig.suptitle('Tuning the Optimal Lag Order')


        ax1.plot(results['order'], results['AIC'], label='AIC', color='orange')
        ax1.legend()


        ax2.plot(results['order'], results['log_likelihood'], label='Log Likelihood')

        ax2.legend()

        plt.xlabel('Lag Order')

    return results

def generate_final_predictions(df_coords, lag_order=3, display=False):
    '''
    
    Uses the best lag_order (from testing_harness) to train the full model
    and forecast mean coordinates for the years 2022 and 2023. Returns a DF
    
    '''
    model = VAR(endog=df_coords)
    model = model.fit(lag_order)
    forecast = model.forecast(model.y, steps=2)

    df_forecast = pd.DataFrame(forecast, columns=['future_latitude', 'future_longitude'])
    df_forecast['year'] = [2022, 2023]
    df_forecast = df_forecast[['year', 'future_latitude', 'future_longitude']]

    if display:
        print()
        print('Final model information:')
        print()
        print(model.summary())
        print()
        print('Future hotspot forecasts:')
        print()
        print(df_forecast)
    return df_forecast


def get_monthly_means(to_json=False, orient='table'): # Stand alone method
    '''
    Set to_json to true to produce a json "monthly_coordinates.json".
    orient determines the format of the json. Does nothing if to_json=False

    Returns DF with columns ['latitude', 'longitude', 'year', 'month']
    '''

    raw_data = get_data()
    df_clean = clean_data(raw_data)

    grouped = df_clean.groupby(['year', 'month']).mean()
    df = grouped.reset_index()
    df = df.rename(columns={'latitude': 'avg_latitude', 'longitude': 'avg_longitude'})

    if to_json:
        df.to_json('monthly_coordinates.json', orient=orient)
    return df



if __name__ == '__main__':
    # Prepare data
    raw_data = get_data()
    clean_data = clean_data(raw_data)
    df_coords = get_annual_coordinates(clean_data)
    df_train, df_test = split_data(df_coords)

    # Run model evaluation and make final projections
    test = testing_harness(df_train, display=True)
    forecast = generate_final_predictions(df_coords, display=True)

    # Evaluate the test set (df_test)
    # model = VAR(endog=df_train)
    # model = model.fit(3)
    # pred = model.forecast(model.y, steps=len(df_test))