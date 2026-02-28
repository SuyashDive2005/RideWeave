// Nominatim API wrapper for reverse and forward geocoding
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  display_name: string;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<Address | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          "Accept-Language": "en",
        },
      },
    );
    const data = await response.json();
    return {
      display_name: data.display_name,
      street: data.address?.road,
      city: data.address?.city || data.address?.town,
      state: data.address?.state,
      zipcode: data.address?.postcode,
      country: data.address?.country,
    };
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

export async function forwardGeocode(query: string): Promise<
  Array<{
    lat: number;
    lng: number;
    display_name: string;
  }>
> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      {
        headers: {
          "Accept-Language": "en",
        },
      },
    );
    const data = await response.json();
    return data.map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      display_name: item.display_name,
    }));
  } catch (error) {
    console.error("Forward geocoding error:", error);
    return [];
  }
}
