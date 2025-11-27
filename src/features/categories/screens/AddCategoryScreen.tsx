import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ROUTES } from '@shared/constants/routes';
import { MainStackParamList } from '@shared/types/navigation';
import CategoryForm, { CategoryFormValues } from '../components/CategoryForm';
import { createCategory, updateCategory } from '../services/categoriesService';

const AddCategoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route =
    useRoute<RouteProp<MainStackParamList, typeof ROUTES.ADD_CATEGORY>>();
  const mode = (route.params as any)?.mode as 'edit' | undefined;
  const editingItem = (route.params as any)?.item;

  const [initialValues, setInitialValues] = useState<
    CategoryFormValues | undefined
  >(undefined);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && editingItem) {
      setInitialValues({
        name: editingItem?.name || '',
        description: editingItem?.description || '',
      });
    }
  }, [mode, editingItem]);

  const handleSubmit = async (values: CategoryFormValues) => {
    setSubmitting(true);
    try {
      if (mode === 'edit' && editingItem?._id) {
        await updateCategory(String(editingItem._id), values);
      } else {
        await createCategory(values);
      }
      navigation.goBack();
    } catch (e: any) {
      const status = e?.response?.status;
      const serverMsg = e?.response?.data?.message || e?.response?.data?.error;
      if (status === 409) {
        Alert.alert('Lỗi', 'Tên danh mục đã tồn tại. Vui lòng chọn tên khác.');
      } else {
        Alert.alert('Lỗi', serverMsg || e?.message || 'Không thể lưu');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>
          {mode === 'edit' ? 'Sửa danh mục' : 'Thêm danh mục'}
        </Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <CategoryForm
          initialValues={initialValues}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigation.goBack()}
        />
      </ScrollView>
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
  },
  titleText: { fontSize: 20, fontWeight: '600', color: '#fff' },
  backBtn: { position: 'absolute', left: 12, top: 18 },
  backText: { color: '#fff', fontWeight: '500' },
});

export default AddCategoryScreen;
