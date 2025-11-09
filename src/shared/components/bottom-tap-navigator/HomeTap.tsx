/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '@shared/types/homeTab';

export type TabItem = {
  name: keyof HomeTabParamList;
  component: React.ComponentType<any>;
  label: string;
};

type HomeNavigatorProps = {
  tabs: TabItem[];
  tabBarStyle?: object;
  activeTintColor?: string;
  inactiveTintColor?: string;
};

const Tab = createBottomTabNavigator();

export const HomeNavigator: React.FC<HomeNavigatorProps> = ({
  tabs,
  tabBarStyle = {},
  activeTintColor = '#007AFF',
  inactiveTintColor = '#8E8E93',
}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, tabBarStyle],
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color }) => (
              <View style={[styles.tabIcon, { backgroundColor: color }]} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export const DefaultScreenWrapper: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <View style={styles.screenContainer}>{children}</View>;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
  },
  tabIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
});
