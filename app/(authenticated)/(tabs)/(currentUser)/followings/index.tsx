import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ListingsMemberItem from "@/components/ListingsMemberItem";
import { useLocalSearchParams } from "expo-router";
import { User } from "@/interfaces";
import { FlatList } from "react-native-gesture-handler";
import Colors from "@/constants/Colors";
import Font from "@/constants/Font";
import { getUserById } from "@/firebase";
import { getAuth } from "firebase/auth";
import { useAppStore } from "@/store/app-storage";
import ListingsScreenHeader from "@/components/ListingsScreenHeader";
import { Ionicons } from "@expo/vector-icons";

const search = () => {
  const followersIds = JSON.parse(useLocalSearchParams<any>().followers);
  const followingsIds = JSON.parse(useLocalSearchParams<any>().followings);
  const activeScreen = useLocalSearchParams<any>().activeScreen;
  const debounceTimeout = useRef<any>(null);
  const { userDbInfo } = useAppStore();

  const [searchText, setSearchText] = useState("");
  const [viewFollowings, setViewFollowings] = useState(activeScreen === "followers" ? 0 : 1);
  const [loading, setLoading] = useState(true);
  const [userFollowers, setUserFollowers] = useState<User[]>([]);
  const [userFollowings, setUserFollowings] = useState<User[]>([]);
  const [filteredFollowingsUsers, setFilteredFollowingsUsers] = useState<User[]>([]);
  const [filteredFollowersUsers, setFilteredFollowersUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!userDbInfo) return;
    const getUserFollowers = async () => {
      const userObjs: User[] = [];
      for (let i = 0; i < followersIds.length; i++) {
        const user = await getUserById(followersIds[i]);
        if (!user) continue;
        userObjs.push(user);
      }
      setUserFollowers(userObjs);
      setFilteredFollowersUsers(userObjs);
    };
    const getUserFollowings = async () => {
      const userObjs: User[] = [];
      for (let i = 0; i < followingsIds.length; i++) {
        const user = await getUserById(followingsIds[i]);
        if (!user) continue;
        userObjs.push(user);
      }
      setUserFollowings(userObjs);
      setFilteredFollowingsUsers(userObjs);
    };
    Promise.all([getUserFollowers(), getUserFollowings()]).then(() => setLoading(false));
  }, []);

  // Update search results when search text changes
  useEffect(() => {
    if (loading) return;
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (!viewFollowings) {
        if (!searchText) {
          setFilteredFollowersUsers(userFollowers);
        } else {
          searchUsers(searchText, userFollowers);
        }
      } else {
        if (!searchText) {
          setFilteredFollowingsUsers(userFollowings);
        } else {
          searchUsers(searchText, userFollowings);
        }
      }
    }, 275); // 275ms delay
  }, [searchText]);

  const renderRowItem = ({ item }: any) => {
    return <ListingsMemberItem key={item.id} user={item} tabScreenName="(currentUser)" />;
  };

  const endOfListReached = async () => {};

  const searchUsers = (searchText: string, usersList: User[]) => {
    const filteredUsers = usersList.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
      return fullName.toLowerCase().includes(searchText.toLowerCase());
    });
    if (!viewFollowings) {
      setFilteredFollowersUsers(filteredUsers);
    } else {
      setFilteredFollowingsUsers(filteredUsers);
    }
  };

  return (
    <View style={styles.container}>
      <ListingsScreenHeader
        searchText={searchText}
        setSearchText={setSearchText}
        activeToggle={viewFollowings}
        setActiveToggle={setViewFollowings}
        switchValues={[
          {
            label: "Followers",
            icon: <Ionicons name="people-sharp" size={18} />,
            activeColor: Colors.primary,
            inactiveColor: "white",
          },
          {
            label: "Following",
            icon: <Ionicons name="person-sharp" size={18} />,
            activeColor: Colors.primary,
            inactiveColor: "white",
          },
        ]}
        showFilter={false}
        showBackButton={true}
      />

      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <>
            {viewFollowings ? (
              <FlatList
                style={{ display: loading ? "none" : "flex" }}
                contentContainerStyle={[
                  { paddingTop: 75 },
                  !filteredFollowingsUsers?.length && { flex: 1 },
                ]}
                data={filteredFollowingsUsers}
                renderItem={renderRowItem}
                keyExtractor={(user: User) => user.id}
                showsVerticalScrollIndicator={false}
                onEndReached={() => endOfListReached()}
                onEndReachedThreshold={0.75}
                ListEmptyComponent={() => (
                  <View style={styles.loadingScreen}>
                    <Text style={{ color: Colors.gray, fontSize: Font.medium }}>No Followings</Text>
                  </View>
                )}
              />
            ) : (
              <FlatList
                style={{ display: loading ? "none" : "flex" }}
                contentContainerStyle={[
                  { paddingTop: 75 },
                  !filteredFollowersUsers.length && { flex: 1 },
                ]}
                data={filteredFollowersUsers}
                renderItem={renderRowItem}
                keyExtractor={(user: User) => user.id}
                showsVerticalScrollIndicator={false}
                onEndReached={() => endOfListReached()}
                onEndReachedThreshold={0.75}
                ListEmptyComponent={() => (
                  <View style={styles.loadingScreen}>
                    <Text style={{ color: Colors.gray, fontSize: Font.medium }}>No Followers</Text>
                  </View>
                )}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  bottomSheetHeader: {
    textAlign: "center",
    fontSize: 18,
    paddingVertical: 5,
    paddingBottom: 25,
  },

  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
