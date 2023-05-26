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
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [8.819174837935316, 47.22653077732017],
          zoom: 10
        });
      
        
      }
      
      function getRoute(origin, destination, accessToken) {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?access_token=${accessToken}`;
        return fetch(url)
          .then(response => response.json())
          .then(data => {
            // Process the response data
            return data; // Return the routes
          })
          .catch(error => {
            // Handle any errors
            console.error('Error:', error);
          });
      }
      
      async function activateRoute() {
        const accessToken = 'pk.eyJ1IjoibWlsa3NoYWtlcjc3NSIsImEiOiJjbGk0NmJ6ZnMwY2s4M2ZwY20xOHNxenZnIn0.rCPRzvm_TtisulAPpl4_0A';
        const geocodingEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          location
        )}.json?access_token=${accessToken}`;
      
        let [longitude, latitude] = [0, 0];
      
        try {
          const response = await fetch(geocodingEndpoint);
          const data = await response.json();
      
          if (data.features.length > 0) {
            [longitude, latitude] = data.features[0].center;
          }
        } catch (error) {
          alert(error);
        }
      
        const destination = `${latitude},${longitude}`;
        getCurrentLocation().then(async data => {
          const origin = `${data.latitude},${data.longitude}`;
          const route = await getRoute(origin, destination, accessToken);
          displayRouteOnMap(route);
        });
      }
      

    return(
        <div id="mapDiv">
            <button id="mapClose" className="btn btn-outline-danger btn-dark" onClick={close}>Close</button>
            <div ref={mapContainerRef} id="map"/>
        </div>
    )
}