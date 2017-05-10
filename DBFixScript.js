var firebase = require("firebase");
var restClient = require('node-rest-client').Client;

var initResult  = firebase.initializeApp({
  databaseURL: "https://sizzling-torch-3744.firebaseio.com",
  serviceAccount: "Newest-b4a5315e376f.json"
});

/*var url =  'https://sizzling-torch-3744.firebaseio.com/Users.json';
var client = new restClient();
client.get(url,function(data,response){
	var users = usersToUpdate(data);
	console.log('users');
	console.log(users);
	users.forEach(function(user){
		updateUser(user);
	})
});

var IsPOI = function(name){
	return name == 'test1' || name == 'test2';
}

var usersToUpdate = function(allUsers){
	var result = [];
	for(var user in allUsers){
		//console.log(allUsers[user]);
		for(var notificationSource in allUsers[user]['Notifications'])
			//console.log(user['Notifications']);
			if(IsPOI(notificationSource) && (result.indexOf({name:user, notifications : allUsers[user]}) < 0))
				result.push({name:user, notifications : allUsers[user]});
	}
	return [result[1],result[2]];
}


var updateUser= function(user){
	for(name in user.notifications['Notifications']){
		var currentUserRefString = '';
		console.log(name);
		if(IsPOI(name)){
			currentUserRefString = 'Users/' + user.name + '/Notifications/POINotifications'
			currentUserRef = firebase.database().ref('Users/' + user.name + '/Notifications/POINotifications');		
		}else{
			currentUserRef = firebase.database().ref('Users/' + user.name + '/Notifications/PolyNotifications');	
			currentUserRefString = 	'Users/' + user.name + '/Notifications/PolyNotifications';
		}
		console.log(currentUserRefString);
		console.log(user.notifications['Notifications'][name]);
		currentUserRef.child(name).set(user.notifications['Notifications'][name]);
		
	}
*/
//without poi
var url =  'https://sizzling-torch-3744.firebaseio.com/Users.json';
var client = new restClient();
client.get(url,function(data,response){
	var users = usersToUpdate(data);
	console.log('users');
	console.log(users);
	users.forEach(function(user){
		updateUser(user);
	})
});

var IsPOI = function(name){
	return name == 'test1' || name == 'test2';
}

var usersToUpdate = function(allUsers){
	var result = [];
	for(var user in allUsers){
		//console.log(allUsers[user]);
		for(var notificationSource in allUsers[user]['Notifications'])
			//console.log(user['Notifications']);
			if(!IsPOI(notificationSource) && (result.indexOf({name:user, notifications : allUsers[user]}) < 0))
				result.push({name:user, notifications : allUsers[user]});
	}
	return [result[0]];
}


var updateUser= function(user){
	for(name in user.notifications['Notifications']){
		var currentUserRefString = '';
		console.log(name);
		if(IsPOI(name)){
			currentUserRefString = 'Users/' + user.name + '/Notifications/POINotifications'
			currentUserRef = firebase.database().ref('Users/' + user.name + '/Notifications/POINotifications');		
		}else{
			currentUserRef = firebase.database().ref('Users/' + user.name + '/Notifications/PolyNotifications');	
			currentUserRefString = 	'Users/' + user.name + '/Notifications/PolyNotifications';
		}
		console.log(currentUserRefString);
		console.log(user.notifications['Notifications'][name]);
		currentUserRef.child(name).set(user.notifications['Notifications'][name]);
		
	}
}