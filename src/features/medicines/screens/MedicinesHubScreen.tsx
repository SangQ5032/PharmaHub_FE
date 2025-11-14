import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';

const CardButton: React.FC<{ label: string; onPress: () => void; color?: string }>
  = ({ label, onPress, color = '#2EB872' }) => (
  <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress} activeOpacity={0.85}>
    <Text style={[styles.cardText, { color }]}>{label}</Text>
  </TouchableOpacity>
);

const MedicinesHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Medicines Hub</Text>
      </View>

      <View style={styles.content}>
        <CardButton label="Quản lý thuốc" onPress={() => navigation.navigate(ROUTES.MEDICINES)} />
        <CardButton label="Quản lý nhà cung cấp" color="#1B5E20" onPress={() => navigation.navigate(ROUTES.SUPPLIERS)} />
      </View>
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
    marginBottom: 8,
  },
  titleText: { fontSize: 20, fontWeight: '600', color: '#fff' },
  content: { padding: 16 },
  card: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FAFFFA',
  },
  cardText: { fontSize: 18, fontWeight: '700' },
});

export default MedicinesHubScreen;
