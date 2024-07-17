import {Appbar} from 'react-native-paper';
import {getHeaderTitle} from '@react-navigation/elements';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
const fontColor = '#E7F5F3';
export default ({route, options, back, navigation, theme, push}: any) => {
  let title = getHeaderTitle(options, route.name);
  title = title != 'Map' ? title : 'Home';
  return (
    <Appbar.Header
      style={{backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F0C750'}}>
      {title != 'Preview' && (
        <Appbar.Action
          onPress={navigation.goBack}
          icon={() => <Entypo name={'chevron-left'} size={25} color={fontColor} />}
          color={fontColor}
        />
      )}
      <Appbar.Content
        title={title}
        titleStyle={{
          fontSize: 25,
          fontWeight: 'bold',
          color: fontColor,
          padding: 10,
        }}
      />
    </Appbar.Header>
  );
};
