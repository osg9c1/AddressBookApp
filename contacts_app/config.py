
import os

from flask_sqlalchemy import SQLAlchemy
from flask import Flask

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:////{0}/app.db'.format(BASE_DIR)
STATIC_ROOT = os.path.join(os.path.dirname(BASE_DIR), "static")
app = Flask(__name__, static_url_path='/static')
app._static_folder = os.path.abspath("static/")
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config["STATIC_ROOT"] = STATIC_ROOT
app.config.from_object('config')

db = SQLAlchemy(app)

