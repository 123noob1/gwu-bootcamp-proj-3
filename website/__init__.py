# Import dependency
from flask import Flask

# Initialize and create app function
def create_app():
    app = Flask(__name__)
    
    # Import the Blueprints
    from .views import views

    # Register the Blueprints and setting up the prefixes
    app.register_blueprint(views, url_prefix = '/')

    return app