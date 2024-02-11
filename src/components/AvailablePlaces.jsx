import { useState, useEffect } from 'react';

import Places from './Places.jsx';
import Error from './Error.jsx'
import { sortPlacesByDistance } from '../loc.js'
import { fetchAvailablePlaces } from '../http.js'

export default function AvailablePlaces({ onSelectPlace }) {
  // TODO: Fetch available places from backend API
  const [isFetching, setIsFetching] = useState(false)
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();
  
  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true)

      try {
        const places = await fetchAvailablePlaces();

        navigator.geolocation.getCurrentPosition((position) => {
          const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude)
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
        
      } catch (error) {
        setError({ message: error.message || 'Could not fetch data. Please try again later!'})
        setIsFetching(false);
      }
      
    }
    fetchPlaces();
  }, [])

  if(error) {
    return <Error title={"An Error ocurred!"} message={error.message}/>
  }
    // fetch("http://localhost:3000/places")
    //   .then(res => {return res.json()})
    //   .then((resData) => {
    //     // console.log(resData.places)
    //     setAvailablePlaces(resData.places);
    //     console.log(availablePlaces)
    //   })
    // }, []);

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
