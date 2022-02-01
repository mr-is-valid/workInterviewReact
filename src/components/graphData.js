import * as React from 'react';
import axios from 'axios';
import "./css/graphData.css";
import Chart from "react-apexcharts";
import mapboxgl from 'mapbox-gl';
import ReactMapGL from 'react-map-gl';

import { useSelector } from "react-redux"
import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from "../store/index";

function GraphData() {
    
    const state = useSelector((state) => state.metorState);
    const baseURL = "https://data.nasa.gov/resource/y77d-th95.json";
    //const baseURL = state.baseUrl;
    //var list = state.metorList;

    mapboxgl.accessToken = "pk.eyJ1IjoibXJpc3ZhbGlkIiwiYSI6ImNrZXY3bXFtcjB4MjMycXA3a3Znc3RkaHIifQ.Fa6Crua7ws6ssDYg56E12w"//state.mapToken;

    const dispatch = useDispatch();
    const { setMetorListState, getMetorListState } = bindActionCreators(actionCreators, dispatch);

    const [charOptions, setCharOptions] = React.useState({});
    const [charSeries, setcharSeries] = React.useState([]);

    const mapContainer = React.useRef(null);
    const map = React.useRef(null);
    const [lng, setLng] = React.useState(-65.23333);
    const [lat, setLat] = React.useState(-31.6);
    const [zoom, setZoom] = React.useState(5);


 
    React.useEffect(async () => {
        await axios.get(baseURL).then((response) => {
            var metorPerYear = {};
            var geoLocationData = [];
            for(let metor of response.data) {
                let fixYear = new Date(metor.year).toLocaleDateString().split('/')[2];
                
                if(fixYear === undefined) continue;
                
                if(fixYear in metorPerYear) metorPerYear[fixYear] = metorPerYear[fixYear] + 1;
                else metorPerYear[fixYear] = 1;

                geoLocationData.push({
                    'type': 'Feature',
                    'properties': {
                    'description':
                        '<strong>'+ metor.name +'</strong><p>type: '+ metor.nametype +'</p><p>mass: '+ metor.mass +'</p><p>year: '+ fixYear +'</p>'
                    },
                    'geometry': metor.geolocation
                })
            }

            buildMap(geoLocationData);

            setCharOptions(
                {
                    chart: {
                        id: "basic-bar",
                        type: 'bar',
                    },

                    dataLabels: {
                        enabled: false  
                    },
                    
                    xaxis: {
                        categories: Object.keys(metorPerYear),
                        tickPlacement: 'on',
                    },
                }
                );
                
            setcharSeries([
                    {
                        name: "amount",
                        data: Object.values(metorPerYear),
                    }
                ]);
            });
    }, []);

    async function buildMap(geoLocationData){
        if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [lng, lat],
                zoom: zoom
            });

            map.current.on('load', () => {
                map.current.addSource('places', {
                    'type': 'geojson',
                    'data': {
                    'type': 'FeatureCollection',
                    'features': geoLocationData
                    }
                });

                // Add a layer showing the places.
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
                 
                // Create a popup, but don't add it to the map yet.
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });
                 
                map.current.on('mouseenter', 'places', (e) => {
                    // Change the cursor style as a UI indicator.
                    map.current.getCanvas().style.cursor = 'pointer';
                    
                    // Copy coordinates array.
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const description = e.features[0].properties.description;
                    
                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }
                    
                    // Populate the popup and set its coordinates
                    // based on the feature found.
                    popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
                });
                 
                map.current.on('mouseleave', 'places', () => {
                    map.current.getCanvas().style.cursor = '';
                    popup.remove();
                    });
            });
    }


    return (
        <div>
            <Chart
                className="chartStyle"
                options={charOptions}
                series={charSeries}
                type="bar"
                height="400px"
            />
            
            <div ref={mapContainer} className="map-container" />

            {/* <ReactMapGL 
                mapboxApiAccessToken="pk.eyJ1IjoibXJpc3ZhbGlkIiwiYSI6ImNrZXY3bXFtcjB4MjMycXA3a3Znc3RkaHIifQ.Fa6Crua7ws6ssDYg56E12w"
                {...viewport}
                    onViewportChange={nextViewport => setViewport(nextViewport)
                }
            /> */}
        </div>
    );
}

export default GraphData;
