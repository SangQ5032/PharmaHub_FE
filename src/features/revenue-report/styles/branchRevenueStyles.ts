import { StyleSheet } from 'react-native';

export const branchRevenueStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
  },

  // Stats Overview
  statsWrapper: {
    padding: 16,
  },
  statCardPrimary: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  statCardLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 8,
    fontWeight: '500',
  },
  statCardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 12,
  },
  statCardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statCardBadgeText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardSecondary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statCardSecondaryLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 6,
  },
  statCardSecondaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#424242',
  },

  // Search Section
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // Filter Section
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  dateInfo: {
    flex: 1,
  },
  dateInfoLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 2,
  },
  dateInfoValue: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '500',
  },
  filterButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // List Header
  listHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 12,
    color: '#9E9E9E',
  },

  // Sort Section
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortLabel: {
    fontSize: 13,
    color: '#757575',
    marginRight: 12,
    fontWeight: '500',
  },
  sortScrollView: {
    flex: 1,
  },
  sortChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortChipActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  sortChipText: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
  },
  sortChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Branch List
  branchListContainer: {
    paddingHorizontal: 16,
  },
  branchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  branchHeader: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  branchIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  branchIcon: {
    fontSize: 24,
  },
  branchHeaderInfo: {
    flex: 1,
  },
  branchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    flex: 1,
  },
  rankBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  rankBadgeText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '700',
  },
  branchAddress: {
    fontSize: 13,
    color: '#757575',
    lineHeight: 18,
  },

  // Revenue Section
  revenueSection: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
    fontWeight: '500',
  },
  revenueValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1B5E20',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 2,
  },
  statItemLabel: {
    fontSize: 11,
    color: '#9E9E9E',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },

  // Actions
  branchActions: {
    flexDirection: 'row',
    padding: 12,
    paddingTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  actionButtonSecondaryText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },

  // Loading & Error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // Empty state
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#9E9E9E',
    textAlign: 'center',
  },

  // Bottom Spacing
  bottomSpacing: {
    height: 24,
  },

  // Legacy (for compatibility)
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
  overviewContainer: {
    backgroundColor: '#E8F5E9',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  sortText: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  branchInfo: {
    marginBottom: 12,
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
  branchStatsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 16,
  },
  branchStatLabel: {
    fontSize: 12,
    color: '#666',
  },
});
