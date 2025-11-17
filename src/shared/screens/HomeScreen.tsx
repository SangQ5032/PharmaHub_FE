import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@features/auth/stores/useAuthStore';
import { getRoleConfig, RoleOption } from '@shared/config/roleConfig';

const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useAuthStore(state => state.user);
  const role = user?.role;

  // Lấy config theo role
  const roleConfig = React.useMemo(() => {
    return getRoleConfig(role);
  }, [role]);

  const renderFunctionCard = ({ item }: { item: RoleOption }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route as never)}
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
        title="Trang chủ"
        showBack={false}
        avatarUrl="https://your-avatar-url.com"
      />
      <View style={styles.content}>
        <FlatList
          data={roleConfig.options}
          renderItem={renderFunctionCard}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  gridContainer: {
    paddingVertical: 8,
  },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

export default HomeScreen;
