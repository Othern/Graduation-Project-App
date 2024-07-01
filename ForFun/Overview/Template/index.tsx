import { View, Text, Image, StyleSheet, FlatList, SafeAreaView, Animated, useColorScheme,ScrollView } from "react-native";
import React, { useState, useRef } from 'react';
import { Card } from "react-native-paper";
import Icon from 'react-native-vector-icons/Ionicons';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    name: 'shelter_1022',
    description: '問世監情為何物',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s'
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    name: 'eromangasensei_1210',
    description: '歐尼醬什麼的最討厭了!',
    avatarUrl: 'https://steamuserimages-a.akamaihd.net/ugc/1651094778160293860/28F0B5713A2F4D69F937C017E49E2CD0AE719CE5/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false'

  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    name: 'Third Item',
    description: 'Hello Everyone.',
    avatarUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC28lvhB3X_P4cDQ17N2RQvttJRUYagluoPw&s'

  },
];

type ItemProps = { name: string, avatarUrl: string, description: string };

const Item = ({ name, avatarUrl, description }: ItemProps) => {
  const theme = useColorScheme();
  const color = theme === "dark" ? "white" : "black";
  return (
    <View style={styles.item}>

      <View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        <Text style={[styles.name, { color: color }]}>{name}</Text>
      </View>
      <View style={{ height: 350, backgroundColor: 'gray',marginBottom:10 }}>
        {/* Additional content */}
      </View>
      <View style={{ height: 80, padding: 5 }} >
        <View style={{ flexDirection: 'row' }}>
          <Icon name="heart-outline" color={color} size={30} style={{ marginRight: 5 }} />
          <Icon name="chatbubble-outline" color={color} size={28} style={{ marginRight: 5, marginBottom: 5 }} />
        </View>
        <View>
          <Text style={{ fontWeight: '500', color: color }}>{name} {description}</Text>
        </View>
      </View>
    </View>
  )
};
export default ({ kind,scrollY }: any) => {
  return (
      <ScrollView 
                style={{flex: 1}}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: false }
                )}
                scrollEventThrottle={16}>
      {DATA.map((item,key)=>(
        <Item name={item.name} avatarUrl={item.avatarUrl} description={item.description} key={key}/>
      ))}
      </ScrollView>
   )
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    padding: 10,
    flex: 1,
    height: 500,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', // 垂直居中对齐
  },
  flexContainer: {
    flex: 3,
  },
  name: {
    fontSize: 16,

    fontWeight: 'bold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});