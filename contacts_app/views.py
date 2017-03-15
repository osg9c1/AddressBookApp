import os
from flask import jsonify
from flask import render_template, request
from flask.helpers import send_from_directory
from config import app, db

@app.route('/static/<path:filename>')
def serve_static(filename):
    root_dir = os.path.dirname(os.getcwd())
    return send_from_directory(os.path.join(root_dir, 'static', 'js'), filename)


@app.route('/')
def homepage():
    '''
    Landing page
    :return: list of all Contact objects
    '''
    from models import Contact
    contacts = Contact.query.all()
    contacts_list = [{"first_name": "New", "last_name": "Contact"}]
    contacts_list.extend([c.serialize() for c in contacts])
    return render_template('view.html', contacts={'contacts': contacts_list})


@app.route('/search/', defaults={'query': None})
@app.route('/search/<query>')
def search_contacts(query):
    '''
    If query is None return all contacts else search contacts based on first or last name
    :param query: String
    :return: list of Contact objects
    '''
    from models import Contact
    if not query:
        contacts = Contact.query.all()
    else:
        contacts = Contact.query.filter(
            Contact.first_name.startswith(query) | Contact.last_name.startswith(query)).all()
    contacts_list = [{"first_name": "New", "last_name": "Contact"}]
    contacts_list.extend([c.serialize() for c in contacts])
    return jsonify(data=contacts_list)


@app.route('/add', methods=['POST'])
def add_contact():
    '''
    Store a new contact
    :return: success or failure message
    '''
    from models import Contact
    from datetime import date
    if request.method == 'POST':
        try:
            contact_data = request.form
            if not contact_data["birthday"]:
                birthday = None
            else:
                birthday = contact_data["birthday"]
                birthday = date(*map(int, birthday.split('-')))
            contact_obj = Contact(contact_data["first_name"], contact_data["last_name"], contact_data["phone"],
                                  contact_data["address"],
                                  birthday)
            db.session.add(contact_obj)
            db.session.commit()
        except Exception as e:
            return jsonify(message=str(e))
        return jsonify(message="Successfully added contact!")
    else:
        return jsonify(message="Contact not found!")


@app.route('/<contact_id>', methods=['PUT', 'DELETE', 'POST'])
def edit_contact(contact_id):
    '''
    Edit an existing contact, and store in db
    :param contact_id: Contact.id
    :return: success or failure message
    '''
    from models import Contact
    from datetime import date
    if request.method == 'PUT':
        try:
            contact_data = request.form
            if not contact_data["birthday"]:
                birthday = None
            else:
                birthday = contact_data["birthday"]
                birthday = date(*map(int, birthday.split('-')))
            Contact.query.filter_by(id=contact_id).update({"first_name": contact_data["first_name"],
                                                           "last_name": contact_data["last_name"],
                                                           "phone": contact_data["phone"],
                                                           "address": contact_data["address"],
                                                           "birthday": birthday})
            db.session.commit()
            return jsonify(message="Successfully updated contact!")
        except Exception as e:
            return jsonify(message=str(e))
    elif request.method == 'DELETE':
        try:
            contact = Contact.query.filter_by(id=contact_id).first()
            db.session.delete(contact)
            db.session.commit()
        except Exception as e:
            return jsonify(message=str(e))
        return jsonify(message="Successfully deleted contact")
    else:
        return jsonify(message="Contact not found!")
