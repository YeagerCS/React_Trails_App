import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
export default function Map({ location, close, dragDiv }){
    const mapContainerRef = useRef(null)

    async function fetchLocation(){
        const accessToken = 'pk.eyJ1IjoibWlsa3NoYWtlcjc3NSIsImEiOiJjbGk0NmJ6ZnMwY2s4M2ZwY20xOHNxenZnIn0.rCPRzvm_TtisulAPpl4_0A';
        const geocodingEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            location
        )}.json?access_token=${accessToken}`;

        let [longitude, latitude] = [0, 0];

        try{
            const response = await fetch(geocodingEndpoint)
            const data = await response.json()

            if (data.features.length > 0) {
                [longitude, latitude] = data.features[0].center;
            }
        } catch(error){
            alert(error)
        }

        mapboxgl.accessToken = accessToken;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitude, latitude],
            zoom: 14
        });

        const marker = new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

        return () => {
            marker.remove();
            map.remove();
        };
    }

    useEffect(() => {
        dragDiv("mapDiv", mapContainerRef)
    }, []);
    

    useEffect(() => {
        // fetchLocation()
        activateRoute()
    }, [])

    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            error => {
              reject(error);
            }
          );
        });
    }

    function displayRouteOnMap(route) {
        const accessToken = 'pk.eyJ1IjoibWlsa3NoYWtlcjc3NSIsImEiOiJjbGk0NmJ6ZnMwY2s4M2ZwY20xOHNxenZnIn0.rCPRzvm_TtisulAPpl4_0A';
        mapboxgl.accessToken = accessToken;
      
        const map = new mapboxgl.Map({
          container: 'mapDiv',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [route.geometry.coordinates[0][0], route.geometry.coordinates[0][1]],
          zoom: 10
        });
      
        map.on('load', () => {
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });
      
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#888',
              'line-width': 6
            }
          });
        });
      }

      function getRoute(origin, destination, accessToken) {
        console.log(destination);
        console.log(origin);
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?access_token=${accessToken}`;
        return fetch(url)
        .then(response => response.json())
        .then(data => {
            // Process the response data
            console.log(data);
            return data.routes[0]; // Return the first route
        })
        .catch(error => {
            // Handle any errors
            console.error('Error:', error);
        });
      }

      async function activateRoute(){
        const accessToken = 'pk.eyJ1IjoibWlsa3NoYWtlcjc3NSIsImEiOiJjbGk0NmJ6ZnMwY2s4M2ZwY20xOHNxenZnIn0.rCPRzvm_TtisulAPpl4_0A';
        const geocodingEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            location
        )}.json?access_token=${accessToken}`;

        let [longitude, latitude] = [0, 0];

        try{
            const response = await fetch(geocodingEndpoint)
            const data = await response.json()

            if (data.features.length > 0) {
                [longitude, latitude] = data.features[0].center;
            }
        } catch(error){
            alert(error)
        }


        let destination = {latitude, longitude}
        getCurrentLocation().then(async data => {
            let origin = data
            const route = await getRoute(origin, destination, "pk.eyJ1IjoibWlsa3NoYWtlcjc3NSIsImEiOiJjbGk0NmJ6ZnMwY2s4M2ZwY20xOHNxenZnIn0.rCPRzvm_TtisulAPpl4_0A")
            displayRouteOnMap(route)
        })
      }

    return(
        <div id="mapDiv">
            <button id="mapClose" className="btn btn-outline-danger btn-dark" onClick={close}>Close</button>
            <div ref={mapContainerRef} id="map"/>
        </div>
    )
}