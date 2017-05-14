var poly = require("Polygon");
var Vec2 = require('vec2');
require("geolib");
var geoutils = require('geojson-utils');

//GEO UTILITIES
exports.polyObject = {
    Polygon: {},
    Notifications: {}
};



exports.GetPolygonObject = function (PolyFromDB) {
    var vecArray = PolyFromDB.Polygon.points.map(function (item) {
        return Vec2(item.x, item.y);
    });

    return new poly(vecArray);
}

exports.IsInPolyNew = function (latLngs, position) {
    var latLngArray = new Array();
    latLngArray.push(latLngs.map(function (item) { return [item.lat, item.lng] }));
    return geoutils.pointInPolygon({ "type": "Point", "coordinates": position },
		{ "type": "Polygon", "coordinates": latLngArray });
}

exports.IsInRadiusOfPOI = function (poiCoordinates, currentPosition, maxDistance) {
    console.log('before is in radius');
    console.log(poiCoordinates);
    console.log(currentPosition);
    var distance = geoutils.pointDistance({ type: 'Point', coordinates: poiCoordinates },
                  { type: 'Point', coordinates: currentPosition });
    console.log('checkingRadius for ' + distance + ' and max distance ' + maxDistance);
    if (distance < maxDistance)
        return true;
    else
        return false;
}
