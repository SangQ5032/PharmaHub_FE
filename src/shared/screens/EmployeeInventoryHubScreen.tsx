import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Header } from '@shared/components/header/Header';
import { getRoleConfig, RoleOption } from '@shared/config/roleConfig';
import { useAuthStore } from '@features/auth/stores/useAuthStore';

const EMPLOYEE_INVENTORY_OPTION_IDS = new Set(['staff-5', 'staff-10']);

const EmployeeInventoryHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore(state => state.user);
  const role = user?.role;

  const roleConfig = React.useMemo(() => getRoleConfig(role), [role]);

  const options = React.useMemo(() => {
    return roleConfig.options.filter(o =>
      EMPLOYEE_INVENTORY_OPTION_IDS.has(o.id),
    );
  }, [roleConfig.options]);

  const renderCard = ({ item }: { item: RoleOption }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={32} color="#4CAF50" />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Kho & Thuốc"
        showBack={false}
        avatarUrl="https://your-avatar-url.com"
      />
      <View style={styles.content}>
        <FlatList
          data={options}
          renderItem={renderCard}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, padding: 16 },
  gridContainer: { paddingVertical: 8 },
  card: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 120,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#E8F5E9',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
});

export default EmployeeInventoryHubScreen;
