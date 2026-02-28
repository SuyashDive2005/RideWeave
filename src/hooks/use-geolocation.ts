import { useEffect, useState } from "react";

type GeolocationState = {
  location: [number, number] | null;
  loading: boolean;
  error: string | null;
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: false,
    error: null,
  });

  const requestLocation = () => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: "Geolocation is not supported by your browser",
      });
      return;
    }

    setState({ ...state, loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState({
          location: [latitude, longitude],
          loading: false,
          error: null,
        });
        // Store location in localStorage
        localStorage.setItem(
          "userLocation",
          JSON.stringify([latitude, longitude]),
        );
      },
      (error) => {
        let errorMessage = "Unable to get your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            "Location permission denied. Please enable it in settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "The request to get user location timed out.";
        }
        setState({
          location: null,
          loading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // On initial mount, try to get stored location
  useEffect(() => {
    const storedLocation = localStorage.getItem("userLocation");
    if (storedLocation) {
      try {
        const location = JSON.parse(storedLocation);
        setState({ location, loading: false, error: null });
      } catch (e) {
        // Invalid stored location
      }
    }
  }, []);

  return { ...state, requestLocation };
}
