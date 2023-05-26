import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
export default function Map({ location, close, dragDiv }){
    const mapContainerRef = useRef(null)
    const [routingView, setRoutingView] = useState(false)

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
        if(routingView){
            initMap()
        } else{
            fetchLocation()
        }
    }, [routingView])

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
      
        function initMap() {
            console.log("Map created")
            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            const map = new google.maps.Map(mapContainerRef.current, {
                zoom: 7,
                center: { lat: 47.465266, lng: 9.0415478 },
            });
            
            directionsRenderer.setMap(map);
        
            calculateAndDisplayRoute(directionsService, directionsRenderer)
        }
        
          
        function calculateAndDisplayRoute(directionsService, directionsRenderer) {
            getCurrentLocation().then(browserLocation => {
                directionsService
                .route({
                    origin: new google.maps.LatLng(browserLocation.latitude,browserLocation.longitude),
                    destination: {
                    query: location,
                },
                    travelMode: google.maps.TravelMode.BICYCLING,
                })
                .then((response) => {
                    directionsRenderer.setDirections(response);
                })
                .catch((e) => window.alert("Directions request failed due to " + e));
            })
        }
      
    //   function getRoute(coords, radius, accessToken) {
    //     const profile = "driving"
    //     console.log(coords);
    //     const url = `https://api.mapbox.com/matching/v5/mapbox/${profile}/8.860202,47.195204;8.8292052,47.2363849?geometries=geojson&steps=true&access_token=${accessToken}`;
    //     return fetch(url)
    //       .then(response => response.json())
    //       .then(data => {
    //         // Process the response data
    //         console.log(`https://api.mapbox.com/matching/v5/mapbox/${profile}/${coords}?geometries=geojson&steps=true&access_token=${accessToken}`);
    //         console.log(data);
    //         return data.matchings[0].geometry; // Return the routes
    //       })
    //       .catch(error => {
    //         // Handle any errors
    //         console.error('Error:', error);
    //       });
    //   }
      
    //   async function activateRoute() {
    //     const accessToken = 'pk.eyJ1IjoibWlsa3NoYWtlcjc3NSIsImEiOiJjbGk0NmJ6ZnMwY2s4M2ZwY20xOHNxenZnIn0.rCPRzvm_TtisulAPpl4_0A';
    //     const geocodingEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    //       location
    //     )}.json?access_token=${accessToken}`;
      
    //     let [longitude, latitude] = [0, 0];
      
    //     try {
    //       const response = await fetch(geocodingEndpoint);
    //       const data = await response.json();
      
    //       if (data.features.length > 0) {
    //         [longitude, latitude] = data.features[0].center;
    //       }
    //     } catch (error) {
    //       alert(error);
    //     }
      
    //     let coords = []
    //     getCurrentLocation().then(async data => {
    //       coords = [[longitude, latitude], [data.longitude, data.latitude]]
    //       const newCoords = coords.join(';')
    //       const radius = coords.map(() => 25)
    //       const route = await getRoute(newCoords, radius, accessToken);
    //       displayRouteOnMap(route);
    //     });
    //   }
      

    return(
        <div id="mapDiv">
            <div id="mapNav">
                <button className="btn btnStyle" onClick={() => setRoutingView(false)}>Location Pin</button>
                <button className="btn btnStyle" onClick={() => setRoutingView(true)}>Location Route</button>
            </div><br />
            <div ref={mapContainerRef} id="map"/><br />
            <button id="mapClose" className="btn btn-outline-danger btn-dark" onClick={close}>Close</button>
        </div>
    )
}