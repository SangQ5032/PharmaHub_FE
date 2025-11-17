import { StyleSheet } from 'react-native';

export const branchRevenueStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2196F3',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 12,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  searchButtonText: {
    fontSize: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
  },
  filterButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  filterButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  overviewContainer: {
    backgroundColor: '#E8F5E9',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#2E7D32',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
  },
  branchCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  branchInfo: {
    marginBottom: 12,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 13,
    color: '#666',
  },
  branchStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchRevenue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  branchActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonOutline: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonOutlineText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  previewSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  previewButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  previewButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
