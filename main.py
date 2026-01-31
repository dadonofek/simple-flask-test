from flask import Flask
import os

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello from Railway! 🚂'

if __name__ == '__main__':
    # Railway provides the PORT environment variable
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
