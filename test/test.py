from flask import Flask
app = Flask(name)

@app.route('/')
def hello_world():
    return 'hello world'

if name == 'main':
    app.run(host="0.0.0.0", port=5000)
