from flask import Flask, request
import os

app = Flask(__name__)

@app.route('/')
def index():
    return '''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Simple Calculator</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 400px;
                margin: 50px auto;
                padding: 20px;
                text-align: center;
            }
            input[type="number"] {
                width: 100px;
                padding: 10px;
                font-size: 18px;
                margin: 5px;
            }
            button {
                padding: 10px 30px;
                font-size: 18px;
                background-color: #4CAF50;
                color: white;
                border: none;
                cursor: pointer;
                margin-top: 10px;
            }
            button:hover {
                background-color: #45a049;
            }
            .result {
                margin-top: 20px;
                font-size: 24px;
                color: #333;
            }
        </style>
    </head>
    <body>
        <h1>Simple Adder</h1>
        <form action="/add" method="POST">
            <input type="number" name="num1" placeholder="Number 1" step="any" required>
            <span style="font-size: 24px;"> + </span>
            <input type="number" name="num2" placeholder="Number 2" step="any" required>
            <br>
            <button type="submit">Calculate</button>
        </form>
    </body>
    </html>
    '''

@app.route('/add', methods=['POST'])
def add():
    num1 = float(request.form.get('num1', 0))
    num2 = float(request.form.get('num2', 0))
    result = num1 + num2

    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>Result</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                max-width: 400px;
                margin: 50px auto;
                padding: 20px;
                text-align: center;
            }}
            .result {{
                font-size: 32px;
                color: #4CAF50;
                margin: 20px 0;
            }}
            a {{
                color: #2196F3;
                text-decoration: none;
                font-size: 18px;
            }}
            a:hover {{
                text-decoration: underline;
            }}
        </style>
    </head>
    <body>
        <h1>Result</h1>
        <p class="result">{num1} + {num2} = {result}</p>
        <a href="/">← Calculate Again</a>
    </body>
    </html>
    '''

if __name__ == '__main__':
    # Railway provides the PORT environment variable
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
