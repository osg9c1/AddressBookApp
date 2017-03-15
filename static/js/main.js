
var If = React.createClass({
    render: function() {
        if (this.props.bool) {
            return this.props.children;
        }
        else {
            return false;
        }
    }
});

var SearchPanel = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="one-fourth column">
          <input ref='search' type='text' placeholder="Search" value={this.props.search} onChange={this.onSearchChanged} />
          {this.props.search?<button onClick={this.props.onClearSearch}>x</button>:null}
        </div>
      </div>
    )
  },
  onSearchChanged: function() {
    var query = ReactDOM.findDOMNode(this.refs.search).value;
    this.props.onSearchChanged(query);
  }
});

var ContactTableRow = React.createClass({
  render: function() {
    return (
      <tr>


        <td><a href='#' onClick={this.onClick}>{this.props.contact.first_name} {this.props.contact.last_name}</a></td>
        <If bool = {this.props.checkBirthday(this.props.contact.birthday)}>
      <img src="../../static/images/cake.jpeg"></img>
      </If>

      </tr>
    );
  },
  onClick: function(id) {
    this.props.handleEditClickPanel(this.props.contact.id);
  }
});

var ContactTable = React.createClass({
  render: function() {
    var rows = [];
    if(this.props.contacts.length > 0){
    this.props.contacts.forEach(function(contact) {
      rows.push(<ContactTableRow key={contact.id} contact={contact} handleEditClickPanel={this.props.handleEditClickPanel} checkBirthday={this.props.checkBirthday} />);
    }.bind(this));
    }
    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  }
});

var AddContactForm = React.createClass({
  render: function() {
    return(

      <form onSubmit={this.props.handleSubmitClick}>
     {this.props.message?<div className="info"><span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>{this.props.message}</div>:null}
       <input placeholder="Bruce"  required={true} ref='first_name' name='first_name' type='text' value={this.props.contact.first_name} onChange={this.onChange}/> <input ref='last_name' required={true} placeholder="Lee" name='last_name' type='text' value={this.props.contact.last_name} onChange={this.onChange}/>
        {this.props.contact.phoneError?<div className="alert">
          <span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
          {this.props.contact.phoneError}
         </div>:null}
        <label forHtml='phone'>Phone</label> <input ref='phone' placeholder="XXX-XXX-XXXX" name='phone' type='tel' value={this.props.contact.phone} onChange={this.onChange}/>
        <label forHtml='address'>Address</label><textarea ref='address'  name='address' placeholder="Street                                                            City State ZIP                                                   Country" type='text' value={this.props.contact.address || ""} onChange={this.onChange} rows="5" cols="30"/>
        {this.props.contact.dateError?<div className="alert">
          <span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
          {this.props.contact.dateError}
         </div>:null}
        <label forHtml='birthday'>Birthday</label>
        <input ref='birthday' placeholder="YYYY-MM-DD" name='birthday' type='text' value={this.props.contact.birthday} onChange={this.onChange}/>

        <br />
        <input type='submit' value={this.props.contact.id?"Save":"Add"} />
        {this.props.contact.id?<button onClick={this.props.handleDeleteClick}>Delete</button>:null}
        {this.props.contact.id?<button onClick={this.props.handleCancelClick}>Cancel</button>:null}

      </form>

    );
  },
  onChange: function() {
    var first_name = ReactDOM.findDOMNode(this.refs.first_name).value;
    var last_name = ReactDOM.findDOMNode(this.refs.last_name).value;
    var phone = ReactDOM.findDOMNode(this.refs.phone).value;
    var address = ReactDOM.findDOMNode(this.refs.address).value;
    var birthday = ReactDOM.findDOMNode(this.refs.birthday).value;
    this.props.handleChange(first_name, last_name, phone, address, birthday);
  }
});

var ContactPanel = React.createClass({
  getInitialState: function() {

    return {
    contacts: [{"first_name": "New", "last_name": "Contact"}],
    contacts_groups: [],
      url: window.location.href,
      editingContact: {
        first_name:"",
        last_name:"",
        phone: "",
        address: "",
        birthday: "",
        dateError: "",
        id: 0,
      },

      search:"",
      message:""
    };
  },
  render: function() {
    return(
      <div className="row">

        <div className="one-half column">
          <SearchPanel
            search={this.state.search}
            onSearchChanged={this.onSearchChanged}
            onClearSearch={this.onClearSearch}
          />
          <ContactTable contacts={this.state.contacts} handleEditClickPanel={this.handleEditClickPanel} checkBirthday={this.checkBirthday} />
        </div>
        <div className="divider mobile-hide"></div>
        <div className="one-half column">
        <h3>Contacts</h3>
          <AddContactForm
            contact={this.state.editingContact}
            message={this.state.message}
            handleChange={this.handleChange}
            handleSubmitClick={this.handleSubmitClick}
            handleCancelClick={this.handleCancelClick}
            handleDeleteClick={this.handleDeleteClick}
            validateDate={this.validateDate}
            validatePhone={this.validatePhone}
          />
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    this.reloadContacts('');
  },

  onSearchChanged: function(query) {
  if (this.promise) {
    clearInterval(this.promise)
  }
  this.setState({
    search: query
  });
  this.promise = setTimeout(function () {
    this.reloadContacts(query);
  }.bind(this), 200);
},
onClearSearch: function() {
  this.setState({
    search: ''
  });
  this.reloadContacts('');
},
handleSelectGroupPanel: function(id){
//var contact_group = $.extend({}, this.state.contacts.filter(function(x) {
//    return x.id == id;
//  })[0] );
  this.reloadContacts(id);

},
handleEditClickPanel: function(id) {
  var contact = $.extend({}, this.state.contacts.filter(function(x) {
    return x.id == id;
  })[0] );

  this.setState({
    editingContact: contact,
    message: ''
  });
},
handleChange: function(first_name, last_name, phone, address, birthday) {
    var dateError = undefined;
    var phoneError = undefined;
    if(!this.validateDate(birthday)){
    dateError='Please use yyyy-mm-dd format for date';
    }
    if(!this.validatePhone(phone)){
    phoneError = 'Please enter a valid phone number';
    }
    this.setState({
        editingContact: {
            dateError:dateError,
            phoneError:phoneError,
            first_name: first_name,
            last_name:last_name,
            phone: phone,
            address: address,
            birthday: birthday,
            id: this.state.editingContact.id
        }
    });
},
handleCancelClick: function(e) {
  e.preventDefault();
  this.setState({
    editingContact: {}
  });
},
reloadContacts: function(query) {
    $.ajax({
      url: this.state.url+'search/'+query,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          contacts: data["data"],
          contacts_groups: [],
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.state.url, status, err.toString());
        this.setState({
          message: "",
          search: query
        });
      }.bind(this)
    });

  },
  handleSubmitClick: function(e) {
   e.preventDefault();
  if(this.state.editingContact.dateError) {
    this.setState({
        message: "Please fix errors!"
    });
    return ;
    }
  if(this.state.editingContact.phoneError) {
    this.setState({
        message: "Please fix errors!"
    });
    return ;
    }

    if(this.state.editingContact.id) {
      $.ajax({
        url: this.state.url+this.state.editingContact.id,
        dataType: 'json',
        method: 'PUT',
        data:this.state.editingContact,
        cache: false,
        success: function(data) {
          this.setState({
            message: data["message"]
          });
          this.reloadContacts('');
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
          this.setState({
            message: err.toString()
          });
        }.bind(this)
      });
    } else {
      $.ajax({
        url: this.state.url+'add',
        dataType: 'json',
        method: 'POST',
        data: this.state.editingContact,
        cache: false,
        success: function(data) {
          this.setState({
            message: data["message"]
          });
          this.reloadContacts('');
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.state.url, status, err.toString());
          this.setState({
            message: err.toString()
          });
        }.bind(this)
      });
    }
    this.setState({
      editingContact: {}
    });
  },
  handleDeleteClick: function(e) {
  e.preventDefault();
  $.ajax({
    url: this.state.url+this.state.editingContact.id,
    method: 'DELETE',
    cache: false,
    success: function(data) {
      this.setState({
          message: data["message"],
          editingContact: {}
      });
      this.reloadContacts('');
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(this.state.url, status, err.toString());
      this.setState({
          message: err.toString()
      });
    }.bind(this)
    });
  },
  checkBirthday: function(birthday){
  if (birthday){
  var currentday = new Date();
  var currentdate_str = currentday.toLocaleDateString();
  var currentdate = currentdate_str.split("/");
  var birthdate = birthday.split('-');
  if(parseInt(currentdate[0]) == parseInt(birthdate[1]) && parseInt(currentdate[1]) == parseInt(birthdate[2])){
    return true;
  }
  return false;
  }
  return false;
  },
  validateDate: function (date) {
  if(date){
    // validate date format YYYY-MM-DD if a date is entered
    var re = /^(?:[0-9]{2})?[0-9]{2}-[0-3]?[0-9]-[0-3]?[0-9]$/;
    return re.test(date);
    }
    else{
    return true;
    }
  },
  validatePhone: function(phone) {
  if(phone){
  // validate phone number format XXX-XXX-XXXX/(XXX)XXX-XXXX if a phone number is entered
  var re = /^((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}$/;
  return re.test(phone)
  }
  else{
  return true;
  }
}

});



ReactDOM.render(

  <ContactPanel />,
  document.getElementById('content')
);