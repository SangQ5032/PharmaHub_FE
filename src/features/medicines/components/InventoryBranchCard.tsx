import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { BranchInventory, Batch } from '../types';

interface InventoryBranchCardProps {
  branch: BranchInventory;
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return dateString;
  }
};

const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const BatchItem: React.FC<{ batch: Batch }> = ({ batch }) => {
  return (
    <View style={styles.batchItem}>
      <View style={styles.batchHeader}>
        <Text style={styles.batchNumber}>Lô: {batch.batch_number}</Text>
        <Text style={styles.batchQuantity}>SL: {batch.quantity}</Text>
      </View>
      <View style={styles.batchDetails}>
        <Text style={styles.batchDetail}>
          Hạn: {formatDate(batch.expiry_date)}
        </Text>
        <Text style={styles.batchDetail}>
          Giá nhập: {formatPrice(batch.import_price)}đ
        </Text>
      </View>
    </View>
  );
};

const InventoryBranchCard: React.FC<InventoryBranchCardProps> = ({
  branch,
}) => {
  const [expanded, setExpanded] = useState(false);

  const statusColor =
    branch.total_quantity > 0
      ? '#4CAF50'
      : branch.total_quantity === 0
      ? '#F44336'
      : '#FF9800';

  const statusTextColor =
    branch.total_quantity > 0
      ? '#4CAF50'
      : branch.total_quantity === 0
      ? '#F44336'
      : '#FF9800';

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={[styles.header, { borderLeftColor: statusColor }]}
        onPress={() => setExpanded(!expanded)}
      >
        <View style={styles.headerContent}>
          <Text style={styles.branchName}>{branch.branch_name}</Text>
          <Text style={styles.branchAddress} numberOfLines={1}>
            {branch.branch_address}
          </Text>
          <Text style={styles.branchPhone}>{branch.branch_phone}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.quantityBadge}>
            <Text style={styles.quantityText}>{branch.total_quantity}</Text>
          </View>
          <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.statusRow}>
            <Text style={styles.label}>Trạng thái:</Text>
            <Text style={[styles.status, { color: statusTextColor }]}>
              {branch.in_stock}
            </Text>
          </View>

          {branch.batches.length > 0 ? (
            <>
              <Text style={styles.batchesTitle}>Thông tin lô hàng:</Text>
              <FlatList
                data={branch.batches}
                keyExtractor={item => item._id}
                renderItem={({ item }) => <BatchItem batch={item} />}
                scrollEnabled={false}
              />
            </>
          ) : (
            <View style={styles.emptyBatches}>
              <Text style={styles.emptyText}>Không có lô hàng</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
    borderLeftWidth: 4,
  },
  headerContent: {
    flex: 1,
    marginRight: 12,
  },
  branchName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  branchPhone: {
    fontSize: 12,
    color: '#999',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityBadge: {
    backgroundColor: '#2196F3',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    minWidth: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  expandIcon: {
    fontSize: 12,
    color: '#666',
    width: 12,
  },
  expandedContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  batchesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  batchItem: {
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2196F3',
  },
  batchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  batchNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  batchQuantity: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2196F3',
  },
  batchDetails: {
    gap: 4,
  },
  batchDetail: {
    fontSize: 12,
    color: '#666',
  },
  emptyBatches: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default InventoryBranchCard;
