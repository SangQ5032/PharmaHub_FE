// Customer/Customer/components/CustomerItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Customer } from '../types/customer';

type Props = {
  item: Customer;
  onPress: () => void;
};

const CustomerItem = ({ item, onPress }: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.code}>{item.code}</Text>
      </View>

      <Text style={styles.phone}>{item.phone}</Text>
    </TouchableOpacity>
  );
};

export default CustomerItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E1F9E9',
    marginRight: 12,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600' },
  code: { fontSize: 12, color: '#777', marginTop: 2 },
  phone: { fontSize: 13, fontWeight: '500' },
});
