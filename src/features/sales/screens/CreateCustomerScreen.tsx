import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { Customer } from '../api/customers.api';

interface CreateCustomerScreenProps {
  route?: RouteProp<any>;
}

const CreateCustomerScreen: React.FC<CreateCustomerScreenProps> = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const mode = route?.params?.mode as 'edit' | undefined;
  const editingCustomer = route?.params?.customer as Customer | undefined;

  const { mutate: createCustomerMutation, isPending: isCreating } =
    useCreateCustomer();
  const { mutate: updateCustomerMutation, isPending: isUpdating } =
    useUpdateCustomer();

  const isPending = isCreating || isUpdating;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (mode === 'edit' && editingCustomer) {
      setName(editingCustomer.name || '');
      setPhone(editingCustomer.phone || '');
      setAddress(editingCustomer.address || '');
      setEmail(editingCustomer.email || '');
    }
  }, [mode, editingCustomer]);

  const handleSubmit = () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên khách hàng');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    const customerData = {
      name: name.trim(),
      phone: phone.trim(),
      ...(address.trim() ? { address: address.trim() } : {}),
      ...(email.trim() ? { email: email.trim() } : {}),
    };

    if (mode === 'edit' && editingCustomer?._id) {
      // Update customer
      updateCustomerMutation(
        { id: editingCustomer._id, data: customerData },
        {
          onSuccess: () => {
            Alert.alert('Thành công', 'Cập nhật khách hàng thành công', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          },
          onError: (error: any) => {
            Alert.alert(
              'Lỗi',
              error?.response?.data?.message || 'Cập nhật khách hàng thất bại',
            );
          },
        },
      );
    } else {
      // Create customer
      createCustomerMutation(customerData, {
        onSuccess: customer => {
          Alert.alert('Thành công', 'Tạo khách hàng thành công', [
            {
              text: 'OK',
              onPress: () => {
                // Check if coming from CreateInvoice screen
                if (route?.params?.fromCreateInvoice) {
                  navigation.navigate('CreateInvoice', {
                    newCustomer: customer,
                  });
                } else {
                  navigation.goBack();
                }
              },
            },
          ]);
        },
        onError: (error: any) => {
          Alert.alert(
            'Lỗi',
            error?.response?.data?.message || 'Tạo khách hàng thất bại',
          );
        },
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {mode === 'edit'
            ? 'Cập nhật thông tin khách hàng'
            : 'Thông tin khách hàng'}
        </Text>

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên khách hàng *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên khách hàng"
            value={name}
            onChangeText={setName}
            editable={!isPending}
            placeholderTextColor="#999"
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Số điện thoại *</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!isPending}
            placeholderTextColor="#999"
          />
          <Text style={styles.hint}>
            Nhập số điện thoại có ít nhất 10 chữ số
          </Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email (không bắt buộc)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isPending}
            placeholderTextColor="#999"
          />
        </View>

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Địa chỉ</Text>
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Nhập địa chỉ (không bắt buộc)"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={4}
            editable={!isPending}
            placeholderTextColor="#999"
            textAlignVertical="top"
          />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isPending}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {mode === 'edit' ? 'Cập nhật khách hàng' : 'Tạo khách hàng'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#00AA44',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  spacer: {
    height: 20,
  },
});

export default CreateCustomerScreen;
