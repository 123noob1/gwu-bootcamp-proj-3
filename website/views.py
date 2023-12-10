# Import dependencies
from flask import Blueprint, render_template

# Set up the Blueprint for Flask application
views = Blueprint('views', __name__)

# Main starting route
@views.route('/')
def main():
    return render_template('index.html')

# Route for map view page
@views.route('/map')
def map_page():
    return render_template('map.html')

# Route for json file with method GET (for practice explicitly indicating here otherwise GET is the default method)
@views.route('/dataset/merged.json', methods = ['GET'])
def get_data_json():    
    # Import the json libary for this route
    import json

    # Open and read the file before returning it
    with open('website\static\dataset\merged.json', 'r') as f:
        data = json.load(f)
        return data
    
# Route for accessing the database with method GET (for practice explicitly indicating here otherwise GET is the default method)
@views.route('/db-query', methods = ['GET'])
def get_db_result():
    # Import the required libraries to look into the sqlite database
    from flask import Response
    from sqlalchemy import create_engine
    import pandas as pd

    # Db path and query to pull data from
    db = 'website\coffee_chains.sqlite'

    # Create the engine and connection to the database
    engine = create_engine(f'sqlite:///{db}')
    conn = engine.connect()

    # Query all the data from the shop table in the database
    data = pd.read_sql('SELECT * FROM shops', conn).to_json(orient = 'records')
    
    # Close out of the engine
    engine.dispose()

    # Return the data by jsonifying it
    return Response(data, mimetype = 'application/json')