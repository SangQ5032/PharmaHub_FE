import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

type Props = {
  item: any;
  onPress?: () => void;
  onDelete?: () => void;
};

const BranchItem: React.FC<Props> = ({ item, onPress, onDelete }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.address}>{item.address}</Text>
          {item.phone ? <Text style={styles.phone}>{item.phone}</Text> : null}
        </View>
        {onDelete ? (
          <TouchableWithoutFeedback onPress={onDelete}>
            <View style={styles.deleteButton}>
              <Text style={styles.deleteText}>Xóa</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: { flex: 1, paddingRight: 8 },
  name: { fontSize: 16, fontWeight: '600' },
  address: { fontSize: 13, color: '#666', marginTop: 4 },
  phone: { fontSize: 13, color: '#666', marginTop: 2 },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ff5252',
    borderRadius: 6,
  },
  deleteText: { color: '#fff', fontWeight: '600' },
});

export default BranchItem;
