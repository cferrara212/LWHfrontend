import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import "./Map.css"
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import { mapToken } from "./MaboxToken";
// THIS IS FOR PRESENTATION ONLY!! If you do not want your API key to be known, you must have it stored in a server. React.js
// is a client side application! everything that you put into your React_App can be easily accessed client side with simple developer
// tools. There are many mentions of creating an .env file and putting your key inside...this helps with gituhub, but does not matter
// in development, as the key can still be had through developer tools.
mapboxgl.accessToken = mapToken

//these are global variables I have created to use information from my map in other areas of my app. Global variables must be used
// instead of usestate() for any dynamic variable that is being pulled from MapBox. This is because useState() is part of the 
// react DOM, and we will be giving our map a separate DOM instance. 
let Afact = "";
let data = {};

function Map() {
  // const [callRoute,SetCallRoute] = useState();  FOR MAP ROUTING CODE, TO BE FINISHED.
  const [cityFacts, setCityFacts] = useState();
  const [fact, setFact] = useState({});
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-103.5127 );
  const [lat, setLat] = useState(44.4111 );
  const [zoom, setZoom] = useState(11);
 
  let Place = {};
  const getCityFacts = async (cityName) =>{
    const response = await axios.get(`http://127.0.0.1:8000/api/facts/?city=${cityName}`);
    console.log("response",response);
    console.log("response data", response.data);
    setCityFacts(response.data);
  }

  function renderCityFacts(){
    if (cityFacts === undefined || cityFacts === null){
      return(
        <div>
          <h1>Location Facts</h1>
          <h3>Please Search for a location to see it's facts.</h3>
        </div>
      );
    }
    return(
      <div>
        <h1>Location Facts</h1>
        {cityFacts.map((cityFact)=>
        <div>
        <h2>{cityFact.name}<button className='btn btn-sm' onClick={()=>{getFact(cityFact.id)}}>Details</button></h2>
        </div>
        )}
      </div>
    )
  }

  const handleOnPopupClick = async (id) => {
    const idTransferred = id
    await getFact(idTransferred);
  }

  //TO DO:
  //FINISH MAP ROUTING CODE:
                                // const start = [-103.7247, 44.3803];
                                // const getRouteCall = async (end) =>{
                                //   const response = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=sk.eyJ1IjoiY2ZlcnJhcmEyMTIiLCJhIjoiY2t4ODJiMGl2MDFoNzMwb2NoN2dpZ2kybyJ9.1P60va4QX6DnLMJPx20XNg`);
                                //   console.log("getRoutecall",response);
                                //   SetCallRoute(response.data);
                                //   console.log("callroute",callRoute);
                                //   console.log("callrouteroutes", callRoute.routes)
                                //   data = response;
                                // }
  


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
    // this section adds a control to the map instance, there are many things that can be added under .addControl such as a pan or zoom button.
    // in this case a geocoder box is being added to the map. This geocoder can also be given a reference and then attached
    // to the map externally, allowing the search bar to be outside of the map. 
    
    
    //                  THIS WAY ADDS THE GEOCODER AS A CONTROL UNDER THE MAP REFERENCE.
    //                  this is how the mapbox documentation suggests setup, however, if you need to pull any information from your
    //                  geocoder search results, this is far to difficult to manage. 

                            // map.current.addControl(
                            //   new MapboxGeocoder({
                            //     accessToken: mapboxgl.accessToken,
                            //     mapboxgl: mapboxgl
                            //   })
                            // );

                            //THIS WAY ALLOWS GOECODER TO ACT INDEPENDENTLY OF THE MAP REFERENCE. This is great for if you need
                            // to pull any information out of your search results, aka location name or coordinates.
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: {
      color: 'orange'
      },
      mapboxgl: mapboxgl
      });
       
      map.current.addControl(geocoder);

      let results = {};
      geocoder.on('result', (e) => {
        results = e.result;
        Place = results;
        console.log("search event result:",e.result);
        console.log("Place variable result:",Place);
        console.log("Place.text:",Place.text);
        getCityFacts(Place.text);
        });
        geocoder.on('clear', () => {
          results = {};
          Place = results;
          console.log(results);
          console.log(Place);
          });
                     // This code will allow you to add your custom tiles from the mapbox GUI into your code.
                     // see further code as to how to add geogjson directly into your code. 

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
   
// I am creating a popup to use with my geojson information.
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
                'id': '16',
                'description':
                  '<strong>William Jackson Palmer Statue</strong><p>William Jackson Palmer was a railroad tycoon, and the founder of Colorado Springs. He was a civil engineer, and the philanthropist founder of the University of Colorado.</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-104.8215, 38.8381]
              }
            },
            {
              'type': 'Feature',
              'properties': {
                'id': '2',
                'description':
                  '<strong>Historic Housing</strong><p>This historic downtown housing area was build in the 1930s, leading to colorado springs being a major trade route.</p>'
              },
              'geometry': {
                'type': 'Point',
                'coordinates': [-104.8206, 38.8589]
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
      map.current.getCanvas().style.cursor = 'pointer';
      const featureid = parseInt(e.features[0].properties.id);
      const description = e.features[0].properties.description;
      const coordinates = e.features[0].geometry.coordinates.slice();
      Afact = featureid; //set my global variable to use id elsewhere in an axios call. 

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
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

    // On click feature uses global variable, and then calls a function that uses it for an axios call when point is clicked.
    map.current.on('click', () =>{
      console.log("MouseClick: ", Afact)
      // console.log(featureid);
      handleOnPopupClick(Afact);
    });

    map.current.on('mouseleave', 'places', () => {
      map.current.getCanvas().style.cursor = '';
      popup.remove();
    });
    
    //TODO:
    //FINISH MAP ROUTING CODE BELOW:
                        //     map.current.on('click', (event) => {
                        //       const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
                        //       const end = {
                        //         type: 'FeatureCollection',
                        //         features: [
                        //           {
                        //             type: 'Feature',
                        //             properties: {},
                        //             geometry: {
                        //               type: 'Point',
                        //               coordinates: coords
                        //             }
                        //           }
                        //         ]
                        //       };
                        //       if (map.current.getLayer('end')) {
                        //         map.current.getSource('end').setData(end);
                        //       } else {
                        //         map.current.addLayer({
                        //           id: 'end',
                        //           type: 'circle',
                        //           source: {
                        //             type: 'geojson',
                        //             data: {
                        //               type: 'FeatureCollection',
                        //               features: [
                        //                 {
                        //                   type: 'Feature',
                        //                   properties: {},
                        //                   geometry: {
                        //                     type: 'Point',
                        //                     coordinates: coords
                        //                   }
                        //                 }
                        //               ]
                        //             }
                        //           },
                        //           paint: {
                        //             'circle-radius': 10,
                        //             'circle-color': '#f30'
                        //           }
                        //         });
                        //       }
                        //       getRoute(coords);
                        //     });


                            
                        // const getRoute = async ()=> {
                        //   await getRouteCall(start);
                        //   console.log("callrouteinmap", callRoute);
                        //   const data = callRoute.data;
                        //   const route = data.geometry.coordinates;
                        //   const geojson = {
                        //     type: 'Feature',
                        //     properties: {},
                        //     geometry: {
                        //       type: 'LineString',
                        //       coordinates: route
                        //     }
                        //   };
                        //   // if the route already exists on the map, we'll reset it using setData
                        //   if (map.current.getSource('route')) {
                        //     map.current.getSource('route').setData(geojson);
                        //   }
                        //   // otherwise, we'll make a new request
                        //   else {
                        //     map.current.addLayer({
                        //       id: 'route',
                        //       type: 'line',
                        //       source: {
                        //         type: 'geojson',
                        //         data: geojson
                        //       },
                        //       layout: {
                        //         'line-join': 'round',
                        //         'line-cap': 'round'
                        //       },
                        //       paint: {
                        //         'line-color': '#3887be',
                        //         'line-width': 5,
                        //         'line-opacity': 0.75
                        //       }
                        //     });
                        //   }
                        // }

                        // map.current.on('load', () => {
                        //   // make an initial directions request that
                        //   // starts and ends at the same location
                        //   getRoute();

                        //   // Add starting point to the map
                        //   map.current.addLayer({
                        //     id: 'point',
                        //     type: 'circle',
                        //     source: {
                        //       type: 'geojson',
                        //       data: {
                        //         type: 'FeatureCollection',
                        //         features: [
                        //           {
                        //             type: 'Feature',
                        //             properties: {},
                        //             geometry: {
                        //               type: 'Point',
                        //               coordinates: start
                        //             }
                        //           }
                        //         ]
                        //       }
                        //     },
                        //     paint: {
                        //       'circle-radius': 10,
                        //       'circle-color': '#3887be'
                        //     }
                        //   });
                        //   // this is where the code from the next step will go
                        // });

                        //     const start = [-103.7247, 44.3803];
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
    
    <div className="row">
      <div ref={mapContainer} className="map-container col-sm">
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} |
        </div>
      </div>
      <div className="col-sm">
          {renderCityFacts()}
      </div>
      <div className="container">
        <div className="row">
          <div className='col-sm'>
          {renderFactDetail()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Map;