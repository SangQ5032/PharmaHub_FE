import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CategoriesList from '../components/CategoriesList';

const CategoriesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Quản lý danh mục</Text>
      </View>
      <CategoriesList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  titleContainer: {
    height: 56,
    backgroundColor: '#2EB872',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: { fontSize: 20, fontWeight: '600', color: '#fff' },
});

export default CategoriesScreen;
