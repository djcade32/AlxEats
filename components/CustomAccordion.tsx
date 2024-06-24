import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Accordion from "react-native-collapsible/Accordion";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { TextInput } from "react-native-gesture-handler";
import Font from "@/constants/Font";
import { RestaurantFilterSortByTypes, RestaurantFilterSortOrder } from "@/types";
import { useFilterStore } from "@/store/filter-storage";
import { RestaurantListFilterPayload } from "@/interfaces";
import { isNumeric } from "@/common-utils";

interface Section {
  icon: JSX.Element;
  title: JSX.Element | string;
  content: JSX.Element;
}

interface CustomAccordionProps {
  filterState: RestaurantListFilterPayload;
  setFilterState: (filter: RestaurantListFilterPayload) => void;
}

const CustomAccordion = ({ filterState, setFilterState }: CustomAccordionProps) => {
  const { restaurantListFilter } = useFilterStore();
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [sortby, setSortby] = useState<RestaurantFilterSortByTypes>(restaurantListFilter.sortBy);
  const [price, setPrice] = useState<string>(restaurantListFilter.priceMax);
  const [focusedInput, setFocusedInput] = useState<string>("");
  const [minScore, setMinScore] = useState<number>(restaurantListFilter.scoreRange.min);
  const [maxScore, setMaxScore] = useState<number>(restaurantListFilter.scoreRange.max);
  const [sortOrder, setSortOrder] = useState<RestaurantFilterSortOrder>(
    restaurantListFilter.sortOrder
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSortby(filterState.sortBy);
    setPrice(filterState.priceMax);
    setSortOrder(filterState.sortOrder);
    setMinScore(filterState.scoreRange.min);
    setMaxScore(filterState.scoreRange.max);
  }, [filterState]);

  useMemo(() => {
    if (minScore < 0) setMinScore(0);
    if (maxScore > 100) setMaxScore(100);
    if (minScore > maxScore) setMaxScore(minScore);
    if (minScore > 100) setMinScore(99);
    if (minScore === 0 && maxScore === 0) setMaxScore(100);
  }, [focusedInput]);

  useEffect(() => {
    // if (loading) return;
    setFilterState({
      priceMax: price,
      scoreRange: { min: minScore < 0 ? 0 : minScore, max: maxScore > 100 ? 100 : maxScore },
      sortOrder: sortOrder,
      sortBy: sortby,
      cuisinesFilter: restaurantListFilter.cuisinesFilter,
    });
    setLoading(false);
  }, [price, sortby, minScore, maxScore, sortOrder]);

  const sections: Section[] = [
    {
      icon: (
        <MaterialCommunityIcons name="sort-alphabetical-variant" size={20} color={Colors.black} />
      ),
      title: "Sort order",
      content: (
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textSmall}>Ascending</Text>
            <TouchableOpacity onPress={() => setSortOrder("ASC")}>
              <MaterialCommunityIcons
                name={sortOrder === "ASC" ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={sortOrder === "ASC" ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.textSmall}>Descending</Text>
            <TouchableOpacity onPress={() => setSortOrder("DESC")}>
              <MaterialCommunityIcons
                name={sortOrder === "DESC" ? "checkbox-intermediate" : "checkbox-blank-outline"}
                size={30}
                color={sortOrder === "DESC" ? Colors.primary : Colors.gray}
              />
            </TouchableOpacity>
          </View>
        </>
      ),
    },
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
      title: "Price maximum",
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
      title: (
        <>
          <Text>Score</Text>{" "}
          {activeSections.includes(3) && (
            <Text style={[styles.textSmall, { color: Colors.gray, fontSize: Font.small }]}>
              Must be between 0 and 100
            </Text>
          )}
        </>
      ),
      content: (
        <View style={{ gap: 10 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text style={styles.textSmall}>Min</Text>
            <TextInput
              selectTextOnFocus
              placeholder="0"
              keyboardType="numeric"
              value={minScore.toString()}
              style={[
                styles.scoreRangeInput,
                focusedInput === "min" && { borderColor: Colors.primary },
              ]}
              selectionColor={Colors.primary}
              cursorColor={Colors.primary}
              onChangeText={(text) => isNumeric(text) && setMinScore(Number(text))}
              onFocus={() => setFocusedInput("min")}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text style={styles.textSmall}>Max</Text>
            <TextInput
              selectTextOnFocus={true}
              placeholder="100"
              keyboardType="numeric"
              value={maxScore.toString()}
              style={[
                styles.scoreRangeInput,
                focusedInput === "max" && { borderColor: Colors.primary },
              ]}
              selectionColor={Colors.primary}
              cursorColor={Colors.primary}
              onChangeText={(text) => isNumeric(text) && setMaxScore(Number(text))}
              onFocus={() => setFocusedInput("max")}
            />
          </View>
        </View>
      ),
    },
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
      expandMultiple={true}
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

  scoreRangeInput: {
    width: 50,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.gray,
    color: Colors.black,
    textAlign: "center",
  },
});
