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