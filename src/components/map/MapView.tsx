"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { Dispatch, SetStateAction } from "react";

export interface Cordinates {
  lat: number;
  lng: number;
}

export const defaultMapContainerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "15px 0px 0px 15px",
};

export function MapView(props: {
  location: Cordinates | null;
  setLocation: Dispatch<SetStateAction<Cordinates | null>>;
}) {
  const { location, setLocation } = props;

  function handleRecenter() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position: GeolocationPosition) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    setLocation({ lat, lng });
    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={defaultMapContainerStyle}
        center={location ?? undefined}
        zoom={18}
        options={{
          zoomControl: true,
          tilt: 0,
          gestureHandling: "auto",
          mapTypeId: "terrain",
        }}
        onClick={(e) => {
          if (e.latLng) {
            setLocation({ lng: e.latLng.lng(), lat: e.latLng.lat() });
          }
        }}
      >
        {location && (
          <Marker
            position={location}
          />
        )}
      </GoogleMap>
      <br />

      <button
        type="button"
        onClick={handleRecenter}
        className="text-md font-medium bg-meta-10 py-1 px-4 text-white hover:scale-105 rounded"
      >
        Get My Current Location
      </button>
    </>
  );
}
