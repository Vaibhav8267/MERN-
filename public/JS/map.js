
// const coords = [coordinates.lng, coordinates.lat];
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/standard',
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});
const marker1 = new mapboxgl.Marker({ color: 'red' })
.setLngLat(listing.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset:25})
.setHTML(`<h3>${listing.location}</h3> <p> Exact location after Booking</p>`)
.setMaxWidth("300px"))
.addTo(map)
console.log(listing.geometry.coordinates);

const popup = new mapboxgl.Popup({})

.addTo(map);

console.log(mapToken);