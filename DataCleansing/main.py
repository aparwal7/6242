# This is a sample Python script.

# Press ⌃R to execute it or replace it with your code.
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.


def print_hi(name):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press ⌘F8 to toggle the breakpoint.
    import dask.dataframe as dd
    import pandas as pd

    df = dd.read_csv('../Building_Permits.csv',usecols=['ID', 'PERMIT#', 'PERMIT_TYPE','ISSUE_DATE','LATITUDE','LONGITUDE'], dtype={'ID':"string", 'PERMIT#':"string", 'PERMIT_TYPE':"string",'ISSUE_DATE':'string','LATITUDE':'float64','LONGITUDE':'float64'})
    df=df.dropna()
    # df['ISSUE_DATE'] = pd.to_datetime(df['ISSUE_DATE'], infer_datetime_format=True)
    df=df[(df["PERMIT_TYPE"]=='PERMIT - NEW CONSTRUCTION')]
    df=df[(df["ISSUE_DATE"])>'01/01/2020']
    # display(df)
    df.to_csv('output.csv', index=False)


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    print_hi('PyCharm')

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
