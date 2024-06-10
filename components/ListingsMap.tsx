import { StyleSheet, View, Image } from "react-native";
import React, { memo, useEffect, useRef, useState } from "react";
import MapView from "react-native-map-clustering";
import { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Colors from "@/constants/Colors";
import * as Location from "expo-location";
import { mapStyle } from "@/customMapStyle";
import { router } from "expo-router";
import { RestaurantItem } from "@/interfaces";
import { isRestaurantItem } from "@/common-utils";

interface ListingsMapProps {
  data: any;
}

const ListingsMap = memo(({ data }: ListingsMapProps) => {
  const mapViewRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [initialRegion, setInitialRegion] = useState<any>();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    setInitialRegion({
      latitude: userLocation?.latitude || 38.81,
      longitude: userLocation?.longitude || -77.04,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  }, [userLocation]);

  useEffect(() => {
    if (!loaded) return;
    mapViewRef?.current?.animateToRegion(initialRegion);
  }, [data]);

  const onMarkerPress = (item: any) => {
    router.push({
      pathname: `/restaurantDetails/${JSON.stringify(item.placeId)}`,
      params: { restaurant: JSON.stringify(item) },
    });
  };

  if (!loaded) return <View style={{ flex: 1 }}></View>;
  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapViewRef}
        animationEnabled={false}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        clusterColor={Colors.black}
        clusterTextColor="white"
        initialRegion={{
          latitude: userLocation?.latitude || 38.81,
          longitude: userLocation?.longitude || -77.04,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        customMapStyle={mapStyle}
        pitchEnabled={false}
      >
        {data.map(
          (listing: RestaurantItem) =>
            listing?.coordinate && (
              <Marker
                key={listing.address}
                onPress={() => onMarkerPress(listing)}
                coordinate={{
                  latitude: +listing.coordinate.latitude,
                  longitude: +listing.coordinate.longitude,
                }}
              >
                <Image
                  source={require("@/assets/images/location-pin.png")}
                  style={{ width: 35, height: 35 }}
                />
              </Marker>
            )
        )}
      </MapView>
    </View>
  );
});

export default ListingsMap;

const styles = StyleSheet.create({});
