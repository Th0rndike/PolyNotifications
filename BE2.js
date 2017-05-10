var firebase = require("firebase");


console.log('Initializing...');
var initResult  = firebase.initializeApp({
  databaseURL: "https://sizzling-torch-3744.firebaseio.com",
  serviceAccount: "Newest-b4a5315e376f.json"
});

console.log('initialized.');

//var iitcpolyexample= [{"type":"polygon","latLngs":[{"lat":45.505216,"lng":9.222642},{"lat":45.504145,"lng":9.240635},{"lat":45.492573,"lng":9.215099}],"color":"#a24ac3"}];
//var geoutilexample = {"type":"Polygon", "coordinates":[[[0,0],[6,0],[6,6],[0,6]]]}
//var geoutilexamplepoint = {"type":"Point","coordinates":[3,3]};

//var FirebasePoliPath =  new Firebase('https://sizzling-torch-3744.firebaseio.com/Polygons/');
var thorposition = firebase.database().ref('Positions/Th0rndike/');
console.log('gotref');
var newpos = ["45.499731","9.220431"];
thorposition.set(newpos);
console.log('changed');