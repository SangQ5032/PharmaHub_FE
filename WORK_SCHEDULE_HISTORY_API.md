# Work Schedule History API Documentation

Tài liệu chi tiết về các API lấy lịch sử làm việc thực tế (Attendance) trong hệ thống PharmaHub Backend.

**Base URL:** `http://localhost:5000/api`

**Lưu ý:** Các API này lấy dữ liệu từ bảng **attendance** (bản ghi check-in/check-out thực tế) và so sánh với bảng **work_schedules** để kiểm tra xem nhân viên có đúng lịch không.

---

## Table of Contents

1. [Employee - Lấy lịch sử làm việc của chính mình](#1-employee---lấy-lịch-sử-làm-việc-của-chính-mình)
2. [Branch Manager - Lấy lịch sử làm việc các nhân viên trong chi nhánh](#2-branch-manager---lấy-lịch-sử-làm-việc-các-nhân-viên-trong-chi-nhánh)
3. [System Admin - Lấy lịch sử làm việc tất cả các chi nhánh](#3-system-admin---lấy-lịch-sử-làm-việc-tất-cả-các-chi-nhánh)

---

## 1. Employee - Lấy lịch sử làm việc của chính mình

Nhân viên (role: `employee`) lấy lịch sử làm việc thực tế (attendance records) của chính mình kèm theo thông tin lịch được giao.

**Endpoint:** `GET /api/work-schedules/history/me`

**Authentication:** Required (Bearer Token)

**Authorization:** `employee`

**Query Parameters:**
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số bản ghi trên trang (default: 10, max: 100)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Retrieved attendance history for current employee with schedule comparison",
  "data": [
    {
      "_id": "attendance_id",
      "user_id": {
        "_id": "user_id",
        "username": "employee01",
        "name": "Nguyễn Văn A",
        "role": "employee",
        "contact": {
          "phone": "0123456789",
          "email": "email@example.com"
        }
      },
      "branch_id": {
        "_id": "branch_id",
        "name": "Chi nhánh Hà Nội",
        "address": "123 Đường Láng, Hà Nội",
        "phone": "024-1234-5678"
      },
      "checkin_time": "2025-01-15T08:30:00",
      "checkout_time": "2025-01-15T17:30:00",
      "working_hours": 9,
      "status": "checked_out",
      "date": "2025-01-15",
      "shift": "morning",
      "scheduledShift": {
        "_id": "schedule_id",
        "date": "2025-01-15",
        "shift": "morning"
      },
      "isOnSchedule": true,
      "createdAt": "2025-01-15T08:30:00.000Z",
      "updatedAt": "2025-01-15T17:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Response Fields Explanation:**
- `checkin_time`: Thời gian check-in thực tế (ISO format)
- `checkout_time`: Thời gian check-out thực tế (null nếu chưa checkout)
- `working_hours`: Số giờ làm việc tính toán
- `status`: Trạng thái attendance (checked_in, checked_out, late, early, absent)
- `date`: Ngày làm việc (extracted từ checkin_time)
- `shift`: Ca làm việc xác định từ giờ check-in (morning < 12:00, afternoon >= 12:00)
- `scheduledShift`: Thông tin lịch được giao (null nếu không có lịch)
- `isOnSchedule`: Boolean - true nếu nhân viên có lịch vào ngày/ca đó

**CURL Example:**
```bash
# Lấy trang 1 với 10 bản ghi
curl -X GET "http://localhost:5000/api/work-schedules/history/me?page=1&limit=10" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lấy trang 2 với 20 bản ghi
curl -X GET "http://localhost:5000/api/work-schedules/history/me?page=2&limit=20" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"
```

---

## 2. Branch Manager - Lấy lịch sử làm việc các nhân viên trong chi nhánh

Quản lý chi nhánh (role: `branch-manager`) lấy lịch sử làm việc thực tế của tất cả nhân viên trong chi nhánh của mình kèm theo thông tin lịch được giao.

**Endpoint:** `GET /api/work-schedules/history/branch-employees`

**Authentication:** Required (Bearer Token)

**Authorization:** `branch-manager`

**Query Parameters:**
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số bản ghi trên trang (default: 10, max: 100)
- `from_date` (optional): Từ ngày (format: YYYY-MM-DD)
- `to_date` (optional): Đến ngày (format: YYYY-MM-DD)
- `user_id` (optional): Lọc theo user_id
- `status` (optional): Lọc theo status (checked_in, checked_out, late, early, absent)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Retrieved attendance history for branch employees with schedule comparison",
  "data": [
    {
      "_id": "attendance_id",
      "user_id": {
        "_id": "user_id",
        "username": "employee01",
        "name": "Nguyễn Văn A",
        "role": "employee",
        "contact": {
          "phone": "0123456789",
          "email": "email@example.com"
        }
      },
      "branch_id": {
        "_id": "branch_id",
        "name": "Chi nhánh Hà Nội",
        "address": "123 Đường Láng, Hà Nội",
        "phone": "024-1234-5678"
      },
      "checkin_time": "2025-01-15T08:30:00",
      "checkout_time": "2025-01-15T17:30:00",
      "working_hours": 9,
      "status": "checked_out",
      "date": "2025-01-15",
      "shift": "morning",
      "scheduledShift": {
        "_id": "schedule_id",
        "date": "2025-01-15",
        "shift": "morning"
      },
      "isOnSchedule": true,
      "createdAt": "2025-01-15T08:30:00.000Z",
      "updatedAt": "2025-01-15T17:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 127,
    "page": 1,
    "limit": 10,
    "totalPages": 13
  }
}
```

**CURL Examples:**

```bash
# Lấy tất cả lịch sử làm việc của chi nhánh (trang 1)
curl -X GET "http://localhost:5000/api/work-schedules/history/branch-employees?page=1&limit=10" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lấy lịch sử làm việc trong khoảng ngày
curl -X GET "http://localhost:5000/api/work-schedules/history/branch-employees?page=1&limit=10&from_date=2025-01-01&to_date=2025-01-31" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lọc lịch sử của một nhân viên cụ thể
curl -X GET "http://localhost:5000/api/work-schedules/history/branch-employees?page=1&limit=10&user_id=507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lọc chỉ những bản ghi đã checkout
curl -X GET "http://localhost:5000/api/work-schedules/history/branch-employees?page=1&limit=10&status=checked_out" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lọc những bản ghi late (đi trễ)
curl -X GET "http://localhost:5000/api/work-schedules/history/branch-employees?page=1&limit=10&status=late" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Kết hợp nhiều filter
curl -X GET "http://localhost:5000/api/work-schedules/history/branch-employees?page=1&limit=10&from_date=2025-01-01&to_date=2025-01-31&status=absent" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"
```

---

## 3. System Admin - Lấy lịch sử làm việc tất cả các chi nhánh

Quản trị viên hệ thống (role: `system-admin`) lấy lịch sử làm việc thực tế của tất cả nhân viên từ tất cả chi nhánh kèm theo thông tin lịch được giao.

**Endpoint:** `GET /api/work-schedules/history/all`

**Authentication:** Required (Bearer Token)

**Authorization:** `system-admin`

**Query Parameters:**
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số bản ghi trên trang (default: 10, max: 100)
- `from_date` (optional): Từ ngày (format: YYYY-MM-DD)
- `to_date` (optional): Đến ngày (format: YYYY-MM-DD)
- `branch_id` (optional): Lọc theo chi nhánh
- `user_id` (optional): Lọc theo user_id
- `status` (optional): Lọc theo status (checked_in, checked_out, late, early, absent)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Retrieved all attendance history with schedule comparison",
  "data": [
    {
      "_id": "attendance_id",
      "user_id": {
        "_id": "user_id",
        "username": "employee01",
        "name": "Nguyễn Văn A",
        "role": "employee",
        "contact": {
          "phone": "0123456789",
          "email": "email@example.com"
        }
      },
      "branch_id": {
        "_id": "branch_id",
        "name": "Chi nhánh Hà Nội",
        "address": "123 Đường Láng, Hà Nội",
        "phone": "024-1234-5678"
      },
      "checkin_time": "2025-01-15T08:30:00",
      "checkout_time": "2025-01-15T17:30:00",
      "working_hours": 9,
      "status": "checked_out",
      "date": "2025-01-15",
      "shift": "morning",
      "scheduledShift": {
        "_id": "schedule_id",
        "date": "2025-01-15",
        "shift": "morning"
      },
      "isOnSchedule": true,
      "createdAt": "2025-01-15T08:30:00.000Z",
      "updatedAt": "2025-01-15T17:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 2450,
    "page": 1,
    "limit": 10,
    "totalPages": 245
  }
}
```

**CURL Examples:**

```bash
# Lấy tất cả lịch sử làm việc (trang 1)
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=10" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lấy lịch sử làm việc trong khoảng ngày
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=10&from_date=2025-01-01&to_date=2025-01-31" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lọc lịch sử theo chi nhánh
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=10&branch_id=507f1f77bcf86cd799439013" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lọc lịch sử của một nhân viên cụ thể
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=10&user_id=507f1f77bcf86cd799439012" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lọc những bản ghi absent (vắng mặt)
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=10&status=absent" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lọc những bản ghi late (đi trễ)
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=10&status=late" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Kết hợp nhiều filter
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=20&from_date=2025-01-01&to_date=2025-01-31&branch_id=507f1f77bcf86cd799439013&status=checked_out" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lấy trang 3 với 50 bản ghi trên trang
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=3&limit=50" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"
```

---

## Common Parameters

### Date Format
Tất cả các tham số ngày đều sử dụng định dạng: **YYYY-MM-DD**

Ví dụ:
- 2025-01-15 (15/01/2025)
- 2025-12-31 (31/12/2025)

### Status Values
Các giá trị status có thể:
- `checked_in` - Đã check-in, chưa check-out
- `checked_out` - Đã check-out
- `late` - Đi trễ
- `early` - Về sớm
- `absent` - Vắng mặt

### Shift Detection
- Ca **morning** (sáng): Check-in < 12:00
- Ca **afternoon** (chiều): Check-in >= 12:00

### Pagination
- `page`: Trang hiện tại (bắt đầu từ 1)
- `limit`: Số bản ghi trên mỗi trang (min: 1, max: 100, default: 10)

### Limits
- Tối đa 100 bản ghi trên một trang
- Tối thiểu 1 bản ghi trên một trang
- Mặc định 10 bản ghi trên một trang

---

## Response Fields

### Attendance Record Fields
- `_id`: ID bản ghi attendance
- `user_id`: Thông tin nhân viên
- `branch_id`: Thông tin chi nhánh
- `checkin_time`: Thời gian check-in (ISO format)
- `checkout_time`: Thời gian check-out (null nếu chưa checkout)
- `working_hours`: Số giờ làm việc tính toán
- `status`: Trạng thái attendance

### Enriched Fields (Được thêm vào so sánh với work_schedules)
- `date`: Ngày làm việc (extracted từ checkin_time, format: YYYY-MM-DD)
- `shift`: Ca làm việc (morning/afternoon, xác định từ giờ check-in)
- `scheduledShift`: Thông tin lịch được giao cho ngày/ca đó (null nếu không có)
- `isOnSchedule`: Boolean - true nếu nhân viên có lịch vào ngày/ca đó

---

## Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Không xác thực được người dùng"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Bạn không có quyền truy cập tài nguyên này"
}
```

### Bad Request (400)
```json
{
  "success": false,
  "message": "Invalid from_date: Date must be in YYYY-MM-DD format"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Use Cases

### Use Case 1: Employee xem lịch sử đi làm của mình
```bash
curl -X GET "http://localhost:5000/api/work-schedules/history/me?page=1&limit=20" \
  -H "Authorization: Bearer employee_token" \
  -H "Content-Type: application/json"
```

### Use Case 2: Branch Manager xem ai vắng mặt trong tháng
```bash
curl -X GET "http://localhost:5000/api/work-schedules/history/branch-employees?page=1&limit=30&from_date=2025-01-01&to_date=2025-01-31&status=absent" \
  -H "Authorization: Bearer branch_manager_token" \
  -H "Content-Type: application/json"
```

### Use Case 3: Branch Manager xem ai đi trễ
```bash
curl -X GET "http://localhost:5000/api/work-schedules/history/branch-employees?page=1&limit=20&status=late" \
  -H "Authorization: Bearer branch_manager_token" \
  -H "Content-Type: application/json"
```

### Use Case 4: System Admin xem lịch sử đi làm của một nhân viên cụ thể
```bash
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=50&user_id=507f1f77bcf86cd799439012&from_date=2025-01-01&to_date=2025-12-31" \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json"
```

### Use Case 5: System Admin xem ai không có lịch nhưng vẫn đi làm
```bash
curl -X GET "http://localhost:5000/api/work-schedules/history/all?page=1&limit=50&from_date=2025-01-01&to_date=2025-01-31" \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json"
```

Sau đó filter những bản ghi có `isOnSchedule: false`

---

## Data Flow

```
1. API Request → Get Attendance Records
2. Extract date & determine shift từ checkin_time
3. Load Work Schedules để so sánh
4. Enrich Attendance data với Schedule info
5. Return combined data
```

---

## Notes

- Tất cả các endpoint đều yêu cầu xác thực bằng Bearer Token
- Mỗi role chỉ có thể truy cập dữ liệu phù hợp với quyền hạn của mình
- Employee chỉ xem được lịch sử của chính mình
- Branch Manager chỉ xem được lịch sử của chi nhánh mình quản lý
- System Admin có thể xem tất cả dữ liệu
- Shift được xác định tự động từ giờ check-in (không lấy từ lịch)
- Dùng trường `isOnSchedule` để kiểm tra xem nhân viên có đúng lịch không
- Tất cả query parameters đều không phân biệt chữ hoa/chữ thường

---

## 4. Get Attendance Detail with Invoices - Lấy chi tiết lịch sử làm việc kèm hoá đơn

Lấy thông tin chi tiết về một bản ghi attendance cụ thể kèm danh sách tất cả các hoá đơn được nhân viên tạo trong ca làm việc đó.

**Endpoint:** `GET /api/work-schedules/history/:attendanceId`

**Authentication:** Required (Bearer Token)

**Authorization:** All authenticated users (employee, branch-manager, system-admin)

**URL Parameters:**
- `attendanceId` (required): ID của bản ghi attendance

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Retrieved attendance detail with invoices",
  "data": {
    "_id": "attendance_id",
    "user_id": {
      "_id": "user_id",
      "username": "employee01",
      "name": "Nguyễn Văn A",
      "role": "employee",
      "contact": {
        "phone": "0123456789",
        "email": "email@example.com"
      }
    },
    "branch_id": {
      "_id": "branch_id",
      "name": "Chi nhánh Hà Nội",
      "address": "123 Đường Láng, Hà Nội",
      "phone": "024-1234-5678"
    },
    "checkin_time": "2025-01-15T08:30:00Z",
    "checkout_time": "2025-01-15T17:30:00Z",
    "working_hours": 9,
    "status": "checked_out",
    "date": "2025-01-15",
    "shift": "morning",
    "scheduledShift": {
      "_id": "schedule_id",
      "date": "2025-01-15",
      "shift": "morning",
      "user_id": "user_id",
      "branch_id": "branch_id"
    },
    "isOnSchedule": true,
    "invoiceCount": 15,
    "invoiceSummary": {
      "totalAmount": 2450000,
      "totalItems": 35
    },
    "invoices": [
      {
        "_id": "invoice_id_1",
        "invoice_code": "INV-2025-0001",
        "branch_id": {
          "_id": "branch_id",
          "name": "Chi nhánh Hà Nội",
          "address": "123 Đường Láng, Hà Nội",
          "phone": "024-1234-5678"
        },
        "employee_id": {
          "_id": "user_id",
          "name": "Nguyễn Văn A",
          "username": "employee01"
        },
        "customer_id": {
          "_id": "customer_id",
          "name": "Khách hàng A",
          "phone": "0987654321",
          "address": "456 Nguyễn Hữu Cảnh, Bình Thạnh"
        },
        "customer_name": "Khách hàng A",
        "customer_phone": "0987654321",
        "payment_method": "cash",
        "items": [
          {
            "medicine_id": {
              "_id": "medicine_id",
              "name": "Aspirin",
              "unit": "viên",
              "price": 5000,
              "category": "Hạ sốt"
            },
            "batch_id": {
              "_id": "batch_id",
              "batch_number": "LOT-2024-001",
              "expiry_date": "2026-12-31"
            },
            "name": "Aspirin",
            "batch_number": "LOT-2024-001",
            "quantity": 2,
            "unit_price": 5000,
            "line_total": 10000
          }
        ],
        "subtotal": 145000,
        "discount": 0,
        "tax_rate": 0,
        "tax_amount": 0,
        "total_amount": 145000,
        "note": "Hoá đơn bán hàng thông thường",
        "status": "completed",
        "exported": false,
        "createdAt": "2025-01-15T09:15:00Z",
        "updatedAt": "2025-01-15T09:15:00Z"
      }
    ],
    "createdAt": "2025-01-15T08:30:00.000Z",
    "updatedAt": "2025-01-15T17:30:00.000Z"
  }
}
```

**Response Fields:**
- Tất cả fields từ attendance record + work schedule comparison
- `invoiceCount`: Tổng số hoá đơn được tạo trong ca làm việc
- `invoiceSummary`: Tóm tắt tổng tiền và tổng số sản phẩm
  - `totalAmount`: Tổng tiền tất cả hoá đơn (VND)
  - `totalItems`: Tổng số lượng sản phẩm được bán
- `invoices`: Danh sách chi tiết các hoá đơn được tạo từ `checkin_time` đến `checkout_time`

**CURL Examples:**

```bash
# Lấy chi tiết attendance với hoá đơn
curl -X GET "http://localhost:5000/api/work-schedules/history/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer your_access_token_here" \
  -H "Content-Type: application/json"

# Lấy chi tiết attendance (employee xem bản ghi của chính mình)
curl -X GET "http://localhost:5000/api/work-schedules/history/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer employee_token" \
  -H "Content-Type: application/json"

# Lấy chi tiết attendance (branch manager xem nhân viên trong chi nhánh)
curl -X GET "http://localhost:5000/api/work-schedules/history/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer branch_manager_token" \
  -H "Content-Type: application/json"

# Lấy chi tiết attendance (system admin xem bất kỳ nhân viên nào)
curl -X GET "http://localhost:5000/api/work-schedules/history/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer admin_token" \
  -H "Content-Type: application/json"
```

**Error Responses:**

### Not Found (404)
```json
{
  "success": false,
  "message": "Attendance record not found"
}
```

### Bad Request (400)
```json
{
  "success": false,
  "message": "Invalid attendance ID"
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Không xác thực được người dùng"
}
```

---

## Use Cases - Attendance Detail

### Use Case 1: Xem chi tiết một ca làm việc và danh sách hoá đơn
```bash
curl -X GET "http://localhost:5000/api/work-schedules/history/507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer employee_token" \
  -H "Content-Type: application/json"
```

### Use Case 2: Tính tổng doanh thu của một ca làm việc
Sử dụng field `invoiceSummary.totalAmount` để biết tổng tiền hoá đơn trong ca đó.

### Use Case 3: Đếm số lượng sản phẩm bán được trong ca
Sử dụng field `invoiceSummary.totalItems` hoặc đếm từ danh sách `invoices`.

### Use Case 4: Phân tích chi tiết từng hoá đơn trong ca
Duyệt qua mảng `invoices` để xem chi tiết từng hoá đơn, khách hàng, sản phẩm được bán.

---

## Data Flow - Attendance Detail

```
1. API Request (GET /api/work-schedules/history/:attendanceId)
2. Validate Attendance ID
3. Get Attendance Record (populate user_id, branch_id)
4. Extract date & determine shift từ checkin_time
5. Load Work Schedule (for schedule comparison)
6. Query Invoices created between checkin_time and checkout_time
   - Filter: employee_id, branch_id, createdAt range
7. Calculate Invoice Summary (totalAmount, totalItems)
8. Combine & enrich data
9. Return detailed attendance + invoices list
```

---

## Notes - Attendance Detail

- Hoá đơn được lọc dựa trên `createdAt` nằm trong khoảng `checkin_time` đến `checkout_time`
- Nếu nhân viên chưa checkout (`checkout_time` is null), sử dụng thời gian hiện tại làm giới hạn trên
- Shift được xác định tự động từ giờ check-in (< 12:00 = morning, >= 12:00 = afternoon)
- `isOnSchedule` cho biết nhân viên có đúng lịch vào ca đó không
- `invoiceSummary.totalAmount` = tổng `total_amount` của tất cả hoá đơn (bao gồm discount, tax)
- `invoiceSummary.totalItems` = tổng số lượng sản phẩm (`quantity`) từ tất cả items trong tất cả hoá đơn


