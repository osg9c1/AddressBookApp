# AddressBookApp

## Setup Environment

* Install pip
    * sudo apt-get install python-pip
* Install django 
    * sudo pip install django=1.4
* Install git
    * sudo apt-get install git

## Setup Application

* Checkout AddressBook from github
    * git clone https://github.com/osg9c1/AddressBook.git
* Run the App    
    * cd AddressBookApp
    * python contact_app/main.py

## Heroku Link:
https://safe-wave-19815.herokuapp.com/

## Problem Statement:
Write a web-based address book to keep track of your contacts.

The address book should contain entries with a person's name, contact information, and birthdate.

Users should be able to add, view and remove contacts. Any additional functionality on top of that

is a plus. In particular, you might consider ways to make it intuitive and convenient for a user to find

and retrieve information for a given contact.

The client should be a Single Page Application written in the JavaScript framework of your choice. It

should demonstrate your design/ux chops as well as technical proficiency. Discerning use of

additional packages is highly encouraged, but please be sure that the deliverable showcases your

ability to write code.

The server should consist of a minimal RESTful interface to a relational database. Use python and

flask for the server side code.


## Frameworks
Flask and ReactJS
### App Modeling
    Contact :: First Name, Last Name, Phone, Address, Birthday

### App Structure
    Left Side:
    Search Box  - Search for any existing contact by first or last name
    List of all existing contact - Below the Search Box all the existing contacts <First Name> <Last Name>
    if you click on it you see the details of the contact on the right side. "New Contact" on top of the list
    which clears the data on the right side to add a new contact.
    
    Right Side:
    Contact Form - To save, edit or delete a contact

## Features 
1. Add a Contact
2. Edit a Contact
3. Delete a Contact
4. Search a Contact
4. Birthday Icon to remind you of birthdays

## Goals for Ver 2.0
1. Contact Groups -  creating groups of contacts for various purposes
2. Adding Photos 
3. Calling a contact via the app
