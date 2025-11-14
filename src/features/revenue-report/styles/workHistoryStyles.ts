import { StyleSheet } from 'react-native';

export const workHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#FFF',
    padding: 16,
    margin: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  summaryValueSuccess: {
    color: '#4CAF50',
  },
  summaryValueWarning: {
    color: '#FFA726',
  },
  summaryValueError: {
    color: '#EF5350',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  summaryInfoItem: {
    flex: 1,
  },
  summaryInfoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  summaryInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyDateContainer: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  historyShift: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
  historyBody: {
    gap: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  historyLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  historyValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'right',
  },
  historyHoursValue: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  historyNotesContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  historyNotesLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
  },
});
