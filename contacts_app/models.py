from main import db


class Contact(db.Model):
    __tablename__ = "Contact"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(564), default='Street ')
    birthday = db.Column(db.Date, nullable=True)
    phone = db.Column(db.String(20))


    def __init__(self, first_name, last_name, phone, address, birthday):
        self.first_name = first_name
        self.last_name = last_name
        self.address = address
        self.phone = phone
        self.birthday = birthday

    def serialize(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'address': self.address,
            'birthday': self.birthday.isoformat() if self.birthday else ""
        }
