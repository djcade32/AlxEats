const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || "";

export const fetchRestaurant = async (placeId: string) => {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const apiKey = GOOGLE_PLACES_API_KEY;

  const headers = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask":
      "displayName.text,types,nationalPhoneNumber,formattedAddress,addressComponents,location,websiteUri,regularOpeningHours.openNow,priceLevel,primaryType,id",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching restaurant: ", error);
  }
};
