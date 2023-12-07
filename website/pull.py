# This file houses the defined custom functions to pull the requests from Yelp API, specifically for business search endpoint
# --------------------------
# Import dependencies
from .api_key import api_key
from jsonschema import validate
import requests
import pandas as pd

# Set up Yelp API constants
API_HOST = 'https://api.yelp.com/v3/businesses/search'
HEADERS = {'Authorization': 'bearer %s' % api_key}

# Schema for comparing in checking before extraction using jsonschema > validate
schema = {
    'alias': '',
    'categories': [],
    'coordinates': {},
    'display_phone': '',
    'distance': 0.00,
    'id': 'string',
    'image_url': '',
    'is_closed': True,
    'location': {},
    'name': '',
    'phone': '',
    'price': '',
    'rating': 0.0,
    'review_count': 0,
    'transaction': [],
    'url': ''
}

# Simple request function for bussiness search endpoint from Yelp API
def request(term = '', limit = 0, rad = 0, loc = ''):
    # Create the parameters for search
    params = {
        'term': term,
        'limit': limit,
        'radius': rad,
        'location': loc
    }
    
    # Send the request
    response = requests.get(API_HOST, headers = HEADERS, params = params)
    
    # Verify the response and return None if error returned else return the json data
    if 'error' in response.json().keys():
        return None
    else:
        return response.json()

# Function to verify the predefined schema on what we should be expecting before extracting
def verify_schema(data = None):    
    # Verify the object entered before extraction
    if data == None:
        return False
    elif not isinstance(data, dict):
        return False
    else:
        try:
            validate(instance=data['businesses'][0], schema=schema)
            return True
        except:
            return False

# Function to extract the id, name, price, rating, review_count, location (address 1, address 2, address 3, city, 
# state, zip_code), coordinates (latitude and longtitude), and phone into a DataFrame
def json_to_dataframe(data = None):
    if not verify_schema(data):
        return None
    else:
        data_df = pd.DataFrame(data['businesses'])
        return data_df