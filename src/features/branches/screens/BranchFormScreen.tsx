import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useCreateBranch, useUpdateBranch } from '../hooks/useBranches';
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from '@react-navigation/native';
import { useLocationPermission } from '@shared/hooks/useLocationPermission';

// Import Geolocation từ package
import Geolocation from '@react-native-community/geolocation';

interface LocationData {
  latitude: number;
  longitude: number;
  radius: number;
}

const BranchFormScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mode, item } = route.params || { mode: 'create' };
  const { requestPermission } = useLocationPermission();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [revenueTarget, setRevenueTarget] = useState<string>('0');
  const [location, setLocation] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    radius: 100,
  });
  const [loadingLocation, setLoadingLocation] = useState(false);

  const createMut = useCreateBranch();
  const updateMut = useUpdateBranch();

  useEffect(() => {
    if (mode === 'edit' && item) {
      setName(item.name || '');
      setAddress(item.address || '');
      setPhone(item.phone || '');
      setRevenueTarget(String(item.revenue_target ?? '0'));
      if (item.location) {
        setLocation({
          latitude: item.location.latitude || 0,
          longitude: item.location.longitude || 0,
          radius: item.location.radius || 100,
        });
      }
    }
  }, [mode, item]);

  // Lắng nghe khi quay lại từ MapPickerScreen với location mới
  useFocusEffect(
    React.useCallback(() => {
      const selectedLocation = route.params?.selectedLocation;
      if (selectedLocation) {
        setLocation(selectedLocation);
        // Clear params để không lặp
        navigation.setParams({ selectedLocation: undefined });
      }
    }, [route.params?.selectedLocation, navigation]),
  );

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const hasPermission = await requestPermission();
      return hasPermission;
    } catch (error: any) {
      Alert.alert('Lỗi', 'Lỗi khi yêu cầu quyền: ' + error.message);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    try {
      // Xin quyền trước
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setLoadingLocation(false);
        Alert.alert(
          'Quyền bị từ chối',
          'Vui lòng cấp quyền truy cập vị trí trong cài đặt ứng dụng',
        );
        return;
      }

      // Sử dụng Geolocation từ @react-native-community/geolocation
      Geolocation.getCurrentPosition(
        (position: any) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radius: 100,
          });
          setLoadingLocation(false);
          Alert.alert('Thành công', 'Đã lấy vị trí hiện tại');
        },
        (_error: any) => {
          setLoadingLocation(false);
          Alert.alert(
            'Lỗi',
            'Không thể lấy vị trị hiện tại. Vui lòng kiểm tra GPS và thử lại',
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } catch (error: any) {
      setLoadingLocation(false);
      Alert.alert('Lỗi', 'Lỗi khi lấy vị trí: ' + error.message);
    }
  };

  const openMapPicker = () => {
    if (location.latitude && location.longitude) {
      navigation.navigate('MapPicker', {
        initialLocation: location,
      });
    } else {
      Alert.alert('Thông báo', 'Vui lòng lấy vị trí hiện tại trước');
    }
  };

  const onSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên chi nhánh');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập địa chỉ');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }
    if (!location.latitude || !location.longitude) {
      Alert.alert('Lỗi', 'Vui lòng chọn vị trí');
      return;
    }

    const payload = {
      name,
      address,
      phone,
      revenue_target: Number(revenueTarget) || 0,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        radius: location.radius,
      },
    };

    try {
      if (mode === 'edit' && item && item._id) {
        await updateMut.mutateAsync({ id: item._id, payload });
      } else {
        await createMut.mutateAsync(payload);
      }
      Alert.alert(
        'Thành công',
        mode === 'edit'
          ? 'Cập nhật chi nhánh thành công'
          : 'Tạo chi nhánh thành công',
      );
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể lưu chi nhánh');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tên chi nhánh</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Mục tiêu doanh thu</Text>
      <TextInput
        style={styles.input}
        value={revenueTarget}
        onChangeText={setRevenueTarget}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Vị trí (Location)</Text>
      <View style={styles.locationContainer}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>
            Latitude: {location.latitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>
            Longitude: {location.longitude.toFixed(6)}
          </Text>
          <Text style={styles.locationText}>Radius: {location.radius}m</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={getCurrentLocation}
        disabled={loadingLocation}
      >
        {loadingLocation ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>📍 Lấy vị trí hiện tại</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonSecondary]}
        onPress={openMapPicker}
        disabled={!location.latitude}
      >
        <Text style={styles.buttonText}>🗺️ Chọn vị trí trên bản đồ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          mode === 'edit' ? styles.buttonSuccess : styles.buttonPrimary,
        ]}
        onPress={onSubmit}
        disabled={createMut.isPending || updateMut.isPending}
      >
        {createMut.isPending || updateMut.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {mode === 'edit' ? '✏️ Cập nhật' : '✨ Tạo chi nhánh'}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  label: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  locationContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: '#f5f5f5',
  },
  locationInfo: {
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#555',
    fontFamily: 'Courier New',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#17a2b8',
  },
  buttonSuccess: {
    backgroundColor: '#28a745',
  },
  buttonPrimary: {
    backgroundColor: '#007bff',
  },
});

export default BranchFormScreen;
