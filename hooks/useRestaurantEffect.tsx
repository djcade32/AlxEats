import { useEffect } from "react";
import * as Location from "expo-location";
import { checkIfRestaurantInList } from "@/firebase";
import { FeedPost, RestaurantRankingPayload, User } from "@/interfaces";
import { distanceBetweenCoordinates } from "@/common-utils";
import { fetchRestaurant } from "@/api";

interface useRestaurantEffectProps {
  userDbInfo: User | null;
  restaurantId: string;
  restaurantObj: any;
  setRestaurant: (restaurant: any) => void;
  setYourPhotos: (photos: string[]) => void;
  updateComment: (comment: string) => void;
  setRanking: (ranking: number | null) => void;
  setIsTried: (isTried: boolean) => void;
  setIsToTry: (isToTry: boolean) => void;
  checkIfUserToTryRestaurant: (placeId: string) => boolean;
  userPosts: FeedPost[];
}

const useRestaurantEffect = ({
  userDbInfo,
  restaurantId,
  restaurantObj,
  setRestaurant,
  setYourPhotos,
  updateComment,
  setRanking,
  setIsTried,
  setIsToTry,
  checkIfUserToTryRestaurant,
  userPosts,
}: useRestaurantEffectProps) => {
  useEffect(() => {
    const handleRestaurantData = async (restaurantData: any, location: any) => {
      const newRestaurant = {
        placeId: restaurantData.id,
        coordinate: {
          latitude: restaurantData.location.latitude,
          longitude: restaurantData.location.longitude,
        },
        name: restaurantData.displayName.text,
        openNow: restaurantData.regularOpeningHours?.openNow,
        price: restaurantData.priceLevel,
        types: restaurantData.types,
        primaryType: restaurantData.primaryType,
        address: restaurantData.formattedAddress,
        phoneNumber: restaurantData.nationalPhoneNumber,
        website: restaurantData.websiteUri,
        addressComponents: JSON.stringify(restaurantData.addressComponents),
        distance: distanceBetweenCoordinates(location.coords, {
          latitude: restaurantData.location.latitude,
          longitude: restaurantData.location.longitude,
        }),
      };
      setRestaurant(newRestaurant);

      const resTried: RestaurantRankingPayload = await checkIfRestaurantInList(
        userDbInfo!.id,
        newRestaurant.placeId,
        "TRIED"
      );

      if (resTried) {
        setYourPhotos(resTried.photos || []);
        updateComment(resTried.comment || "");
        setRanking(resTried.ranking || 0);
        setIsTried(true);
        setIsToTry(false);
      } else {
        setRanking(null);
        setIsTried(false);
      }

      if (!resTried) {
        setIsToTry(checkIfUserToTryRestaurant(newRestaurant.placeId));
      }
    };

    const fetchAndSetRestaurant = async () => {
      let location = await Location.getCurrentPositionAsync({});
      const restaurantData = await fetchRestaurant(JSON.parse(restaurantId));
      await handleRestaurantData(restaurantData, location);
    };

    const setExistingRestaurant = async () => {
      const restaurant = JSON.parse(restaurantObj);
      setRestaurant(restaurant);

      const resTried: RestaurantRankingPayload = await checkIfRestaurantInList(
        userDbInfo!.id,
        restaurant.placeId,
        "TRIED"
      );

      if (resTried) {
        setYourPhotos(resTried.photos || []);
        updateComment(resTried.comment || "");
        setRanking(resTried.ranking || 0);
        setIsTried(true);
        setIsToTry(false);
      } else {
        setRanking(null);
        setIsTried(false);
      }

      if (!resTried) {
        setIsToTry(checkIfUserToTryRestaurant(restaurant.placeId));
      }
    };

    if (!restaurantObj) {
      fetchAndSetRestaurant();
    } else {
      setExistingRestaurant();
    }
  }, [userPosts]);
};

export default useRestaurantEffect;
