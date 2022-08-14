import * as React from 'react';
import {
  Button,
  Stack,
  Typography
} from "@mui/material";

import {
  Autocomplete,
  Map
} from './components';
import type { PlaceType, PositionType } from './types';

function Home() {
  const [map, setMap] = React.useState<google.maps.Map | undefined>(undefined);
  const [originPlace, setOriginPlace] = React.useState<PlaceType | null>(null);
  const [destPlace, setDestPlace] = React.useState<PlaceType | null>(null);
  const [result, setResult] = React.useState<string | null>(null);
  const [airports, setAirports] = React.useState<PositionType>({origin: null, destination: null});

  const onCalculate = () => {
    if (!originPlace || !destPlace) return;

    const lat1 = ((originPlace.Latitude / 3600) * Math.PI) / 180;  // Convert secs to degrees then to radians
    const lon1 = ((originPlace.Longitude / 3600) * Math.PI) / 180; // Convert secs to degrees then to radians
    const lat2 = ((destPlace.Latitude / 3600) * Math.PI) / 180;    // Convert secs to degrees then to radians
    const lon2 = ((destPlace.Longitude / 3600) * Math.PI) / 180;   // Convert secs to degrees then to radians
    const R = 3440;                                                // radius of Earth in Nautical Miles
    const posA = [R * Math.cos(lat1), 0, R * Math.sin(lat1)];      // 3D position of first location
    const posB = [
      R * Math.cos(lat2) * Math.cos(lon2-lon1),
      R * Math.cos(lat2) * Math.sin(lon2-lon1),
      R * Math.sin(lat2)
    ];                                                              //3D position of second location
    const scalarProdLeft = (posA[0] * posB[0] + posA[1] * posB[1] + posA[2] * posB[2]) / (R**2);
    const x = Math.acos(scalarProdLeft);

    setResult(`
      ${originPlace?.FacilityName} (${originPlace?.LocationID}) of ${originPlace?.City}, ${originPlace?.County}, ${originPlace?.State}
      and
      ${destPlace?.FacilityName} (${destPlace?.LocationID}) of ${destPlace?.City}, ${destPlace?.County}, ${destPlace?.State} are
      ${R * x} NM away!
    `);

    setAirports({
      origin: originPlace,
      destination: destPlace,
    });

    if (map) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend({ lat: originPlace.Latitude/3600, lng: originPlace.Longitude/3600 });
      bounds.extend({ lat: destPlace.Latitude/3600, lng: destPlace.Longitude/3600 });
      map.fitBounds(bounds);
    }
  }

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 5 }}>
        U.S. AIRPORT DISTANCE CALCULATOR in Nautical Miles (NM)
      </Typography>
      <Stack direction="row" spacing={2} marginBottom={5}>
        <Autocomplete
          value={originPlace}
          setValue={setOriginPlace}
          placeholder="Insert Airport 1"
        />
        <Autocomplete
          value={destPlace}
          setValue={setDestPlace}
          placeholder="Insert Airport 2"
        />
        
        <Button
          variant="contained"
          disabled={originPlace == null || destPlace == null}
          onClick={onCalculate}          
        >
          Calculate
        </Button>
      </Stack>
      {result && (
        <Typography sx={{ fontWeight: 'bold', marginBottom: 5 }}>
          {result}
        </Typography>
      )}
      <Map setMap={setMap} position={airports} />
    </>
  );
}

export default Home;
