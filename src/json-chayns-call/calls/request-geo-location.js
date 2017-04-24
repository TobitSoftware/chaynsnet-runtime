let geoWatchNumber = null;

export default function requestGeoLocation(req, res) {
    if (navigator.geolocation) {
        const requestPos = method => method.apply(navigator.geolocation, [
            (pos) => {
                const obj = {
                    accuracy: pos.coords.accuracy,
                    altitude: pos.coords.altitude,
                    altitudeAccuracy: pos.coords.altitudeAccuracy,
                    heading: pos.coords.heading,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                    speed: pos.coords.speed
                };
                res.answer(obj);
            },
            (err) => {
                res.event(err.code + 10, err.message);
            }
        ]);

        if (req.value.permanent) {
            geoWatchNumber = requestPos(navigator.geolocation.watchPosition);
        } else if (geoWatchNumber !== null) {
            navigator.geolocation.clearWatch(geoWatchNumber);
            geoWatchNumber = null;
        } else {
            requestPos(navigator.geolocation.getCurrentPosition);
        }
    } else {
        res.event(10, 'Position unavailable');
    }
}
