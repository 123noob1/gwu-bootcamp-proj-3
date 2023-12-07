# Import the dependencies
from website import create_app

# Initialize the app
app = create_app()

# Only run if the main file is run
if __name__ == '__main__':
    app.run(debug = True)