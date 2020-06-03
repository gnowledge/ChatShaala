//jshint esversion:6
const users = [];
const https = require('https');
const secrets = require('./secrets.js');
const querystring = require('querystring');
module.exports = {
  resetCurrUser: resetCurrUser,
  getUser: getUser,
  verifyUser: verifyUser,
  users: users,
  addNewUser: addNewUser,
  fetchGroups: fetchGroups,
  fetch_Group: fetch_Group

};

function resetCurrUser() {
  return new getUser('', '', '', '', '');
}


function getUser(email, password, name, userName, identity) {
  this.email = email;
  this.password = password;
  this.name = name;
  this.userName = userName;
  this.identity = identity;
}
/*
function verifyUser(curr_user) {
  for (var i = 0; i < users.length; i++) {
    var user = users[i];
    if (curr_user.userName === user.userName && curr_user.password === user.password) {
      curr_user.name = user.name;
      curr_user.email = user.email;
      curr_user.identity = user.identity;
      curr_user.login = true;
      user.login = true;
      return {
        status: true,
        index: i
      };
    }
  }
  return {
    status: false,
    index: -1
  };
}
*/
function addNewUser(req, res, name, email, password, userName, identity) {
  const url = secrets.url + 'users';
  const user = new getUser(email, password, name, userName, identity);
  const options = {
    method: 'POST',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  var data = {
    "name": name,
    "email": email,
    "password": password,
    "username": userName,
    "active": true,
    "approved": true,
    "user_fields[1]": identity
  };
  data = querystring.stringify(data);
  var request = https.request(url, options, function (response) {
    //console.log(response.statusCode);
    if (response.statusCode === 200) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        var result = JSON.parse(body);
        //console.log(result);
        if (result.success === true && result.active === true) {
          users.push(user);
          //console.log('yes');
          res.render('register.ejs', { status: 'Successfuly Registered, Kindly Login' });
        } else {
          //console.log('no');
          if (!users.includes(user)) {
            users.push(user);
          }
          res.render('register.ejs', { status: result.message });
        }
      });
      response.on('error', function () {
        console.log('error');
        res.redirect('/', { status: 'Error while registering, try again' });
      });
    } else {
      //console.log('no');
      res.redirect('/', { status: 'Error while registering, try again' });
    }
  });
  request.write(data);
  request.end();
}

function verifyUser(req, res, userName, password) {
  const url = secrets.url + 'session/';

  var data = {
    'login': userName,
    'password': password,
    'second_factor_method': 1
  };

  data = querystring.stringify(data);

  const options = {
    method: 'POST',
    headers: { 'Api-Key': secrets.key, 'Api-Username': 'system' }
  };

  var json_data = null;
  var request = https.request(url, options, function (response) {
    //console.log(response.statusCode);
    if (response.statusCode === 200) {
      var body = '';
      var result = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        result = JSON.parse(body);

        //console.log(result);
        json_data = result;
        if (result.error === 'Incorrect username, email or password') {
          res.render('register.ejs', { status: result.error });
        } else {
          fetchUserInfo(req, res, userName, password);
        }
      });
    } else {
      //console.log('no');
      res.render('register.ejs', {
        status: 'Not Registered yet, please register before login'
      });
    }
  });
  request.write(data);
  request.end();
}
function fetchUserInfo(req, res, userName, password) {
  var body = '';
  var url = secrets.url + 'users/' + userName + '.json';
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };

  https.get(url, options, function (response) {
    //console.log(response.statusCode);
    response.on('data', function (data) {
      body += data;
    });
    response.on('end', function () {
      body = JSON.parse(body);
      req.session.user = body.user;//storing user info
      req.session.badges = body.badges;//storing badges of user
      res.redirect('/home');
    }).on('error', function () {
      console.log('error');
    });
  });

}


function fetchGroups(req, res, home, about, blog, project, feedback, logout, profile) {
  var body = '';
  var url = secrets.url + 'groups' + '.json';
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url, options, function (response) {
    response.on('data', function (data) {
      body += data;
      console.log("hello");

    });
    response.on('end', function () {
      body = JSON.parse(body);
      var groups = [];
      groups = body.groups;
      console.log(groups);

      res.render("groups.ejs", {
        home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile, groups: groups
      })

    });


  }).on('error', function () {
    console.log('errorr');
  });



}




function fetch_Group(req, res, home, about, blog, project, feedback, logout, profile, id) {
  var body = '';
  var body2 = '';
  var body3 = '';
  var url1 = secrets.url + 'groups/' + id + '.json';
  var url2 = secrets.url + 'groups/' + id + '/members' + '.json';
  var url3 = secrets.url + 'groups/' + id + '/posts' + '.json';
  // console.log(url);
  var options = {
    method: 'GET',
    headers: {
      'Api-Key': secrets.key,
      'Api-Username': 'system'
    }
  };
  https.get(url1, options, function (response) {
    response.on('data', function (data) {
      body += data;

    });
    response.on('end', function () {
      body = JSON.parse(body);
      console.log("1");
      https.get(url2, options, function (response) {
        response.on('data', function (data) {
          body2 += data;

        });
        response.on('end', function () {
          body2 = JSON.parse(body2);
          
          var members = [];
          members = body2.members;
          console.log("2");
          https.get(url3, options, function (response) {
            response.on('data', function (data) {
              body3 += data;
    
            });
            response.on('end', function () {
              body3 = JSON.parse(body3);
              
              
              console.log("3");
              console.log(body3);
              //console.log(members);
    
    
    
    
              res.render("group.ejs", {
                home: home, about: about, blog: blog, project: project, feedback: feedback, logout: logout, profile: profile, body: body, members: members,posts:body3
              })
    
            });
    
    
    
          });

         





        });



      });



    });



  });


}