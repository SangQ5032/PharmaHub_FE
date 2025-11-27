import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface LocationData {
  latitude: number;
  longitude: number;
  radius: number;
}

const MapPickerScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { initialLocation } = route.params || {};
  const mapRef = useRef<MapView>(null);

  const [selectedLocation, setSelectedLocation] = useState<LocationData>({
    latitude: initialLocation?.latitude || 10.776889,
    longitude: initialLocation?.longitude || 106.700806,
    radius: initialLocation?.radius || 100,
  });

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({
      ...selectedLocation,
      latitude,
      longitude,
    });
  };

  const handleConfirm = () => {
    if (!selectedLocation.latitude || !selectedLocation.longitude) {
      Alert.alert('Lỗi', 'Vui lòng chọn vị trí trên bản đồ');
      return;
    }

    const newLocation: LocationData = {
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      radius: selectedLocation.radius || 100,
    };

    // Truyền lại location cho BranchFormScreen
    // navigation.navigate('AddEditBranch', { selectedLocation: newLocation });
    navigation.goBack({ selectedLocation: newLocation });
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCenterMap = () => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500,
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Chọn Vị Trí Chi Nhánh</Text>
        <Text style={styles.headerSubtitle}>
          Bấm trên bản đồ để chọn vị trí
        </Text>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {/* Marker tại vị trí được chọn */}
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Vị trí chi nhánh"
            description={`${selectedLocation.latitude.toFixed(
              6,
            )}, ${selectedLocation.longitude.toFixed(6)}`}
          />
        </MapView>

        {/* Center Marker (pin ở giữa) */}
        <View style={styles.centerPin}>
          <Text style={styles.centerPinText}>📍</Text>
        </View>
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📌 Vị Trí Được Chọn:</Text>
        <View style={styles.coordRow}>
          <Text style={styles.coordLabel}>Latitude:</Text>
          <Text style={styles.coordValue}>
            {selectedLocation.latitude.toFixed(6)}
          </Text>
        </View>
        <View style={styles.coordRow}>
          <Text style={styles.coordLabel}>Longitude:</Text>
          <Text style={styles.coordValue}>
            {selectedLocation.longitude.toFixed(6)}
          </Text>
        </View>
        <View style={styles.coordRow}>
          <Text style={styles.coordLabel}>Radius:</Text>
          <Text style={styles.coordValue}>{selectedLocation.radius}m</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleCenterMap}
        >
          <Text style={styles.buttonText}>🎯 Căn Giữa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonCancel]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>❌ Huỷ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonConfirm]}
          onPress={handleConfirm}
        >
          <Text style={styles.buttonText}>✅ Xác Nhận</Text>
        </TouchableOpacity>
      </View>

      {/* Guide */}
      <View style={styles.guide}>
        <Text style={styles.guideText}>
          💡 Bấm bất kỳ điểm nào trên bản đồ để chọn vị trí chi nhánh
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#e0e0e0',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centerPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -15,
    width: 30,
    height: 30,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
  },
  centerPinText: {
    fontSize: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    marginHorizontal: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0052a3',
    marginBottom: 8,
  },
  coordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 3,
  },
  coordLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  coordValue: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: 'Courier New',
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonSecondary: {
    backgroundColor: '#17a2b8',
  },
  buttonCancel: {
    backgroundColor: '#6c757d',
  },
  buttonConfirm: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  guide: {
    backgroundColor: '#fffbea',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  guideText: {
    fontSize: 12,
    color: '#ff8800',
    lineHeight: 16,
    fontWeight: '500',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default MapPickerScreen;
