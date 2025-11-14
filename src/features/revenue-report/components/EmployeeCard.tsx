import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBadge } from './StatusBadge';
import { getInitials } from '../utils';

interface EmployeeCardProps {
  name: string;
  role: string;
  phone: string;
  status: string;
  statusText: string;
  statusColor: string;
  onPress?: () => void; // Khi bấm vào card để xem doanh thu
  onEditPress?: () => void; // Khi bấm vào nút chỉnh sửa
  showEditButton?: boolean;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  name,
  role,
  phone,
  statusText,
  statusColor,
  onPress,
  onEditPress,
  showEditButton = true,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(name)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>
          {role} • {phone}
        </Text>
      </View>
      <View style={styles.actions}>
        <StatusBadge
          text={statusText}
          backgroundColor={statusColor + '20'}
          textColor={statusColor}
        />
        {showEditButton && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={e => {
              e.stopPropagation(); // Prevent card press
              onEditPress?.();
            }}
          >
            <Text style={styles.editButtonText}>✏️ Sửa</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    alignItems: 'flex-end',
  },
  editButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#2196F3',
  },
  editButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginLeft: 8,
  },
  actionButtonPrimary: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  actionButtonPrimaryText: {
    color: '#FFF',
  },
});
