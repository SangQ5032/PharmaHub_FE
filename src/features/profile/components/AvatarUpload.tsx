/**
 * AvatarUpload Component
 * Component để upload avatar
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName?: string;
  isLoading?: boolean;
  onUpload: (file: FormData) => Promise<string | null>;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatarUrl,
  userName = 'User',
  isLoading = false,
  onUpload,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 500,
      maxWidth: 500,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh');
        return;
      }

      const asset = response.assets?.[0];
      if (asset?.uri) {
        setSelectedImage(asset.uri);
      }
    });
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      Alert.alert('Thông báo', 'Vui lòng chọn ảnh');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      const fileName = selectedImage.split('/').pop() || 'avatar.jpg';
      const mimeType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

      formData.append('avatar', {
        uri: selectedImage,
        type: mimeType,
        name: fileName,
      } as any);

      const result = await onUpload(formData);
      if (result) {
        Alert.alert('Thành Công', 'Upload avatar thành công');
        setSelectedImage(null);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const displayImage = selectedImage || currentAvatarUrl;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ảnh Đại Diện</Text>

      <View style={styles.avatarContainer}>
        {displayImage ? (
          <Image source={{ uri: displayImage }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.button, styles.selectButton]}
        onPress={handlePickImage}
        disabled={uploading || isLoading}
      >
        <Text style={styles.selectButtonText}>Chọn Ảnh</Text>
      </TouchableOpacity>

      {selectedImage && (
        <TouchableOpacity
          style={[styles.button, styles.uploadButton]}
          onPress={handleUpload}
          disabled={uploading || isLoading}
        >
          {uploading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.uploadButtonText}>Upload</Text>
          )}
        </TouchableOpacity>
      )}

      {selectedImage && (
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => setSelectedImage(null)}
          disabled={uploading || isLoading}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderAvatar: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectButton: {
    backgroundColor: '#4CAF50',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#2196F3',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#212121',
    fontSize: 14,
    fontWeight: '600',
  },
});
