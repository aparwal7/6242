
import json
import requests
import pandas as pd    


r = requests.get("https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=permit_type='PERMIT - NEW CONSTRUCTION'")
x = r.json()

df = pd.DataFrame(x[:])

df['application_start_date'] = pd.to_datetime(df['application_start_date'])
df['month_year'] = df['application_start_date'].dt.to_period('M')
df2 = df.groupby(['month_year','ward']).size().sort_values(ascending=False).reset_index(name="count")
df2["count"] =df2["count"]+1
#need to enter path
df2.to_json(r'path\month_ward_permit.json')
