import {Appbar} from 'react-native-paper';
import {getHeaderTitle} from '@react-navigation/elements';
import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {useColorScheme} from 'react-native';

const fontColor = '#E7F5F3';
export default ({route, options, back, navigation, push}: any) => {
  let title = getHeaderTitle(options, route.name);
  const theme = useColorScheme();
  title = title == 'myPost' ? 'My Post' : 'Revise My Post';
  return (
    <Appbar.Header
      style={{backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F0C750'}}>
      {title != 'Preview' && (
        <Appbar.Action
          onPress={navigation.goBack}
          icon={() => (
            <Entypo name={'chevron-left'} size={25} color={fontColor} />
          )}
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
