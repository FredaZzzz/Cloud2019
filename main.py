# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python37_app]
from flask import Flask, send_from_directory, request, render_template, redirect, url_for
from google.cloud import datastore
import json


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__, template_folder='static')

DS = datastore.Client()
EVENT = "Event"
ROOT = DS.key("Event", 5634472569470976)


def put_event(name, date_str):
    """Take variables: {name} {date_str}, insert into cloud datastore DS"""
    entity = datastore.Entity(key=DS.key(EVENT, parent=ROOT))
    entity.update({'name': name, 'date': date_str})
    DS.put(entity)
    return True


@app.route('/events')
def returnEvents():
    """
    Upon receipt of a GET '/events' request,
    convert json to string and add to datastore
    """
    query = DS.query(kind='Event')
    query.order = ['date']
    results = list(query.fetch())
    temp = json.dumps(results)
    temp = '{"events": ' + temp + '}'
    return temp


@app.route('/event', methods=['POST'])
def addEvent():
    """
    Upon receipt of a POST '/event' request,
    convert json to string and add to datastore
    """
    temp = json.loads(request.json)
    put_event(temp['name'], temp['date'])
    return 'ok'


@app.route('/event', methods=['DELETE'])
def delEvent():
    return "delEvent"


@app.route('/login', methods=['POST', 'GET'])
def login():
    print("in login")
    #return "hello world"
    #return send_from_directory('static', 'index.html')
    return redirect(url_for('index'))


@app.route('/index', methods=['GET'])
def index():
    #print("in index")
    return 'hello index'
    #return send_from_directory('static', 'index.html')


@app.route('/')
def loadHtml():
    """load the static/index.html page when requested"""
    return send_from_directory('static', 'login.html')


@app.route('/trans.js')
def loadJs():
    """load the static/trans.js page when requested"""
    return send_from_directory('static', 'trans.js')


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
