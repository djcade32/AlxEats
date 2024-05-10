import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  SectionList,
} from "react-native";
import React, { useCallback, useState } from "react";
import Accordion from "react-native-collapsible/Accordion";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
import Cuisines from "@/data/Cuisines";
import CustomTextInput from "./CustomTextInput";

interface Section {
  icon: JSX.Element;
  title: string;
  content: JSX.Element;
}

const THUMB_RADIUS_LOW = 12;
const THUMB_RADIUS_HIGH = 16;

const CustomAccordion = () => {
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [sortby, setSortby] = useState("Distance");
  const [price, setPrice] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [cuisines, setCuisines] = useState<string[]>([]);

  const sections: Section[] = [
    {
      icon: <MaterialCommunityIcons name="sort" size={20} color={Colors.black} />,
      title: "Sort by",
      content: (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textSmall}>Distance</Text>
            <TouchableOpacity onPress={() => setSortby("Distance")}>
              <MaterialCommunityIcons
                name={sortby === "Distance" ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={sortby === "Distance" ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textSmall}>Price</Text>
            <TouchableOpacity onPress={() => setSortby("Price")}>
              <MaterialCommunityIcons
                name={sortby === "Price" ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={sortby === "Price" ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textSmall}>Score</Text>
            <TouchableOpacity onPress={() => setSortby("Score")}>
              <MaterialCommunityIcons
                name={sortby === "Score" ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={sortby === "Score" ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
        </>
      ),
    },
    {
      icon: <Ionicons name="pricetag-outline" size={20} color={Colors.black} />,
      title: "Price minimum",
      content: (
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <TouchableOpacity
            style={{
              width: 65,
              borderRadius: 5,
              paddingVertical: 5,
              borderWidth: 1,
              backgroundColor: price === "$" ? Colors.primary : "white",
              borderColor: price === "$" ? Colors.primary : Colors.gray,
            }}
            onPress={() => setPrice((prev) => (prev === "$" ? "" : "$"))}
          >
            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                color: price === "$" ? "white" : Colors.gray,
              }}
            >
              $
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 65,
              borderRadius: 5,
              paddingVertical: 5,
              borderWidth: 1,
              backgroundColor: price === "$$" ? Colors.primary : "white",
              borderColor: price === "$$" ? Colors.primary : Colors.gray,
            }}
            onPress={() => setPrice((prev) => (prev === "$$" ? "" : "$$"))}
          >
            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                color: price === "$$" ? "white" : Colors.gray,
              }}
            >
              $$
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 65,
              borderRadius: 5,
              paddingVertical: 5,
              borderWidth: 1,
              backgroundColor: price === "$$$" ? Colors.primary : "white",
              borderColor: price === "$$$" ? Colors.primary : Colors.gray,
            }}
            onPress={() => setPrice((prev) => (prev === "$$$" ? "" : "$$$"))}
          >
            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                color: price === "$$$" ? "white" : Colors.gray,
              }}
            >
              $$$
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 65,
              borderRadius: 5,
              paddingVertical: 5,
              borderWidth: 1,
              backgroundColor: price === "$$$$" ? Colors.primary : "white",
              borderColor: price === "$$$$" ? Colors.primary : Colors.gray,
            }}
            onPress={() => setPrice((prev) => (prev === "$$$$" ? "" : "$$$$"))}
          >
            <Text
              style={{
                fontSize: 22,
                textAlign: "center",
                color: price === "$$$$" ? "white" : Colors.gray,
              }}
            >
              $$$$
            </Text>
          </TouchableOpacity>
        </View>
      ),
    },
    {
      icon: <Ionicons name="stats-chart-outline" size={20} color={Colors.black} />,
      title: "Score",
      content: (
        <>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.textSmall}>0 - 2</Text>
            <TouchableOpacity onPress={() => setScore((prev) => (prev === 0 ? null : 0))}>
              <MaterialCommunityIcons
                name={score === 0 ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={score === 0 ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.textSmall}>2 - 4</Text>
            <TouchableOpacity onPress={() => setScore((prev) => (prev === 1 ? null : 1))}>
              <MaterialCommunityIcons
                name={score === 1 ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={score === 1 ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.textSmall}>4 - 6</Text>
            <TouchableOpacity onPress={() => setScore((prev) => (prev === 2 ? null : 2))}>
              <MaterialCommunityIcons
                name={score === 2 ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={score === 2 ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.textSmall}>6 - 8</Text>
            <TouchableOpacity onPress={() => setScore((prev) => (prev === 3 ? null : 3))}>
              <MaterialCommunityIcons
                name={score === 3 ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={score === 3 ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.textSmall}>8 - 10</Text>
            <TouchableOpacity onPress={() => setScore((prev) => (prev === 4 ? null : 4))}>
              <MaterialCommunityIcons
                name={score === 4 ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={score === 4 ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
        </>
      ),
    },
    // {
    //   icon: <Ionicons name="restaurant-outline" size={20} color={Colors.black} />,
    //   title: "Cuisine",
    //   content: (
    //     <SectionList
    //       showsVerticalScrollIndicator={false}
    //       sections={CUISINES}
    //       renderItem={({ item }) => (
    //         <View key={item}>
    //           <Text style={styles.textSmall}>{item}</Text>
    //         </View>
    //       )}
    //       stickyHeaderIndices={[0]}
    //       renderSectionHeader={() => (
    //         <View style={{ backgroundColor: "white", paddingBottom: 10 }}>
    //           <CustomTextInput
    //             name="search"
    //             placeholder="Search cuisine"
    //             icon={<Ionicons name="search" size={18} color={Colors.gray} />}
    //             value={searchText}
    //             onChange={setSearchText}
    //             customStyles={styles.searchInput}
    //             showErrorMessage={false}
    //           />
    //         </View>
    //       )}
    //     />
    //   ),
    // },
  ];

  function renderHeader(section: Section, _: number, isActive: boolean) {
    return (
      <View
        style={[
          styles.accordHeader,
          !isActive && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.gray },
        ]}
      >
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          {section.icon}
          <Text style={styles.accordTitle}>{section.title}</Text>
        </View>

        <Ionicons name={isActive ? "chevron-up" : "chevron-down"} size={20} color={Colors.black} />
      </View>
    );
  }

  function renderContent(section: Section, _: number, isActive: boolean) {
    return (
      <View
        style={[
          styles.accordBody,
          isActive && { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: Colors.gray },
        ]}
      >
        {section.content}
      </View>
    );
  }

  return (
    <Accordion
      align="bottom"
      sections={sections}
      activeSections={activeSections}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={(sections) => setActiveSections(sections)}
      sectionContainerStyle={styles.accordContainer}
    />
  );
};

export default CustomAccordion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  accordContainer: {
    paddingBottom: 4,
    flex: 1,
    backgroundColor: "white",
  },

  accordHeader: {
    padding: 12,
    backgroundColor: "white",
    color: Colors.black,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    alignItems: "center",
  },

  accordTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: Colors.black,
  },

  accordBody: {
    padding: 12,
    gap: 25,
  },

  textSmall: {
    fontSize: 18,
    color: Colors.black,
  },

  applyFilterButton: {
    marginHorizontal: 12,
    backgroundColor: Colors.primary,
    borderRadius: 25,
    padding: 12,
    marginBottom: 20,
  },

  searchInput: {
    backgroundColor: "white",
    flex: 1,
  },
});
