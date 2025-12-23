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
  onClose?: () => void;
  onOpen?: () => void;
};

const BranchItem: React.FC<Props> = ({ item, onPress, onClose, onOpen }) => {
  const isClosed = item.status === 'closed';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {isClosed && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Đã đóng cửa</Text>
              </View>
            )}
          </View>
          <Text style={styles.address}>{item.address}</Text>
          {item.phone ? <Text style={styles.phone}>{item.phone}</Text> : null}
        </View>
        {isClosed && onOpen ? (
          <TouchableWithoutFeedback onPress={onOpen}>
            <View style={styles.openButton}>
              <Text style={styles.openText}>Mở cửa</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : onClose && !isClosed ? (
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.closeButton}>
              <Text style={styles.closeText}>Đóng cửa</Text>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  name: { fontSize: 16, fontWeight: '600' },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: '#ff9800',
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  address: { fontSize: 13, color: '#666', marginTop: 4 },
  phone: { fontSize: 13, color: '#666', marginTop: 2 },
  closeButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ff5252',
    borderRadius: 6,
  },
  closeText: { color: '#fff', fontWeight: '600' },
  openButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#4caf50',
    borderRadius: 6,
  },
  openText: { color: '#fff', fontWeight: '600' },
});

export default BranchItem;
