import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type DeleteConfirmProps = {
  visible: boolean;
  title?: string;
  message?: string;
  confirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  visible,
  title = 'Xác nhận xóa',
  message = 'Bạn có chắc chắn muốn xóa mục này? Hành động không thể hoàn tác.',
  confirming = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.btnGhost]}
              disabled={confirming}
              onPress={onCancel}
            >
              <Text style={[styles.btnText, styles.btnGhostText]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.btnDanger,
                confirming && { opacity: 0.7 },
              ]}
              disabled={confirming}
              onPress={onConfirm}
            >
              <Text style={[styles.btnText, styles.btnDangerText]}>
                {confirming ? 'Đang xóa...' : 'Xóa'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 16,
  },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#222' },
  message: { color: '#444' },
  row: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnText: { fontWeight: '700' },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E0E0E0' },
  btnGhostText: { color: '#333' },
  btnDanger: { backgroundColor: '#D32F2F' },
  btnDangerText: { color: '#fff' },
});

export default DeleteConfirm;
