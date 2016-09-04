#!flask/bin/python
from flask import render_template, jsonify, request
from app import app
from app import mongo
import json
from bson import Binary, Code, json_util
from bson.json_util import dumps, loads
# import datetime
from dateutil.parser import parse
import pprint

from flask_security import Security, UserMixin, RoleMixin, login_required, \
	current_user
from flask_security.utils import encrypt_password

from flask_mongoengine import MongoEngine

from wtforms import form, fields, validators

import flask_admin as admin
import flask_login as login
from flask_admin.contrib.mongoengine import ModelView
from flask_admin import helpers

from flask import render_template, url_for, request, session, redirect


# import bcrypt



@app.route('/admin')
def admin():
	if 'username' in session:
		# admin_name = session['username']
		return render_template('admin/admin_panel.html',
							   admin_name=session['username'])
	# return 'You are logged in as ' + session['username']

	return render_template('admin/index.html')


@app.route('/login', methods=['POST'])
def login():
	users = mongo.db.users
	login_user = users.find_one({'username': request.form['username']})

	if login_user:
		# if bcrypt.hashpw(request.form['pass'].encode('utf-8'), login_user['password'].encode('utf-8')) == login_user['password'].encode('utf-8'):

		if request.form['pass'] == login_user['password']:
			session['username'] = request.form['username']
			return redirect(url_for('admin'))

	return 'Invalid username/password combination'


@app.route('/logout')
def logout():
	session.clear()
	return redirect(url_for('admin'))


@app.route('/admin/sites', methods=['POST', 'GET'])
def admin_get_sites():
	if 'username' in session:

		docs_list = list(mongo.db.sites.find())
		# print  docs_list
		records = ({"Result": "OK", "Records": docs_list})
		return json.dumps(records, default=json_util.default)
	# records = json.dumps(docs_list, default=json_util.default)

	# return jsonify({"Result":"OK", "Records": docs_list})
	# 		{"_id":1,"name":"Benjamin Button","overview":17,"description":"\/Date(1320259705710)\/", "location": "weew"}]})
	# return json.dumps(docs_list, default=json_util.default)
	else:
		return {}


@app.route('/getSites', methods=['POST', 'GET'])
def get_sites():
	# cursor = mongo.db.sites.find()
	# records = dict((str(record['_id']), record) for record in cursor)

	docs_list = list(mongo.db.sites.find())
	return json.dumps(docs_list, default=json_util.default)


@app.route('/createSite', methods=['POST'])
def create_site():
	print request.form
	site = dict.fromkeys(['name', 'description', 'overview'])
	site['name'] = request.form['name']
	site['description'] = request.form['description']
	site['overview'] = request.form['overview']
	site['location'] = dict.fromkeys(['x', 'y'])
	site['location']['x'] = request.form['x']
	site['location']['y'] = request.form['y']
	# site.location = {
	# 	'x': request.form['location']['x'],
	# 	'y': request.form['location']['y']
	# }
	# site = {"author": "Mike",
	# 		"text": "My first blog post!",
	# 		"tags": ["mongodb", "python", "pymongo"]}
	sites = mongo.db.sites
	site_id = sites.insert_one(site).inserted_id

	new_site = sites.find_one({"_id": site_id})
	record = ({"Result": "OK", "Record": new_site})
	return json.dumps(record, default=json_util.default)


@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')


@app.route('/map')
def map_render():
	return render_template('map-tool.html')


@app.route('/tests/<int:test_id>')
def test_render(test_id):
	return render_template('tests/' + str(test_id) + '.html')


@app.route('/sensor_search', methods=['POST', 'GET'])
def sensor_search():
	return db_test()


@app.route('/findSensors', methods=['POST', 'GET'])
def findSensors():
	# cursor = mongo.db.sensors_generic.find()
	cursor = []

	records = dict((record['_id'], record) for record in cursor)
	# I DON'T know why this works... thank you stackoverflow

	return jsonify(records)


@app.route('/getDataStream', methods=['POST', 'GET'])
def get_data_stream():
	data_stream_id = int(request.args['dataStreamId'])

	period_from = str(request.args.get('periodFrom', ''))
	period_to = str(request.args.get('periodTo', ''))
	rperiod_from = str(request.args.get('rperiodFrom', ''))
	rperiod_to = str(request.args.get('rperiodTo', ''))

	if not is_date(period_from):
		period_from = str(get_last_month())

	if not is_date(period_to):
		period_to = str(get_today())

	# if is_date(rperiod_from) and is_date(rperiod_to):
	# 	cursor = mongo.db.streams_test.find({'sensorId': data_stream_id,
	# 										 "$or": [{"timeValue": {
	# 													"$gt": period_from,
	# 													"$lt": period_to}},
	# 												{"timeValue": {
	# 													"$gt": rperiod_from,
	# 													"$lt": rperiod_to}}
	# 										]}).sort("timeValue", -1)
	# else:


	records = dict()
	items = list()

	# If request originates from jTable
	if request.args.get("jTable"):
		if request.args.get('jtStartIndex', '') and \
				request.args.get('jtPageSize', ''):

			startIndex = int(request.args.get('jtStartIndex', ''))
			pageSize = int(request.args.get('jtPageSize', ''))

			cursor = mongo.db.streams_test.find({'sensorId': data_stream_id,
												 "timeValue": {
													 "$gte": period_from,
													 "$lte": period_to}}
												).sort("timeValue", -1).skip(
				startIndex).limit(pageSize)
		else:
			cursor = mongo.db.streams_test.find({'sensorId': data_stream_id,
												 "timeValue": {
													 "$gte": period_from,
													 "$lte": period_to}}
												).sort("timeValue", -1)

		for record in cursor:
			xy = {"timeValue": record['timeValue'], "value": record["value"]}
			items.append(xy)

		records["Records"] = items
		records["TotalRecordCount"] = mongo.db.streams_test.count()
		records["Result"] = "OK"

	else:
		print period_from
		print period_to
		cursor = mongo.db.streams_test.find({'sensorId': data_stream_id,
											 "timeValue": {"$gte": period_from,
														   "$lte": period_to}}
											).sort("timeValue", -1)

		# cursor = mongo.db.streams_test.find({"sensorId": data_stream_id})
		# cursor = mongo.db.streams.aggregate([{"$project": {"items": 1}},
		# 									{"$unwind": "$items"},
		# 									{"$match": {
		# 										"$and": [{"_id": data_stream_id},
		# 												{"items.timeValue": {
		# 													"$gt": period_from}},
		# 												{"items.timeValue": {
		# 													"$lt": period_to}}]}},
		# 									{"$group": {"_id": "$_id", "items": {
		# 										"$push": "$items"}}}])

		# records = dict(("items", record['items']) for record in cursor)

		for record in cursor:
			xy = {"timeValue": record['timeValue'], "value": record["value"]}
			items.append(xy)
		records["items"] = items

	return jsonify(records)


def get_today():
	return parse("2016-04-05T00:00:00")


def get_last_month():
	# today = datetime.DateTime.day()
	# first = today.replace(day=1)
	# lastMonth = first - datetime.DateTime.timedelta(days=1)
	# return lastMonth
	return parse("2016-04-04T00:00:00")


# gets a string and returns if that string is in valid ISO-8601 date format
def is_date(string):
	try:
		parse(string)
		return True
	except ValueError:
		return False


@app.route('/component/test', methods=['POST', 'GET'])
def render_component():
	q = request.args['comp']
	result = q + ".html"
	return render_template(result)


@app.route('/retrieveTest')
def retrieveTest():
	return render_template("AjaxTest.html")


@app.route('/getInfoPane/<int:sensorId>')
def getContent(sensorId):
	# e = mongo.db.sensor_data.find({"sensorId" : sensorId})
	e = ""
	return render_template("infoWindow.html", content=e)


@app.route('/testInfoPane/<int:sensorId>')
def testContent(sensorId):
	# e = mongo.db.sensor_data.find({"sensorId" : sensorId})
	e = ""
	return render_template("testDataTable.html", content=e)


@app.route('/updateWindowPane/<int:sensorId>')
def updatePane(sensorId):
	# e = mongo.db.sensors_generic.find({"_id": sensorId})
	e = ""
	return render_template("info-pane.html", content=e)
