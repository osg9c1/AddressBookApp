from flask.app import Flask
from flask_sqlalchemy import SQLAlchemy

from config import app, db
from models import *
from views import *


def create_tables():
    db.create_all()

if __name__ == '__main__':
    create_tables()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
