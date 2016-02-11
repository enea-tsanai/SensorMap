#!flask/bin/python
from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'NSF'
mongo = PyMongo(app)

from app import views