var firebase = require("firebase");
var poly = require("Polygon");
var Vec2 = require('vec2');
var restClient = require('node-rest-client').Client;
require("geolib");
var geoutils = require('geojson-utils');
var utils = require('./Util.js')
var geo = require('./georequire.js')

console.log('Initializing...');
var initResult  = firebase.initializeApp({
  databaseURL: "https://sizzling-torch-3744.firebaseio.com",
  serviceAccount: "Newest-b4a5315e376f.json"
});

///AUTH SNIPPET

//var auth = firebase.auth();
//var token = auth.createCustomToken("noti-control", {"worker_account": true});
//console.log('token');
//console.log(token);
//var iitcpolyexample= [{"type":"polygon","latLngs":[{"lat":45.505216,"lng":9.222642},{"lat":45.504145,"lng":9.240635},{"lat":45.492573,"lng":9.215099}],"color":"#a24ac3"}];
//var geoutilexample = {"type":"Polygon", "coordinates":[[[0,0],[6,0],[6,6],[0,6]]]}
//var geoutilexamplepoint = {"type":"Point","coordinates":[3,3]};

//var FirebasePoliPath =  new Firebase('https://sizzling-torch-3744.firebaseio.com/Polygons/');

//DB OPERATIONS
var GetAllPolygons = function(){
	var url =  'https://sizzling-torch-3744.firebaseio.com/Polygons.json';
	var client = new restClient();
	client.get(url,function(data,response){
		return data;
	})
}

var SetPolyNotifications= function(user,notifications,polyName){
	var notiRef = firebase.database().ref('Users/'+ user + '/Notifications/PolyNotifications/' + polyName);
	notiRef.set(notifications);
}

var SetPOINotifications = function(user,notifications,POIName){
	var POIRef = firebase.database().ref('Users/' + user + '/Notifications/POINotifications/' + POIName);
	POIRef.set([notifications]);
}

var SetPOIUsers = function(poi,users){
	var polyRef = firebase.database().ref('POI/' + poi + '/Users/');
	
	if(typeof users == 'undefined' || users.length == 0){
		polyRef.remove();
	}
	else{
		polyRef.set(users);
	}
}

var SetPolyUsers = function(polyname,users){
	var polyRef = firebase.database().ref('Polygons/' + polyname + '/Users/');

	if(typeof users == 'undefined' || users.length == 0){
		polyRef.remove();
	}
	else{
		polyRef.set(users);
	}
}

var RemoveNotifications = function(user,polyName){
	//var notiRef = new Firebase('https://sizzling-torch-3744.firebaseio.com/Users/'+ user + '/Notifications/' + polyName);
	var notiRef = firebase.database().ref('Users/'+ user + '/Notifications/PolyNotifications/' + polyName);
	notiRef.remove();
}

var RemoveUser = function(user){
	var userRef = firebase.database().ref('Users/'+ user);
	userRef.remove();

	var polysUrl = 'https://sizzling-torch-3744.firebaseio.com/Polygons.json';
	
	var client = new restClient();
	client.get(polysUrl, function (data, response) {
	    
	    var polys = data;

	    var FlattenedPolys = utils.GetFlattenedPolyNew(polys);
		var polygonsToUpdate = FlattenedPolys.filter(function(poly){
			return (poly.Users != undefined) && (poly.Users.length > 0) && (poly.Users.indexOf(user) >= 0);
		});

		//console.log('polygons to update');
		//console.log(polygonsToUpdate);
		
		polygonsToUpdate.forEach(function(currentPoly){
			var newUserList = currentPoly.Users.filter(function(item){return item != user});
			console.log('before new poly users');
			console.log(currentPoly);
			console.log(newUserList);
			SetPolyUsers(currentPoly.name,newUserList);
		});
	});
}



var HandleNewPositionPOIs = function(user, newPos){
	console.log('handglingnewpositionpois');
	var POIUrl = 'https://sizzling-torch-3744.firebaseio.com/POI.json';

	var client = new restClient();
	client.get(POIUrl,function(data,response){
		var POIs = data;
		console.log('POIS');
		console.log(POIs);
		var FlattenedPOIs = utils.GetFlattenedPOIs(POIs);
		var MatchedPOIs = FlattenedPOIs.filter(function(item){
			var hasUsers = item.users != null;
			console.log(item);
			if(hasUsers)
				return (item.users.indexOf(user) < 0)  && geo.IsInRadiusOfPOI(item.latLngs,newPos,item.distance);
	    	else{
	    		console.log('before is in radius of poi');
	    		console.log(item);
	    		return geo.IsInRadiusOfPOI(item.latLngs,newPos,item.distance);
	    	}
		});

		MatchedPOIs.forEach(function(item){
			SetPOINotifications(user,item.notifications,item.name);
	    	var newUserList = GetNewUserList(item,user);
	    	SetPOIUsers(item.name,newUserList);
		});

	});
}

var HandleNewPositionPolys = function(user,newPos){
	var polysUrl = 'https://sizzling-torch-3744.firebaseio.com/Polygons.json';
	
	var client = new restClient();
	client.get(polysUrl, function (data, response) {
	    
	    var polys = data;
	    //console.log(polys);
	    var FlattenedPolys = utils.GetFlattenedPolyNew(polys);
	    var MatchedPolys = FlattenedPolys.filter(function(item){
	    	var hasUsers = item.users != null;
	    	if(hasUsers)
	    		return (item.users.indexOf(user) < 0)  && geo.IsInPolyNew(item.latLngs,newPos);
	    	else
	    	    return geo.IsInPolyNew(item.latLngs, newPos);
	    });

	    MatchedPolys.forEach(function(item){
	    	SetPolyNotifications(user,item.notifications,item.name);
	    	var newUserList = GetNewUserList(item,user);

	    	SetPolyUsers(item.name,newUserList);
	    });
	    
	});
}

var GetNewUserList= function(item,user){
	if(item.users != null){
	 item.users.push(user);
	 newUserList = item.users;
	}
	else{
	 newUserList = [user];
	}
}

var HandleNewPoly = function(name,polyData){
	console.log('handling new poly');
	var usersUrl = 'https://sizzling-torch-3744.firebaseio.com/Positions.json';
	console.log('usersUrl');
	console.log(usersUrl);
	var client = new restClient();
	client.get(usersUrl, function (data, response) {
		var users = data;

		var FlattenedUsers = utils.GetFlattenedUsers(users);
		console.log('FlattenedUsers');
		console.log(FlattenedUsers);
		var FilteredUsers = FlattenedUsers.filter(function(user){
		    return geo.IsInPolyNew(polyData.latLngs, user.position);
		});
		console.log('filtered users');
		console.log(FilteredUsers);
		var filteredNames = FilteredUsers.map(function(item){return item.name;});
		console.log('filtered in handle new poly');
		console.log(filteredNames);
		SetPolyUsers(name,filteredNames);

		//FilteredUsers.forEach(function(user){
		//	SetNotifications(user.name,polyData.Notifications,name);
		//});
	});
}



//EVENT CALLBACKS

/***POSITION HANDLING***/
var FirebasePositionsRef = firebase.database().ref('Positions/');

console.log('pos events');
FirebasePositionsRef.on("value",function(snapshot){
	console.log(snapshot.val());
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//new user added
FirebasePositionsRef.on("child_added",function(snapshot){
	var newPos = snapshot.val();
	var user = snapshot.key;

	HandleNewPositionPolys(user,newPos);
	HandleNewPositionPOIs(user,newPos);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//user position changed
FirebasePositionsRef.on("child_changed",function(snapshot){
	console.log('userposchanged');
	var newPos = snapshot.val();
	var user = snapshot.key;

	HandleNewPositionPolys(user,newPos);
	HandleNewPositionPOIs(user,newPos);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

FirebasePositionsRef.on("child_removed",function(snapshot){
	var user = snapshot.key;
	RemoveUser(user);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});




/***POLYGON HANDLING***/
var FirebasePolygonRef = firebase.database().ref('Polygons/');

//polygon added
FirebasePolygonRef.on("child_added", function(snapshot){
	console.log('polyadded');
	var polyname = snapshot.key;
	var polyData = snapshot.val();

	HandleNewPoly(polyname,polyData);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//polygon removed
FirebasePolygonRef.on("child_removed",function(snapshot){
	console.log('polyremoved');
	var polyName = snapshot.key;
	var polyData = snapshot.val();
	var users = polyData.Users;
	if(users != undefined){
		users.forEach(function(user){
			RemoveNotifications(user,polyName);
		});	
	};
	
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

//polygon changed
FirebasePolygonRef.on("child_changed",function(snapshot){
	console.log('polychanged');
	var polyName = snapshot.key;
	var polyData = snapshot.val();
	
	console.log(polyData.Users);
	console.log('polyDataUsers');
	console.log(typeof polyData.Users != 'undefined');

	if(typeof polyData.Users != 'undefined'){
		polyData.Users.forEach(function(item){
			SetPolyNotifications(item,polyData.Notifications,polyName);		
		})
	}
	
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});


console.log('end');
