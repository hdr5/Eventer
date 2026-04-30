import { useJsApiLoader } from "@react-google-maps/api";

export const useGoogleMaps = () => {
  const libraries = ["places"];
  const { isLoaded, loadError } = useJsApiLoader({
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  libraries,
});

  return { isLoaded, loadError };
};