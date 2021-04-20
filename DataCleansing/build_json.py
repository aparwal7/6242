import csv
import json
import pandas as pd
from collections import OrderedDict
'''
{
"type": "FeatureCollection",
"crs": { "type": "name", "properties": { "name": "urn:fillin" } },
                                                                                
"features": [
{ "type": "Feature", 
  "properties": { "latitude": 40.722390, "longitude": -73.995170, "time": 1, "month":"2010-01", id": "1", "name":"Community Area 1", "permits"="30" }, 
  "geometry": { "type": "Point", "coordinates": [ -73.99517, 40.72239 ] } },
  ....
]
}
'''

# Utility to build a GEO JSON formatted file
def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
    geojson = {"type": "FeatureCollection", "features": []}
    for _, row in df.iterrows():
        feature = {"type": "Feature",
                   "properties": {},
                   "geometry": {"type": "Point", "coordinates": []}}
        feature["geometry"]["coordinates"] = [row[lon], row[lat]]
        for prop in properties:
            feature['properties'][prop] = row[prop]
        geojson['features'].append(feature)
    return geojson

# Converts CSV to JSON.  Expected csv file with columns: TODO
def convert_community_area_to_geojson (csv_filename, geojson_filename, compact=False):
    # see https://geoffboeing.com/2015/10/exporting-python-data-geojson/
    df = pd.read_csv (csv_filename)
    # df.to_json (geojson_filename)

    properties = ["COMMUNITY_AREA", "month", "permits"]
    json_data = df_to_geojson(df, properties, lat="LATITUDE_CTR", lon="LONGITUDE_CTR")
    with open(geojson_filename, 'w', encoding='utf-8') as f:
        if compact:
            json.dump(json_data, f, ensure_ascii=False, separators=(',', ':'))
        else:
            json.dump(json_data, f, ensure_ascii=False, indent=4)


# Converts CSV to JSON.  Expected csv file with columns: TODO
def convert_chicago_to_geojson (csv_filename, geojson_filename, compact=False):
    # see https://geoffboeing.com/2015/10/exporting-python-data-geojson/
    df = pd.read_csv (csv_filename)
    # df.to_json (geojson_filename)
    # enrich the data frame
    df['name'] = 'Along route'
    df['id'] = 'route1'

    properties = ["month", "permits", "latitude", "longitude", "name", "id"]
    json_data = df_to_geojson(df, properties, lat="latitude", lon="longitude")

    with open(geojson_filename, 'w', encoding='utf-8') as f:
        if compact:
            json.dump(json_data, f, ensure_ascii=False, separators=(',', ':'))
        else:
            json.dump(json_data, f, ensure_ascii=False, indent=4)

# Converts CSV to JSON.  Expected csv file with columns:  WARD, month, permits
def convert_ward_to_json(csv_filename, json_filename, fill_gaps=True, compact=False):
    df = pd.read_csv (csv_filename)
    if fill_gaps:
        # Fill in the month gaps
        empty_df = build_empty_df()
        # take_larger = lambda s1, s2: s1 if s1.permits > s2.permits else s2
        merged_df = pd.merge(empty_df, df, how='outer', on=['WARD', 'month']).fillna(0)
        merged_df = merged_df.drop(columns=['permits_x']).rename(columns={'permits_y': 'permits'}).astype({'permits': 'int'})
        df = merged_df.sort_values(['WARD', 'month'], ascending=[1, 1])

    if compact:
        df.to_json (json_filename)
    else:
        df.to_json (json_filename, orient="table", indent=4)

# Generates an empty data frame compatible with expected CSV (with 0 values for all 'permits')
def build_empty_df ():
    permits = 0
    data = []
    for ward in range(1, 51):
        for year in range(2006, 2021):
            for month in range(1, 13):
                the_date = str(year) + "-" + str(month).zfill(2) + "-" + "01"
                row = {'WARD': ward, 'month': the_date, 'permits': 0}
                data.append(row)
        year = 2021
        for month in range(1, 5):
            the_date = str(year) + "-" + str(month).zfill(2) + "-" + "01"
            row = {'WARD': ward, 'month': the_date, 'permits': 0}
            data.append(row)
    df = pd.DataFrame(data)
    return df

if __name__ == '__main__':
    convert_ward_to_json('new_permits_by_ward_yyyy_mm_dd.csv', 'new_permits_by_ward_yyyy_mm_dd.json', compact=False)
    # convert_community_area_to_geojson('location_ctr_by_community_area_month.csv', 'location_ctr_by_community_area_month.geojson', False)
    # convert_chicago_to_geojson('new_permits_chicago_by_month.csv', 'new_permits_chicago_by_month.geojson', False)