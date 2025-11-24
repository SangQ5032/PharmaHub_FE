import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SalesHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleCreateInvoice = () => {
    navigation.navigate(ROUTES.CREATE_INVOICE);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bán Hàng</Text>
      </View> */}

      <View style={styles.content}>
        {/* Create Invoice Card */}
        <TouchableOpacity
          style={styles.createCard}
          onPress={handleCreateInvoice}
          activeOpacity={0.8}
        >
          <View style={styles.cardIconContainer}>
            <Icon name="plus-circle" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.cardTitle}>Tạo Hóa Đơn</Text>
          <Text style={styles.cardDescription}>Tạo hóa đơn bán hàng mới</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    height: 56,
    backgroundColor: '#2EB872',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  backBtn: {
    position: 'absolute',
    left: 12,
    top: 18,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createCard: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardIconContainer: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SalesHubScreen;
