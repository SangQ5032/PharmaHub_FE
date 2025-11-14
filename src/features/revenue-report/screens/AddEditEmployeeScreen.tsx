import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Header } from '@shared/components/header/Header';
import { addEditEmployeeStyles as styles } from '../styles';

interface AddEditEmployeeScreenProps {
  route: any;
  navigation: any;
}

export default function AddEditEmployeeScreen({
  route,
  navigation,
}: AddEditEmployeeScreenProps) {
  const { mode, employeeName } = route?.params || {};
  const isEditMode = mode === 'edit';

  // Form states
  const [name, setName] = useState(isEditMode ? employeeName || '' : '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Thu ngân');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [commissionRate, setCommissionRate] = useState('3');
  const [targetRevenue, setTargetRevenue] = useState('');

  const roles = ['Thu ngân', 'Dược sĩ', 'Quản lý ca', 'Bán hàng', 'Kế toán'];

  const handleSave = () => {
    // Validate form
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nhân viên');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    // TODO: Implement save logic (API call or state management)
    Alert.alert(
      'Thành công',
      isEditMode
        ? `Đã cập nhật thông tin nhân viên "${name}"`
        : `Đã thêm nhân viên "${name}" thành công`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={isEditMode ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        showBack={true}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Họ và tên <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nhập họ và tên nhân viên"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Số điện thoại <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email (không bắt buộc)"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Role and Status Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vai trò & Trạng thái</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Vai trò <Text style={styles.required}>*</Text>
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipContainer}
            >
              {roles.map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, role === r && styles.chipSelected]}
                  onPress={() => setRole(r)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      role === r && styles.chipTextSelected,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Trạng thái</Text>
            <View style={styles.statusContainer}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'active' && styles.statusButtonActive,
                ]}
                onPress={() => setStatus('active')}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === 'active' && styles.statusButtonTextActive,
                  ]}
                >
                  ✓ Hoạt động
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'inactive' && styles.statusButtonInactive,
                ]}
                onPress={() => setStatus('inactive')}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    status === 'inactive' && styles.statusButtonTextInactive,
                  ]}
                >
                  ⊗ Tạm khóa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Revenue Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt doanh thu</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tỷ lệ hoa hồng (%)</Text>
            <TextInput
              style={styles.input}
              value={commissionRate}
              onChangeText={setCommissionRate}
              placeholder="Nhập tỷ lệ hoa hồng"
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mục tiêu doanh thu (VNĐ)</Text>
            <TextInput
              style={styles.input}
              value={targetRevenue}
              onChangeText={setTargetRevenue}
              placeholder="Nhập mục tiêu doanh thu tháng"
              keyboardType="number-pad"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            <Text style={styles.required}>*</Text> Các trường bắt buộc
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {isEditMode ? 'Lưu thay đổi' : 'Thêm nhân viên'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
