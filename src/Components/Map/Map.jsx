import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import "./Map.css"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { mapToken } from "./MaboxToken";
// THIS IS FOR PRESENTATION ONLY!! If you do not want your API key to be known, you must have it stored in a server. React.js
// is a client side application! everything that you put into your React_App can be easily accessed client side with simple developer
// tools.

let Afact = ""

mapboxgl.accessToken = mapToken
function Map() {
  const [chosenFact, setChosenFact] = useState();
  const [fact, setFact] = useState({});
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-103.7282);
  const [lat, setLat] = useState(44.3771 );
  const [zoom, setZoom] = useState(11);

  const handleOnPopupClick = async (id) => {
    const idTransferred = id
    await setChosenFact(idTransferred);
    await getFact(idTransferred);
  }

  const getFact = async (id) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/facts/${id}/`);
    if (response) {
      setFact(response.data);
      console.log("factdata", response.data);
    }
  }
  function renderFactDetail() {
    if (fact === null) {
      return (
        <div></div>
      );
    }
    return (
      <div>
        <h1>fact details</h1>
        
          <li>{fact.name}</li>
          <li>{fact.state}</li>
          <li>{fact.city}</li>
          <li>{fact.street}</li>
          <li>{fact.zip}</li>
          <li>{fact.fact}</li>
        
      </div>
    );
  }

  //  all of the DOM portions dealing with the map are placed inside of the useEffect for two reasons. The first reason is
  //  for the updating of the vector tile sequences in the map. The second reason is because of how MapBox deals with the DOM
  // MapBox frequently manipulates the DOM along side React.js. This is also partially the reason for needing to Instance the 
  // map using the useRef( ) function. The map is constantly manipuliting the DOM and all of its states are being viewd and 
  // updated on a continual basis. Having a ref also avoids any exterior DOM conflicts, as we can refer to the map through 
  // it's referenced instance. This container allows us direct acces to the DOM state. If you do not do this you will 
  // encounter random bugs...such as multiple geocode searches propogating, or your whole map being filled with coordinates...
  // IN SHORT: useEffect initializes the map on mount, and creates a reference of the map, this reference is then stored in a 
  //           reference container...aka mapContainer, and then that container is being placed inside of the DOM, its DOMception.     
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/cferrara212/ckwxyvfa80tmw14qo5ut1kr0k',
      center: [lng, lat],
      zoom: zoom
    });
    // this adds a control to map instance, there are many things that can be added under .addControl such as a pan or zoom button.
    // in this case a geocoder box is being added to the map. This geocoder can also be given a reference and then attached
    // to the map externally, allowing the search bar to be outside of the map. 
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );
    // this is an on click event listener. this can also be a .on('load') for example, and does not have to be on click.
    // map.current.on('click', (event) => {
    //     const features = map.current.queryRenderedFeatures(event.point, {
    //         layers: ['chicago-parks']
    //     });
    //     if(!features.length){
    //         return;
    //     }
    //     const feature = features[0];
    // inside the event listener I create a popup, if the event lisetners requirements are met, it will create a popup.
    //     const popup = new mapboxgl.Popup({ offset: [0, -15] })
    //   .setLngLat(feature.geometry.coordinates)
    //   .getElement()
    //   .setHTML(
    //     `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
    //   )
    //   .addTo(map.current);
    // });

    const popup = new mapboxgl.Popup({
      offset: [0, -15],
      closeButton: false,
      closeOnClick: false
    });
    //
    // On load geoJSON. + onload addLayer. this is an asynchronous process, so it must have a load listener, otherwise it tries to
    // add the new layer before the map style vector tiles layer has been loaded from the MapBox API.
    //
    map.current.on('load', () => {
      map.current.addSource('places', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'properties': {
                'id': '1',
                'description':
                  '<strong>Mt Moriah Cemetary</strong><p>This historic cemetery has many famous figures buried here. Notably: Seth Bullock, Wild Bill Hickock, Calamity Jane, and Harris Franklin. It is also the burial place for many chinese immigrants that ran the mines.</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-103.7245, 44.3754]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': '8',
                'description':
                  '<strong>Bullock Hotel</strong><p>Founded my Seth Bullock, this hotel has housed the famous, and the infamous. Wild Bill Hickock has stayed here, President Roosevelt, Calamity Jane, and many others. It has been a major part of the growth and prosperity of Deadwood.</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-103.7289, 44.3777]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': '9',
                'description':
                  '<strong>Nuttal and manns (saloon # 10)</strong><p>The original Saloon # 10, or Nuttal and Manns, is famous as the death place of Wild Bill Hickock(James Butler). It was well known as the place where many shootouts began...and many ended.</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-103.7300, 44.3774]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'description':
                  '<strong>William Jackson Palmer Statue</strong><p>William Jackson Palmer was a railroad tycoon, and the founder of Colorado Springs. He was a railroad tycoon, civil engineer, and the philanthropist founder of the University of Colorado.</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-104.8215, 38.8381]
              }
            },
          ]
        }
      })
      map.current.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'paint': {
          'circle-color': '#4264fb',
          'circle-radius': 6,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    });

    // another listener, mousenter is like hover. getcanvas grabs styles. the coordinates have .slice used to split the array
    // and pull lng, and lat out. 
    map.current.on('mouseenter', 'places', (e) => {
      // if (e.features[0].properies.id = savedPropertiesID)
      // {break}
      map.current.getCanvas().style.cursor = 'pointer';
      const featureid = parseInt(e.features[0].properties.id);
      const description = e.features[0].properties.description;
      const coordinates = e.features[0].geometry.coordinates.slice();
      Afact = featureid;
      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to. Someone else wrote this code so I cant explain it.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(description, featureid)
        .addTo(map.current);
    });

    map.current.on('click', () =>{
      console.log("MouseClick: ", Afact)
      // console.log(featureid);
      handleOnPopupClick(Afact);
    })

    map.current.on('mouseleave', 'places', () => {
      map.current.getCanvas().style.cursor = '';
      popup.remove();
    });
  });

  // this useEffect checks the current status of the map reference. If the map reference is no longer current, it will update 
  // the lng, lat, and zoom to match the maps current state., This is then injected into the map container to be rendered.

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });



  return (
    <div className="map-main-container">
      <div ref={mapContainer} className="map-container">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} |
        </div>
      </div>
      {renderFactDetail()}
    </div>
  )
}

export default Map;