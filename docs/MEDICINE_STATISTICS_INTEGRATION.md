# Medicine Statistics Screen - API Integration

## Tổng quan

Màn hình **Thống kê thuốc** (MedicineManagementScreen) đã được tích hợp với API thống kê theo tài liệu `FRONTEND_STATISTICS_API_GUIDE.md`.

## Các thay đổi

### 1. API Service (`src/features/revenue-report/api/statistics.api.ts`)

Tạo service để gọi các endpoints thống kê:

- `getOverallStats()` - Thống kê tổng quan
- `getMedicineStats()` - Thống kê theo từng thuốc
- `getTopSellingMedicines()` - Top thuốc bán chạy
- `getPeriodStats()` - Thống kê theo khoảng thời gian
- `getBranchStats()` - Thống kê theo chi nhánh
- `getEmployeeStats()` - Thống kê theo nhân viên
- `getDashboardStats()` - Thống kê cho dashboard

### 2. Types (`src/features/revenue-report/types/statistics.types.ts`)

Định nghĩa các types cho request/response của API:

- `OverallStatsResponse` - Response của overall statistics
- `MedicineStatsResponse` - Response của medicine statistics
- `MedicineStatsItem` - Chi tiết từng loại thuốc
- Và nhiều types khác...

### 3. Custom Hooks (`src/features/revenue-report/hooks/useStatistics.ts`)

Tạo các hooks sử dụng React Query để fetch data:

- `useMedicineStats()` - Hook để lấy thống kê thuốc
- `useOverallStats()` - Hook để lấy thống kê tổng quan
- Các hooks tự động handle loading, error, caching

### 4. Màn hình MedicineManagementScreen

#### Dữ liệu hiển thị

**Phần tổng quan (Stats Cards):**

- **Loại thuốc**: Tổng số loại thuốc khác nhau
- **Tổng SL bán**: Tổng số lượng thuốc đã bán (từ `overallStats.totalQuantity`)
- **Hóa đơn**: Tổng số hóa đơn (từ `overallStats.totalInvoices`)
- **Doanh thu**: Tổng doanh thu (từ `overallStats.totalRevenue`)
- **Giảm giá**: Tổng tiền giảm giá (từ `overallStats.totalDiscount`)
- **Thuế**: Tổng thuế (từ `overallStats.totalTax`)

**Danh sách thuốc (Medicine List):**
Mỗi card thuốc hiển thị:

- **Tên thuốc**: `medicineName`
- **Mã**: `_id`
- **Danh mục**: `medicineCategory`
- **Đơn vị**: `medicineUnit`
- **Đơn giá TB**: `averagePrice` (giá trung bình)
- **Đã bán**: `totalQuantity` (tổng số lượng đã bán)
- **Doanh thu**: `totalRevenue` (tổng doanh thu của thuốc này)
- **Số lần bán**: `timesOrdered` (số lần xuất hiện trong hóa đơn)

#### Tính năng

1. **Tìm kiếm**: Tìm theo tên thuốc, mã, hoặc danh mục
2. **Lọc theo danh mục**: Tự động lấy danh mục từ dữ liệu API
3. **Loading state**: Hiển thị indicator khi đang tải dữ liệu
4. **Error handling**: Hiển thị thông báo lỗi nếu không tải được dữ liệu

## Cách sử dụng

### Gọi API với parameters

```typescript
// Trong component
const { data, isLoading, error } = useMedicineStats({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  branchId: 'branch123',
});
```

### Cấu hình API URL

API base URL được cấu hình trong `src/shared/services/api.ts`:

```typescript
const API_URL = 'http://10.0.2.2:8080/api';
```

Đổi URL này để trỏ đến backend server của bạn.

## Dữ liệu API

### Medicine Statistics Response

```json
{
  "success": true,
  "message": "Medicine statistics retrieved successfully",
  "total": 10,
  "data": [
    {
      "_id": "med123",
      "medicineName": "Paracetamol 500mg",
      "medicineUnit": "Viên",
      "medicineCategory": "Thuốc giảm đau",
      "totalQuantity": 1500,
      "totalRevenue": 450000,
      "averagePrice": 300,
      "timesOrdered": 25
    }
  ]
}
```

### Overall Statistics Response

```json
{
  "success": true,
  "message": "Overall statistics retrieved successfully",
  "data": {
    "totalQuantity": 5000,
    "totalRevenue": 15000000,
    "totalInvoices": 150,
    "totalDiscount": 500000,
    "totalTax": 750000
  }
}
```

## Lưu ý

1. **Authentication**: Tất cả API endpoints yêu cầu Bearer token trong header
2. **Permissions**: Cần quyền `branch-manager` hoặc `system-admin`
3. **Caching**: React Query tự động cache dữ liệu, có thể config trong hooks
4. **Error handling**: Nên xử lý các trường hợp lỗi network, auth, permission

## Next Steps

Nếu cần thêm tính năng:

- Thêm filter theo thời gian (date range picker)
- Thêm sắp xếp (sort by revenue, quantity, etc.)
- Thêm pagination cho danh sách dài
- Export dữ liệu sang Excel/PDF
- Biểu đồ thống kê (chart)

## API Documentation

Chi tiết đầy đủ về API có trong file:

- `docs/FRONTEND_STATISTICS_API_GUIDE.md`
