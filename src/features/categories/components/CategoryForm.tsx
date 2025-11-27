import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export type CategoryFormValues = {
  name: string;
  description?: string;
};

export type CategoryFormProps = {
  initialValues?: CategoryFormValues;
  submitting?: boolean;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
  onCancel?: () => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name ?? '');
      setDescription(initialValues.description ?? '');
    }
  }, [initialValues]);

  const validate = useMemo(() => {
    return () => {
      let ok = true;
      // name required 2-100
      if (!name.trim()) {
        setNameError('Tên là bắt buộc');
        ok = false;
      } else if (name.trim().length < 2) {
        setNameError('Tên phải có ít nhất 2 ký tự');
        ok = false;
      } else if (name.trim().length > 100) {
        setNameError('Tên tối đa 100 ký tự');
        ok = false;
      } else {
        setNameError(null);
      }

      // description <= 500
      if (description && description.length > 500) {
        setDescError('Mô tả tối đa 500 ký tự');
        ok = false;
      } else {
        setDescError(null);
      }

      return ok;
    };
  }, [name, description]);

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
      });
    } catch (e: any) {
      const serverMsg = e?.response?.data?.message || e?.response?.data?.error;
      Alert.alert('Lỗi', serverMsg || e?.message || 'Không thể lưu');
    }
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Tên danh mục *</Text>
      <TextInput
        style={[styles.input, nameError && styles.errorInput]}
        value={name}
        onChangeText={t => {
          setName(t);
          if (nameError) setNameError(null);
        }}
        placeholder="Nhập tên danh mục"
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.multiline, descError && styles.errorInput]}
        value={description}
        onChangeText={t => {
          setDescription(t);
          if (descError) setDescError(null);
        }}
        placeholder="Mô tả (tối đa 500 ký tự)"
        multiline
        numberOfLines={5}
        textAlignVertical="top"
      />
      {descError ? <Text style={styles.errorText}>{descError}</Text> : null}

      <View style={styles.actions}>
        {onCancel ? (
          <TouchableOpacity
            style={[styles.btn, styles.btnGhost]}
            onPress={onCancel}
            disabled={submitting}
          >
            <Text style={[styles.btnText, styles.btnGhostText]}>Hủy</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[
            styles.btn,
            styles.btnPrimary,
            submitting && { opacity: 0.7 },
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={[styles.btnText, styles.btnPrimaryText]}>
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  form: { padding: 16, paddingBottom: 40 },
  label: { marginTop: 12, marginBottom: 4, fontWeight: '600', color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  multiline: { height: 120 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnText: { fontWeight: '700' },
  btnPrimary: { backgroundColor: '#2EB872' },
  btnPrimaryText: { color: '#fff' },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0' },
  btnGhostText: { color: '#333' },
  errorText: { color: '#D32F2F', marginTop: 4 },
  errorInput: { borderColor: '#D32F2F' },
});

export default CategoryForm;
