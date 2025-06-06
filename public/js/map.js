
  
	mapboxgl.accessToken = maptoken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:"mapbox://styles/mapbox/streets-v12",
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });
console.log(coordinates);

    const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        
    .setPopup(new mapboxgl.Popup({offset:25}).setHTML("<h4>Exact location provided after booking!</h4>"))
        .addTo(map);
