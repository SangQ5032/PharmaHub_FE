# 📱 PharmaHub - Chi Tiết Tính Năng Theo Role

## 🔐 Các Role Hệ Thống

### **1. SYSTEM-ADMIN** (Quản Trị Viên Hệ Thống)
Admin toàn quyền quản lý toàn hệ thống

#### 📊 Tính Năng Chính (9 tuỳ chọn):

1. **Thống Kê Hệ Thống** 
   - Icon: `chart-box-multiple`
   - Route: `SYSTEM_ADMIN_STATISTICS_MENU`
   - Tính năng:
     - Dashboard tổng quát toàn hệ thống
     - Danh sách chi nhánh
     - Doanh thu chi tiết theo chi nhánh
     - Doanh thu nhân viên
     - Top thuốc bán chạy
     - Trạng thái lô hàng toàn hệ thống
     - Doanh thu theo kỳ thống kê

2. **Báo Cáo Doanh Thu**
   - Icon: `chart-line`
   - Route: `BRANCH_REVENUE_REPORT`
   - Tính năng:
     - Xem báo cáo doanh thu chi nhánh
     - Chi tiết doanh thu nhân viên

3. **Quản Lý Thuốc**
   - Icon: `pill`
   - Route: `MEDICINE_MANAGEMENT`
   - Tính năng:
     - Quản lý toàn bộ thuốc trong hệ thống
     - Thêm/Sửa/Xóa thuốc
     - Danh mục thuốc

4. **Quản Lý Chi Nhánh**
   - Icon: `office-building`
   - Route: `BRANCH_LIST`
   - Tính năng:
     - Danh sách chi nhánh
     - Thêm/Sửa chi nhánh
     - Chi tiết chi nhánh
     - Chọn vị trí bằng bản đồ
     - Quản lý thông tin địa chỉ

5. **Quản Lý Lịch Làm Việc**
   - Icon: `calendar-clock`
   - Route: `SYSTEM_ADMIN_WORK_SCHEDULE_MENU`
   - Tính năng:
     - Quản lý lịch làm việc theo chi nhánh
     - Tạo lịch làm việc hàng tuần
     - Xem/Chỉnh sửa lịch

6. **Lịch Sử Làm Việc**
   - Icon: `history`
   - Route: `ADMIN_WORK_HISTORY`
   - Tính năng:
     - Xem lịch sử làm việc toàn hệ thống
     - Lịch sử chi tiết nhân viên
     - Xuất báo cáo lịch làm việc

7. **Quản Lý Lương**
   - Icon: `cash-multiple`
   - Route: `PAYROLL_MENU`
   - Tính năng:
     - Xem danh sách bảng lương
     - Tạo/Chỉnh sửa bảng lương
     - Duyệt bảng lương
     - Tóm tắt lương
     - Chọn chi nhánh để quản lý

8. **Quản Lý Khách Hàng**
   - Icon: `account-multiple`
   - Route: `CUSTOMER_LIST`
   - Tính năng:
     - Danh sách khách hàng toàn hệ thống
     - Chi tiết khách hàng
     - Lịch sử mua hàng

#### 🏠 Tab Chính:
- **Home** - Trang chủ dashboard
- **MedicinesHub** - Hub quản lý thuốc

---

### **2. BRANCH-MANAGER** (Quản Lý Chi Nhánh)
Quản lý hoạt động của một chi nhánh cụ thể

#### 📊 Tính Năng Chính (12 tuỳ chọn):

1. **Danh Sách Thuốc**
   - Icon: `pill`
   - Route: `EMPLOYEE_MEDICINES`
   - Tính năng:
     - Xem danh sách thuốc có trong hệ thống
     - Chi tiết thuốc
     - Tìm kiếm và lọc theo danh mục
     - Xem giá bán và thông tin thuốc

2. **Lịch Làm Việc**
   - Icon: `calendar`
   - Route: `WORK_SCHEDULE_MENU`
   - Tính năng:
     - Danh sách lịch làm việc
     - Tạo lịch làm việc hàng tuần
     - Xem chi tiết lịch làm việc

3. **Lịch Sử Làm Việc**
   - Icon: `history`
   - Route: `BRANCH_WORK_HISTORY`
   - Tính năng:
     - Xem lịch sử làm việc chi nhánh
     - Chi tiết lịch sử nhân viên
     - Xuất báo cáo

4. **Báo Cáo Doanh Thu**
   - Icon: `chart-line`
   - Route: `BRANCH_REVENUE_REPORT`
   - Tính năng:
     - Báo cáo doanh thu chi nhánh
     - Doanh thu nhân viên
     - So sánh doanh thu

5. **Kho Thuốc**
   - Icon: `warehouse`
   - Route: `WAREHOUSE_HUB`
   - Tính năng:
     - Quản lý tồn kho toàn chi nhánh
     - Danh sách tồn kho theo thuốc
     - Chi tiết tồn kho
     - Thông tin lô hàng

6. **Nhập Hàng**
   - Icon: `truck-delivery`
   - Route: `IMPORT_LIST`
   - Tính năng:
     - Danh sách đơn nhập hàng
     - Tạo đơn nhập hàng mới
     - Chi tiết nhập hàng
     - Cập nhật trạng thái nhập
     - Hủy đơn nhập

7. **Lịch Sử Hóa Đơn**
   - Icon: `file-document-outline`
   - Route: `BRANCH_INVOICE_HISTORY`
   - Tính năng:
     - Lịch sử bán hàng chi nhánh
     - Chi tiết hóa đơn
     - Xem tổng doanh thu

8. **Quản Lý Lương**
   - Icon: `cash-multiple`
   - Route: `PAYROLL_MENU`
   - Tính năng:
     - Danh sách bảng lương chi nhánh
     - Tạo bảng lương cho nhân viên
     - Chi tiết tính lương
     - Tóm tắt lương

9. **Thống Kê Chi Nhánh**
   - Icon: `chart-box-multiple`
   - Route: `BRANCH_STATISTICS_HUB`
   - Tính năng:
     - Thống kê doanh thu chi nhánh
     - Thống kê nhân viên
     - Thống kê thuốc bán chạy
     - Thống kê nhập hàng
     - Thống kê trạng thái lô hàng
     - Thống kê khách hàng
     - Doanh thu theo kỳ

10. **Quản Lý Khách Hàng**
   - Icon: `account-multiple`
   - Route: `CUSTOMER_LIST`
   - Tính năng:
     - Danh sách khách hàng chi nhánh
     - Thêm khách hàng mới
     - Chi tiết khách hàng
     - Lịch mua hàng

11. **Thông Tin Nhân Viên**
    - Icon: `account-group`
    - Route: `BRANCH_EMPLOYEE_INFO_MENU`
    - Tính năng:
      - Danh sách nhân viên chi nhánh
      - Chi tiết nhân viên
      - Chọn nhân viên để xem chi tiết

12. **Quản Lý Danh Mục** (có trong tabs)
    - Quản lý danh mục thuốc
    - Thêm/Sửa/Xóa danh mục

#### 🏠 Tab Chính:
- **Home** - Trang chủ dashboard
- (MedicinesHub - ẩn, không hiển thị)

---

### **3. EMPLOYEE** (Nhân Viên Bán Hàng)
Nhân viên bán hàng, làm việc tại chi nhánh

#### 📊 Tính Năng Chính (10 tuỳ chọn):

1. **Lịch Làm Việc Của Tôi**
   - Icon: `calendar-check`
   - Route: `MY_WORK_SCHEDULE`
   - Tính năng:
     - Xem lịch làm việc cá nhân
     - Thông tin ca làm việc
     - Xác nhận ca làm việc

2. **Lịch Sử Làm Việc**
   - Icon: `history`
   - Route: `EMPLOYEE_WORK_HISTORY`
   - Tính năng:
     - Lịch sử làm việc chi tiết
     - Xem từng ca làm việc
     - Số giờ làm việc
     - Thời gian check-in/check-out

3. **Check In / Check Out**
   - Icon: `login`
   - Route: `CHECKIN_CHECKOUT`
   - Tính năng:
     - Check-in vào ca làm việc
     - Check-out kết thúc ca
     - Xem lịch sử check-in/out
     - Vị trí check-in (GPS)

4. **Bán Hàng**
   - Icon: `cash-register`
   - Route: `SALES`
   - Tính năng:
     - Tạo hóa đơn bán hàng
     - Chọn khách hàng
     - Thêm sản phẩm vào hóa đơn
     - Tính toán tổng tiền
     - Thanh toán (tiền mặt/QR)
     - Quét barcode sản phẩm
     - Tạo khách hàng mới

5. **Danh Sách Thuốc**
   - Icon: `pill`
   - Route: `EMPLOYEE_MEDICINES`
   - Tính năng:
     - Xem danh sách thuốc có tồn kho
     - Chi tiết thuốc
     - Tồn kho theo chi nhánh
     - Giá bán

6. **Lịch Sử Hóa Đơn**
   - Icon: `file-document-outline`
   - Route: `INVOICE_LIST`
   - Tính năng:
     - Danh sách hóa đơn đã tạo
     - Chi tiết hóa đơn
     - Tổng doanh thu cá nhân

7. **Lương Của Tôi**
   - Icon: `cash-multiple`
   - Route: `PAYROLL_MENU`
   - Tính năng:
     - Xem bảng lương cá nhân
     - Chi tiết tính lương
     - Lịch sử lương
     - Thành phần lương (cơ bản + hoa hồng)

8. **Thống Kê Doanh Thu**
   - Icon: `chart-box`
   - Route: `EMPLOYEE_STATISTICS`
   - Tính năng:
     - Doanh thu cá nhân
     - Thống kê theo ngày/tháng
     - Top sản phẩm bán
     - Biểu đồ doanh thu

9. **Quản Lý Khách Hàng**
   - Icon: `account-multiple`
   - Route: `CUSTOMER_LIST`
   - Tính năng:
     - Danh sách khách hàng
     - Thêm khách hàng mới
     - Chi tiết khách hàng
     - Lịch mua hàng

10. **Xem Tồn Kho Chi Nhánh**
    - Icon: `package-box-multiple`
    - Route: `BRANCH_INVENTORY_MANAGEMENT`
    - Tính năng:
      - Xem tồn kho toàn chi nhánh
      - Chi tiết từng sản phẩm
      - Thông tin lô hàng
      - Hạn sử dụng

#### 🏠 Tab Chính:
- **Home** - Trang chủ dashboard
- (MedicinesHub - ẩn, không hiển thị)

---

## 📋 Bảng So Sánh Quyền Hạn

| Tính Năng | System Admin | Branch Manager | Employee |
|-----------|:----:|:----:|:----:|
| **Quản Lý Toàn Hệ Thống** | ✅ | ❌ | ❌ |
| **Dashboard Hệ Thống** | ✅ | ❌ | ❌ |
| **Quản Lý Thuốc** | ✅ | ✅ (xem) | ✅ (xem) |
| **Quản Lý Chi Nhánh** | ✅ | ❌ | ❌ |
| **Lịch Làm Việc** | ✅ (tất cả) | ✅ (chi nhánh) | ✅ (cá nhân) |
| **Bảng Lương** | ✅ (tất cả) | ✅ (chi nhánh) | ✅ (cá nhân) |
| **Bán Hàng / Hóa Đơn** | ❌ | ✅ (xem) | ✅ (tạo) |
| **Thống Kê** | ✅ (toàn hệ thống) | ✅ (chi nhánh) | ✅ (cá nhân) |
| **Quản Lý Khách Hàng** | ✅ | ✅ | ✅ |
| **Check In/Out** | ❌ | ❌ | ✅ |

---

## 🔄 Luồng Công Việc Theo Role

### **System Admin**
```
Dashboard Hệ Thống
  ├─ Quản lý chi nhánh
  ├─ Quản lý thuốc
  ├─ Lịch làm việc toàn hệ thống
  ├─ Bảng lương toàn hệ thống
  ├─ Thống kê toàn hệ thống
  └─ Quản lý khách hàng
```

### **Branch Manager**
```
Dashboard Chi Nhánh
  ├─ Quản lý lịch làm việc nhân viên
  ├─ Quản lý tồn kho
  ├─ Quản lý nhập hàng
  ├─ Xem lịch sử bán hàng
  ├─ Quản lý bảng lương
  ├─ Xem thống kê chi nhánh
  └─ Quản lý khách hàng
```

### **Employee**
```
Trang Chủ Nhân Viên
  ├─ Check In/Out
  ├─ Xem lịch làm việc
  ├─ Bán hàng / Tạo hóa đơn
  ├─ Xem danh sách thuốc
  ├─ Xem lương cá nhân
  ├─ Xem thống kê doanh thu
  └─ Quản lý khách hàng
```

---

## 🛡️ Quyền Truy Cập API

### **System Admin** - Toàn quyền
- Tất cả endpoints của hệ thống
- Quản lý dữ liệu toàn bộ chi nhánh
- Quản lý tài khoản người dùng

### **Branch Manager** - Quyền chi nhánh
- Endpoints của chi nhánh mình quản lý
- Không thể xem dữ liệu chi nhánh khác
- Quản lý nhân viên trong chi nhánh

### **Employee** - Quyền cá nhân
- Chỉ xem dữ liệu của chính mình
- Chỉ xem dữ liệu chi nhánh mình làm việc
- Tạo hóa đơn, check-in/out

---

## 📲 Ghi Chú Quan Trọng

1. **Mỗi role có giao diện khác nhau** - Số tab và menu tuỳ theo role
2. **Hệ thống mặc định** - Nếu không xác định role, sẽ mặc định là `employee`
3. **Check nhánh** - Branch Manager và Employee phải có `branchId` để hoạt động
4. **Phân quyền API** - Cần kiểm tra `Authorization` header và `role` trước khi trả dữ liệu
5. **Tab Navigation** - Chỉ hiển thị tab phù hợp với role (Home, MedicinesHub, ReportsHub)

---

---

## 💳 **Chi Tiết Các Chức Năng Chính**

### **1️⃣ Bán Hàng (Sales)**
📁 **Folder:** `src/features/sales/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 🏪 Sales Hub | `SalesHubScreen.tsx` | Menu chính bán hàng |
| 📝 Tạo Hóa Đơn | `CreateInvoiceScreen.tsx` | Tạo hoá đơn bán hàng mới |
| 📷 Quét Barcode | `BarcodeScannerScreen.tsx` | Quét mã vạch sản phẩm |
| 💳 Thanh Toán QR | `PaymentQRScreen.tsx` | Tạo QR code thanh toán |
| 👥 Danh Sách Khách | `CustomerListScreen.tsx` | Xem/quản lý khách hàng |
| 👤 Chi Tiết Khách | `CustomerDetailScreen.tsx` | Thông tin chi tiết khách hàng |
| ➕ Tạo Khách Hàng | `CreateCustomerScreen.tsx` | Thêm khách hàng mới |
| 📋 Danh Sách Hóa Đơn | `InvoiceListScreen.tsx` | Xem tất cả hoá đơn |
| 📄 Chi Tiết Hóa Đơn | `InvoiceDetailScreen.tsx` | Xem chi tiết hoá đơn |
| 🏢 Lịch Sử HĐ (Chi Nhánh) | `BranchInvoiceHistoryScreen.tsx` | Lịch sử bán hàng chi nhánh |
| 👨 Lịch Sử HĐ (Nhân Viên) | `EmployeeInvoiceHistoryScreen.tsx` | Lịch sử bán hàng cá nhân |
| 💊 Chi Tiết Sản Phẩm | `MedicineDetailScreen.tsx` | Chi tiết thuốc trong bán hàng |

#### **Tạo Hóa Đơn (CreateInvoiceScreen.tsx)**
Ghi lại các giao dịch bán hàng

**Dữ liệu:**
- Chọn khách hàng từ danh sách hoặc tạo mới
- Thêm sản phẩm (quét barcode hoặc chọn từ danh sách)
- Chọn lô hàng (batch) cho mỗi sản phẩm
- Nhập số lượng và đơn vị
- Áp dụng chiết khấu (nếu khách hàng đủ điều kiện)
- Chọn phương thức thanh toán (tiền mặt / chuyển khoản QR)

**Các Screen Liên Quan:**
- `BarcodeScannerScreen.tsx` - Quét barcode
- `PaymentQRScreen.tsx` - Thanh toán QR
- `CreateCustomerScreen.tsx` - Tạo khách hàng

**API Endpoints:**
- `POST /invoices` - Tạo hóa đơn
- `POST /sales/scan-barcode` - Quét barcode
- `GET /medicines/with-batches` - Lấy danh sách thuốc với lô hàng
- `GET /customers` - Danh sách khách hàng

**Tính năng đặc biệt:**
- Quét barcode camera hoặc nhập thủ công
- Tính toán chiết khấu theo tổng chi tiêu
- Thanh toán QR với mã VietQR
- Hỗ trợ nhiều đơn vị (box, blister, viên, lọ, etc.)

---

#### **Quản Lý Khách Hàng (CustomerListScreen.tsx)**
Danh sách khách hàng và lịch mua hàng

**Các Screen Liên Quan:**
- `CreateCustomerScreen.tsx` - Thêm/Sửa khách hàng
- `CustomerDetailScreen.tsx` - Xem chi tiết
- `InvoiceListScreen.tsx` - Lịch mua hàng

**Dữ liệu:**
- Tên, SĐT, địa chỉ, email
- Tổng chi tiêu, số hoá đơn
- Ngày tạo/cập nhật

**API Endpoints:**
- `GET /customers` - Danh sách khách hàng
- `GET /customers/:id` - Chi tiết khách hàng
- `POST /customers` - Thêm khách hàng
- `PUT /customers/:id` - Cập nhật khách hàng
- `GET /invoices?customer_id=` - Lịch mua hàng

---

#### **Lịch Sử Hóa Đơn (InvoiceListScreen.tsx)**
Danh sách tất cả các hóa đơn

**Các Screen Liên Quan:**
- `InvoiceDetailScreen.tsx` - Xem chi tiết
- `BranchInvoiceHistoryScreen.tsx` - Lịch sử theo chi nhánh
- `EmployeeInvoiceHistoryScreen.tsx` - Lịch sử theo nhân viên

**Dữ liệu:**
- Mã hóa đơn, ngày tạo, khách hàng
- Tổng tiền, phương thức thanh toán
- Trạng thái (pending/completed/cancelled)

**API Endpoints:**
- `GET /invoices/branch` - Hóa đơn theo chi nhánh
- `GET /invoices/me` - Hóa đơn của tôi (employee)
- `GET /invoices/:id` - Chi tiết hóa đơn
- Hỗ trợ phân trang

---

### **2️⃣ Quản Lý Kho (Warehouse)**
📁 **Folder:** `src/features/warehouse/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 🏭 Warehouse Hub | `WarehouseHubScreen.tsx` | Menu chính kho hàng |
| 📥 Danh Sách Nhập | `ImportListScreen.tsx` | Danh sách phiếu nhập |
| ➕ Tạo Nhập Hàng | `CreateImportScreen.tsx` | Tạo phiếu nhập hàng mới |
| 📋 Chi Tiết Nhập | `ImportDetailScreen.tsx` | Xem chi tiết phiếu nhập |
| 📦 Danh Sách Tồn Kho | `InventoryListScreen.tsx` | Danh sách lô hàng |
| 🏷️ Chi Tiết Tồn Kho | `InventoryDetailScreen.tsx` | Chi tiết tồn kho 1 thuốc |
| 📊 Tồn Kho (Lô) | `InventoryDetailWithBatchesScreen.tsx` | Tồn kho theo lô |
| 📈 Tồn Kho (Mở Rộng) | `InventoryDetailExpandedScreen.tsx` | Chi tiết tồn kho mở rộng |
| 🔹 Chi Tiết Lô | `BatchDetailScreen.tsx` | Chi tiết 1 lô hàng |
| 🔹 Chi Tiết Lô (Mở Rộng) | `BatchDetailExpandedScreen.tsx` | Chi tiết lô hàng mở rộng |
| 🏢 Quản Lý Tồn Chi Nhánh | `BranchInventoryManagementScreen.tsx` | Quản lý tồn kho chi nhánh |
| 📄 Chọn Báo Cáo | `ReportSelectionScreen.tsx` | Chọn loại báo cáo |
| 📊 Xem Báo Cáo | `ReportViewScreen.tsx` | Xem & xuất báo cáo |

#### **Nhập Hàng (CreateImportScreen.tsx)**
Quản lý đơn nhập hàng từ nhà cung cấp

**Các Screen Liên Quan:**
- `ImportListScreen.tsx` - Danh sách nhập hàng
- `ImportDetailScreen.tsx` - Chi tiết phiếu nhập

**Dữ liệu:**
- Chọn nhà cung cấp
- Thêm thuốc: số lượng, đơn vị, giá nhập
- Mã lô hàng (tự sinh hoặc nhập thủ công)
- Hạn sử dụng
- Ghi chú

**Tính năng:**
- Tự sinh mã lô hàng dựa trên tên thuốc + chi nhánh + thời gian
- Validate hạn sử dụng không được trong quá khứ
- Tính tổng chi phí tự động
- Hỗ trợ nhiều đơn vị

---

#### **Tồn Kho (InventoryListScreen.tsx)**
Xem lô hàng và tồn kho

**Các Screen Liên Quan:**
- `InventoryDetailScreen.tsx` - Chi tiết tồn kho
- `InventoryDetailWithBatchesScreen.tsx` - Tồn kho theo lô
- `InventoryDetailExpandedScreen.tsx` - Mở rộng
- `BatchDetailScreen.tsx` - Chi tiết lô hàng
- `BranchInventoryManagementScreen.tsx` - Quản lý chi nhánh

**Dữ liệu:**
- Danh sách lô hàng (batch)
📁 **Folder:** `src/features/work-schdule/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 📅 Menu Lịch Làm Việc | `WorkScheduleMenuScreen.tsx` | Menu chính lịch làm việc |
| 📋 Danh Sách Lịch | `WorkScheduleListScreen.tsx` | Danh sách lịch làm việc |
| ➕ Tạo Lịch Tuần | `CreateWeekScheduleScreen.tsx` | Tạo lịch hàng tuần |
| 👨 Lịch Của Tôi | `MyWorkScheduleScreen.tsx` | Lịch làm việc cá nhân |
| 📜 Lịch Sử Làm Việc | `EmployeeWorkHistoryScreen.tsx` | Lịch sử check-in/out |
| 📄 Chi Tiết Lịch Sử | `EmployeeWorkHistoryDetailScreen.tsx` | Chi tiết lịch sử + hoá đơn |
| 🏢 Lịch Sử (Chi Nhánh) | `BranchWorkHistoryScreen.tsx` | Lịch sử chi nhánh |
| 🔐 Lịch Sử (Toàn Hệ Thống) | `AdminWorkHistoryScreen.tsx` | Lịch sử tất cả (admin) |
| ⚙️ Menu Lịch (Admin) | `SystemAdminWorkScheduleMenuScreen.tsx` | Menu admin quản lý lịch |
| 🏢 Chọn Chi Nhánh (Lịch) | `WorkScheduleBranchSelectionScreen.tsx` | Chọn chi nhánh |
| 📅 Lịch Admin (Chi Nhánh) | `SystemAdminBranchWorkScheduleScreen.tsx` | Quản lý lịch chi nhánh (admin) |
| 📜 Lịch Sử Admin (Chi Nhánh) | `SystemAdminBranchWorkHistoryScreen.tsx` | Lịch sử chi nhánh (admin) |

#### **Lịch Làm Việc Hàng Tuần (CreateWeekScheduleScreen.tsx)**
Tạo lịch làm việc cho nhân viên

**Các Screen Liên Quan:**
- `WorkScheduleMenuScreen.tsx` - Menu lịch
- `WorkScheduleListScreen.tsx` - Danh sách lịch

**Dữ liệu:**
- Chọn nhân viên
- Chọn tuần
- Xác định ca sáng/chiều cho mỗi ngày
- Ghi chú

**API Endpoints:**
- `POST /work-schedules` - Tạo lịch
- `PUT /work-schedules/:id` - Cập nhật lịch

---

#### **Lịch Sử Làm Việc (EmployeeWorkHistoryScreen.tsx)**
Xem lịch sử check-in/check-out thực tế

**Các Screen Liên Quan:**
- `EmployeeWorkHistoryDetailScreen.tsx` - Chi tiết lịch sử
- `BranchWorkHistoryScreen.tsx` - Lịch sử chi nhánh
- `AdminWorkHistoryScreen.tsx` - Lịch sử toàn hệ thống
- `SystemAdminBranchWorkHistoryScreen.tsx` - Lịch sử admin

**Dữ liệu:**
- Ngày làm việc, ca làm việc
- Giờ check-in/check-out thực tế
- Số giờ làm việc tính toán
- Trạng thái (checked_in, checked_out, late, early, absent)
- So sánh với lịch theo quy định

**API Endpoints:**
- `GET /work-schedules/history/me` - Lịch sử của tôi
- `GET /work-schedules/history/branch-employees` - Lịch sử chi nhánh
- `GET /work-schedules/history/all` - Tất cả (admin)
- `GET /work-schedules/history/:attendanceId` - Chi tiết + hoá đơn

**Tính năng đặc biệt:**
- Xem chi tiết lịch sử kèm danh sách hoá đơn tạo trong ca
- Thống kê doanh thu trong ca làm việc
📁 **Folder:** `src/features/payroll/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 📊 Menu Bảng Lương | `PayrollMenuScreen.tsx` | Menu chính bảng lương |
| 📋 Danh Sách Lương | `PayrollListScreen.tsx` | Danh sách bảng lương |
| ➕ Tạo Bảng Lương | `CreatePayrollScreen.tsx` | Tạo bảng lương mới |
| 📄 Chi Tiết Lương | `PayrollDetailsScreen.tsx` | Chi tiết bảng lương |
| 📈 Tóm Tắt Lương | `PayrollSummaryScreen.tsx` | Tóm tắt thống kê lương |
| 🏢 Danh Sách Lương (Chi Nhánh) | `BranchPayrollListScreen.tsx` | Bảng lương chi nhánh |
| 🏢 Chọn Chi Nhánh (Lương) | `PayrollBranchSelectionScreen.tsx` | Chọn chi nhánh |

#### **Tính Lương (CreatePayrollScreen.tsx)**
Tạo và quản lý bảng lương

**Các Screen Liên Quan:**
- `PayrollMenuScreen.tsx` - Menu bảng lương
- `PayrollListScreen.tsx` - Danh sách lương
- `PayrollDetailsScreen.tsx` - Chi tiết lương
- `BranchPayrollListScreen.tsx` - Lương chi nhánh

#### **Check In / Check Out (CheckinCheckoutScreen.tsx)**
Chấm công hàng ngày

📁 **Folder:** `src/features/checkin-checkout/screens/`
**API Endpoints:**
- `POST /work-schedules` - Tạo lịch
- `PUT /work-schedules/:id` - Cập nhật lịch

---

#### **Lịch Sử Làm Việc (EmployeeWorkHistoryScreen)**
Xem lịch sử check-in/check-out thực tế

**Dữ liệu:**
📁 **Folder:** `src/features/statistics/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 📊 Thống Kê Chính | `StatisticsScreen.tsx` | Thống kê chính |
| 📊 Hub Thống Kê Chi Nhánh | `BranchStatisticsHubScreen.tsx` | Menu thống kê chi nhánh |
| 💰 Doanh Thu | `RevenueStatsScreen.tsx` | Thống kê doanh thu |
| 👥 Nhân Viên | `EmployeesStatsScreen.tsx` | Thống kê nhân viên |
| 💊 Thuốc | `MedicinesStatsScreen.tsx` | Thống kê sản phẩm |
| 📥 Nhập Hàng | `ImportsStatsScreen.tsx` | Thống kê nhập hàng |
| 📦 Trạng Thái Lô | `BatchStatusStatsScreen.tsx` | Thống kê lô hàng |
| 👥 Khách Hàng | `CustomersStatsScreen.tsx` | Thống kê khách hàng |
| 📈 Doanh Thu Theo Kỳ | `RevenueByPeriodStatsScreen.tsx` | Doanh thu theo kỳ |
| ⚙️ Menu Admin | `SystemAdminStatisticsMenuScreen.tsx` | Menu thống kê admin |
| 🏢 Danh Sách Chi Nhánh (Admin) | `SystemAdminBranchListScreen.tsx` | Danh sách chi nhánh |
| 🏢 Dashboard Admin | `SystemAdminDashboardScreen.tsx` | Dashboard chính admin |
| 💰 Doanh Thu Chi Nhánh (Admin) | `SystemAdminBranchRevenueScreen.tsx` | Doanh thu chi nhánh |
| 💰 Chi Tiết Doanh Thu (Admin) | `SystemAdminBranchRevenueDetailScreen.tsx` | Chi tiết doanh thu |
| 💰 Chi Tiết Doanh Thu Mở Rộng | `SystemAdminBranchRevenueDetailedScreen.tsx` | Chi tiết mở rộng |
| 👥 Doanh Thu Nhân Viên (Admin) | `SystemAdminEmployeeRevenueScreen.tsx` | Doanh thu nhân viên |
| 💊 Top Thuốc Bán Chạy (Admin) | `SystemAdminTopMedicinesScreen.tsx` | Top 10 thuốc |
| 📦 Trạng Thái Lô (Admin) | `SystemAdminBatchStatusScreen.tsx` | Trạng thái lô hàng |

#### **Doanh Thu (RevenueStatsScreen.tsx)**
Thống kê doanh thu

**Các Screen Liên Quan:**
- `BranchStatisticsHubScreen.tsx` - Hub chi nhánh
- `RevenueByPeriodStatsScreen.tsx` - Doanh thu theo kỳ
- `SystemAdminBranchRevenueScreen.tsx` - Doanh thu chi nhánh (admin)

**Dữ liệu:**
- Tổng doanh thu (hôm nay/tháng/tuỳ chọn)
- Số hoá đơn
- Tỷ lệ thanh toán
- Biểu đồ doanh thu theo ngày

**API Endpoints:**
- `GET /statistics/branch/revenue` - Doanh thu chi nhánh
- `GET /statistics/employee/revenue` - Doanh thu nhân viên
- `GET /statistics/admin/branch-revenue` - Doanh thu tất cả chi nhánh (admin)

---

#### **Nhân Viên (EmployeesStatsScreen.tsx)**
Thống kê nhân viên

**Các Screen Liên Quan:**
- `SystemAdminEmployeeRevenueScreen.tsx` - Doanh thu nhân viên (admin)

**Dữ liệu:**
- Số nhQuản Lý Nhân Viên**
📁 **Folder:** `src/features/employee-management/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 📋 Danh Sách Nhân Viên | `EmployeeManagementScreen.tsx` | Danh sách nhân viên |
| ➕ Tạo Nhân Viên | `CreateEmployeeScreen.tsx` | Thêm nhân viên mới |
| 🏢 Danh Sách Nhân Viên (Chi Nhánh) | `BranchEmployeeListScreen.tsx` | Nhân viên chi nhánh |

**Tạo Nhân Viên (CreateEmployeeScreen.tsx)**

**Thông tin:**
- Tên, SĐT, email
- Tên đăng nhập, mật khẩu
- Role (employee, branch-manager)
- Chi nhánh
- Mức lương cơ bản

---

#### **Quản Lý Chi Nhánh**
📁 **Folder:** `src/features/branches/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 📋 Danh Sách Chi Nhánh | `BranchListScreen.tsx` | Danh sách chi nhánh |
| ➕ Thêm/Sửa Chi Nhánh | `BranchFormScreen.tsx` | Tạo/chỉnh sửa chi nhánh |
| 📍 Chọn Vị Trí (Bản Đồ) | `MapPickerScreen.tsx` | Chọn vị trí trên bản đồ |
| 📄 Chi Tiết Chi Nhánh | `BranchDetailScreen.tsx` | Chi tiết chi nhánh |
| 👥 Menu Thông Tin Nhân Viên | `BranchEmployeeInfoMenuScreen.tsx` | Menu thông tin nhân viên |
| 👥 Chọn Nhân Viên | `BranchEmployeeSelectionScreen.tsx` | Chọn nhân viên |

**Quản Lý Chi Nhánh (BranchListScreen.tsx)**

**Thông tin:**
- Tên chi nhánh, địa chỉ
- Số điện thoại, email
- Tọa độ GPS (bản đồ)
- Nhân viên quản lý

**Các Screen Liên Quan:**
- `BranchFormScreen.tsx` - Thêm/Sửa chi nhánh
- `MapPickerScreen.tsx` - Chọn bản đồ
- `BranchDetailScreen.tsx` - Chi tiết
- `BranchEmployeeInfoMenuScreen.tsx` - Danh sách nhân viên

**Tính năng:**
- Thêm/Sửa chi nhánh
- Chọn vị trí trên bản đồ
- Xem danh sách nhân viên

---

### **7️⃣ Danh Mục & Nhà Cung Cấp**

#### **Danh Mục Thuốc**
📁 **Folder:** `src/features/categories/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 📋 Danh Sách Danh Mục | `CategoriesScreen.tsx` | Danh sách danh mục |
| ➕ Thêm/Sửa Danh Mục | `AddCategoryScreen.tsx` | Tạo/chỉnh sửa danh mục |
| 📄 Chi Tiết Danh Mục | `CategoryDetailScreen.tsx` | Chi tiết danh mục |

**Danh Mục Thuốc (CategoriesScreen.tsx)**

**Thông tin:**
- Tên danh mục, mô tả
- Số thuốc trong danh mục

---

#### **Nhà Cung Cấp**
📁 **Folder:** `src/features/suppliers/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 📋 Danh Sách Nhà Cung Cấp | `SuppliersScreen.tsx` | Danh sách nhà cung cấp |
| ➕ Thêm Nhà Cung Cấp | `AddSupplierScreen.tsx` | Thêm nhà cung cấp |

**Nhà Cung Cấp (SuppliersScreen.tsx)**

**Thông tin:**
- Tên, SĐT, email
- Địa chỉ, người liên hệ
- Trạng thái (active/inactive)

---

### **8️⃣ Quản Lý Thuốc**
📁 **Folder:** `src/features/medicines/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 🏪 Hub Thuốc | `MedicinesHubScreen.tsx` | Menu chính thuốc |
| 📋 Danh Sách Thuốc | `MedicineListScreen.tsx` | Danh sách toàn bộ thuốc |
| ➕ Thêm/Sửa Thuốc | `AddMedicineScreen.tsx` | Tạo/chỉnh sửa thuốc |
| 📄 Chi Tiết Thuốc | `MedicineDetailScreen.tsx` | Chi tiết thuốc |
| 👨 Danh Sách Thuốc (Nhân Viên) | `EmployeeMedicineListScreen.tsx` | Thuốc có tồn kho |

---

### **9️⃣ Báo Cáo Doanh Thu**
📁 **Folder:** `src/features/revenue-report/screens/`

| Màn Hình | File | Mô Tả |
|---------|------|-------|
| 📊 Báo Cáo Chi Nhánh | `BranchRevenueReportScreen.tsx` | Báo cáo chi nhánh |
| 👥 Doanh Thu Nhân Viên | `EmployeeRevenueScreen.tsx` | Doanh thu cá nhân |
| 💊 Quản Lý Thuốc | `MedicineManagementScreen.tsx` | Quản lý thuốc |

**API Endpoints:**
- `GET /payrolls/preview` - Tính toán xem trước
- `POST /payrolls` - Tạo bảng lương
- `PUT /payrolls/:id` - Cập nhật
- `PATCH /payrolls/:id/approve` - Duyệt
- `PATCH /payrolls/:id/reject` - Từ chối

**Trạng thái:**
- Pending (chưa duyệt)
- Approved (đã duyệt)
- Rejected (từ chối)

---

### **5️⃣ Thống Kê & Báo Cáo (Statistics)**

#### **Doanh Thu (RevenueStatsScreen)**
Thống kê doanh thu

**Dữ liệu:**
- Tổng doanh thu (hôm nay/tháng/tuỳ chọn)
- Số hoá đơn
- Tỷ lệ thanh toán
- Biểu đồ doanh thu theo ngày

**API Endpoints:**
- `GET /statistics/branch/revenue` - Doanh thu chi nhánh
- `GET /statistics/employee/revenue` - Doanh thu nhân viên
- `GET /statistics/admin/branch-revenue` - Doanh thu tất cả chi nhánh (admin)

---

#### **Nhân Viên (EmployeesStatsScreen)**
Thống kê nhân viên

**Dữ liệu:**
- Số nhân viên, nhân viên hoạt động
- Xếp hạng theo doanh thu
- Hoa hồng trung bình

---

#### **Thuốc (MedicinesStatsScreen)**
Thống kê sản phẩm

**Dữ liệu:**
- Thuốc bán chạy nhất
- Số lượng bán
- Doanh số
- Biểu đồ top 10

---

#### **Nhập Hàng (ImportsStatsScreen)**
Thống kê nhập hàng

**Dữ liệu:**
- Tổng đơn nhập
- Tổng chi phí
- Chi phí trung bình
- Nhà cung cấp hàng đầu

---

### **6️⃣ Quản Lý Nhân Viên & Chi Nhánh**

#### **Tạo Nhân Viên (CreateEmployeeScreen)**
Thêm nhân viên mới

**Thông tin:**
- Tên, SĐT, email
- Tên đăng nhập, mật khẩu
- Role (employee, branch-manager)
- Chi nhánh
- Mức lương cơ bản

---

#### **Quản Lý Chi Nhánh (BranchListScreen)**
Danh sách chi nhánh

**Thông tin:**
- Tên chi nhánh, địa chỉ
- Số điện thoại, email
- Tọa độ GPS (bản đồ)
- Nhân viên quản lý

**Tính năng:**
- Thêm/Sửa chi nhánh
- Chọn vị trí trên bản đồ
- Xem danh sách nhân viên

---

### **7️⃣ Danh Mục & Nhà Cung Cấp**

#### **Danh Mục Thuốc (CategoriesScreen)**
Quản lý phân loại

**Thông tin:**
- Tên danh mục, mô tả
- Số thuốc trong danh mục

---

#### **Nhà Cung Cấp (SuppliersScreen)**
Quản lý nhà cung cấp

**Thông tin:**
- Tên, SĐT, email
- Địa chỉ, người liên hệ
- Trạng thái (active/inactive)

---

## 📊 **Dữ Liệu Chính Trong Hệ Thống**

### **Bảng Chính:**
1. **Users** - Nhân viên, quản lý, admin
2. **Branches** - Chi nhánh
3. **Medicines** - Danh sách thuốc
4. **Batches** - Lô hàng (số lượng, hạn sử dụng)
5. **Invoices** - Hoá đơn bán hàng
6. **Imports** - Phiếu nhập hàng
7. **Customers** - Khách hàng
8. **Attendance** - Lịch sử check-in/out
9. **WorkSchedules** - Lịch làm việc quy định
10. **Payrolls** - Bảng lương

---

## 🔗 Files Liên Quan

- Role Config: [src/shared/config/roleConfig.ts](src/shared/config/roleConfig.ts)
- Navigation: [src/app/navigation/AppNavigator.tsx](src/app/navigation/AppNavigator.tsx)
- Auth Types: [src/features/auth/types/types.ts](src/features/auth/types/types.ts)
- Routes: [src/shared/constants/routes.ts](src/shared/constants/routes.ts)

### **Feature Modules:**
- Sales: [src/features/sales/](src/features/sales/)
- Warehouse: [src/features/warehouse/](src/features/warehouse/)
- Work Schedule: [src/features/work-schdule/](src/features/work-schdule/)
- Payroll: [src/features/payroll/](src/features/payroll/)
- Statistics: [src/features/statistics/](src/features/statistics/)
