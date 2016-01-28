from flask import Flask
# from flask.ext.pymongo import PyMongo

app = Flask(__name__)

# app.config['MONGO_DBNAME'] = 'geoData'
# mongo = PyMongo(app)

from app import views