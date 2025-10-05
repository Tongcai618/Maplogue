import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Feature, LineString } from 'geojson';

mapboxgl.accessToken = 'pk.eyJ1IjoidG9uZ2NhaSIsImEiOiJjbWdlNDc1Y2cxNW8yMmxwcjlvaHk1ZDBhIn0.3bhUz3zDOecwIjNyKR5HAw';// replace with yours

const Map: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  // Example line feature
  const lineGeoJSON: Feature<LineString> = {
    type: 'Feature', // <- Must be literal "Feature"
    geometry: {
      type: 'LineString', // <- Must be literal "LineString"
      coordinates: [
        [-74.5, 40],
        [-74.6, 40.1],
        [-74.7, 40.2],
        [-74.2, 40.4]
      ]
    },
    properties: {}
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9,
    });

    // When the map has finished loading
    mapRef.current.on('load', () => {
      if (!mapRef.current) return;

      // Add source for the line
      mapRef.current.addSource('route-line', {
        type: 'geojson',
        data: lineGeoJSON
      });

      // Add the line layer
      mapRef.current.addLayer({
        id: 'route-line-layer',
        type: 'line',
        source: 'route-line',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#ff0000',
          'line-width': 1
        }
      });
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}
    />
  );
};

export default Map;
