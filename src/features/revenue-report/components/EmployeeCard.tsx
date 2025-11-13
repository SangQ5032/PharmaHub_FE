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
  onDetailPress?: () => void;
  onActionPress?: () => void;
  actionButtonText?: string;
  showActionButton?: boolean;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  name,
  role,
  phone,
  statusText,
  statusColor,
  onDetailPress,
  onActionPress,
  actionButtonText = 'Mở',
  showActionButton = false,
}) => {
  return (
    <View style={styles.card}>
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
        <View style={styles.actionButtons}>
          {onDetailPress && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onDetailPress}
            >
              <Text style={styles.actionButtonText}>Chi tiết</Text>
            </TouchableOpacity>
          )}
          {showActionButton && onActionPress && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={onActionPress}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  styles.actionButtonPrimaryText,
                ]}
              >
                {actionButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
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
