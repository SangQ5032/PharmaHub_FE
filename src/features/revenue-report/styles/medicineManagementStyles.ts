import { StyleSheet } from 'react-native';

export const medicineManagementStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    backgroundColor: '#FFF',
    margin: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
  },
  statCardInStock: {
    borderLeftColor: '#4CAF50',
  },
  statCardLowStock: {
    borderLeftColor: '#FFA726',
  },
  statCardOutOfStock: {
    borderLeftColor: '#EF5350',
  },
  statCardExpired: {
    borderLeftColor: '#9E9E9E',
  },
  statCardTotal: {
    borderLeftColor: '#2196F3',
  },
  statCardValue: {
    borderLeftColor: '#9C27B0',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterContainer: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterChipSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  filterChipText: {
    fontSize: 14,
    color: '#666',
  },
  filterChipTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sortButtonText: {
    fontSize: 13,
    color: '#666',
    marginRight: 4,
  },
  medicineCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  medicineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  medicineInfo: {
    flex: 1,
    marginRight: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  medicineSku: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  medicineCategory: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeInStock: {
    backgroundColor: '#4CAF50',
  },
  statusBadgeLowStock: {
    backgroundColor: '#FFA726',
  },
  statusBadgeOutOfStock: {
    backgroundColor: '#EF5350',
  },
  statusBadgeExpired: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  medicineBody: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  medicineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicineLabel: {
    fontSize: 14,
    color: '#666',
  },
  medicineValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  medicineDescriptionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  medicinePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  medicineStock: {
    fontSize: 14,
    fontWeight: '600',
  },
  stockInStock: {
    color: '#4CAF50',
  },
  stockLowStock: {
    color: '#FFA726',
  },
  stockOutOfStock: {
    color: '#EF5350',
  },
  medicineFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: '#2E7D32',
  },
  actionButtonSecondary: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonTextPrimary: {
    color: '#FFF',
  },
  actionButtonTextSecondary: {
    color: '#2E7D32',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
  categoryScroll: {
    marginBottom: 8,
  },
});
