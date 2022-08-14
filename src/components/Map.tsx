import React, { useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polyline,
  useJsApiLoader
} from "@react-google-maps/api";

import type { PositionType } from '../types';

const center = {
  lat: 39.8283,
  lng: -98.5795
}

type Props = {
  position: PositionType;
  setMap: (map: google.maps.Map | undefined) => void;
}
function Map({ position, setMap }: Props) {
  const { origin, destination } = position;
  console.log(process.env.REACT_APP_GOOGLE_API_KEY);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY || ""
  });

  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const handleActiveMarker = (marker: string) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = React.useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds(center);
    if (origin) bounds.extend({ lat: origin.Latitude/3600, lng: origin.Longitude/3600 });
    if (destination) bounds.extend({ lat: destination.Latitude/3600, lng: destination.Longitude/3600 });
    map.fitBounds(bounds);
    setMap(map);
  }, [origin, destination, setMap]);

  const onUnmount = React.useCallback(() => {
    setMap(undefined);
  }, [setMap]);

  const getPolylinePath = React.useCallback(() => {
    return origin && destination ? [
      { lat: origin.Latitude/3600, lng: origin.Longitude/3600 },
      { lat: destination.Latitude/3600, lng: destination.Longitude/3600 }
    ] : [];
  }, [origin, destination]);

  if (!isLoaded) return null;

  return (
    <GoogleMap
      onLoad={handleOnLoad}
      onUnmount={onUnmount}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "50%", height: "600px", minWidth: "600px" }}
      center={center}
      zoom={3}
    >
      <Polyline path={getPolylinePath()} />
      {origin && (
        <Marker
          icon='http://maps.google.com/mapfiles/ms/icons/green-dot.png'
          position={{ lat: origin.Latitude/3600, lng: origin.Longitude/3600 }}
          onClick={() => handleActiveMarker("origin")}
        >
          {activeMarker === "origin" ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>{origin.FacilityName}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      )}
      {destination && (
        <Marker
          icon='http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
          position={{ lat: destination.Latitude/3600, lng: destination.Longitude/3600 }}
          onClick={() => handleActiveMarker("destination")}
        >
          {activeMarker === "destination" ? (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div>{destination.FacilityName}</div>
            </InfoWindow>
          ) : null}
        </Marker>
      )}
    </GoogleMap>
  );
}

export default React.memo(Map)
