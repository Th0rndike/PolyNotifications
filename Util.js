//UTILITIES

exports.GetFlattenedUsers = function (users) {
    var result = [];
    for (var key in users) {
        result.push({ name: key, position: users[key] });
    }
    return result;
}

exports.GetFlattenedPolyNew = function (poly) {
    var result = [];
    for (var key in poly) {
        result.push({ name: key, latLngs: poly[key].latLngs, color: poly[key].color, notifications: poly[key].Notifications, users: poly[key].Users });
    }
    return result;
}

exports.GetFlattenedPOIs = function (POIs) {
    var result = [];
    for (var key in POIs) {
        result.push({ name: key, latLngs: [POIs[key].lat, POIs[key].lng], notifications: POIs[key].description, distance: POIs[key].distance, users: POIs[key].Users });
    }
    return result;
}