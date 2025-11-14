import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface StatCardProps {
  label: string;
  value: string | number;
  valueColor?: string;
  containerStyle?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  valueColor = '#333',
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
