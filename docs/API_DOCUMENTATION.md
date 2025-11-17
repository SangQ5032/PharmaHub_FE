# API Documentation

## Tổng Quan API

PharmaHub Frontend tích hợp với backend API để xử lý các chức năng nghiệp vụ. Dưới đây là tài liệu chi tiết về các endpoint API được sử dụng trong ứng dụng.

## Base URLs

### Development Environment

- **Android Emulator**: `http://10.0.2.2:8080/api`
- **iOS Simulator**: `http://localhost:8080/api`
- **Real Device**: `http://[your-ip-address]:8080/api`

### Production Environment

- **Base URL**: `https://api.pharmahub.com/api`

## Authentication API

### Login with Username/Password

```http
POST /auth/login
```

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "user_id",
      "name": "Nguyễn Văn A",
      "email": "user@example.com",
      "role": "staff"
    }
  },
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Phone Authentication

#### Send OTP

```http
POST /auth/send-otp
```

**Request Body:**

```json
{
  "phone": "+84901234567"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "expiresIn": 300
  }
}
```

#### Verify OTP

```http
POST /auth/verify-otp
```

**Request Body:**

```json
{
  "phone": "+84901234567",
  "otp": "123456",
  "sessionId": "session_id_from_send_otp"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "user_id",
      "name": "Nguyễn Văn A",
      "phone": "+84901234567"
    }
  },
  "message": "Phone authentication successful"
}
```

### Logout

```http
POST /auth/logout
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Work Schedule API

### Get Work Schedule List

```http
GET /work-schedule
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "schedule_id",
      "user_id": {
        "_id": "user_id",
        "name": "Nguyễn Văn A",
        "role": "staff"
      },
      "branch_id": {
        "_id": "branch_id",
        "name": "Chi nhánh Quận 1"
      },
      "date": "2024-11-13T00:00:00.000Z",
      "shift": "Ca 1: 7h - 15h",
      "createdAt": "2024-11-12T10:30:00.000Z",
      "updatedAt": "2024-11-12T10:30:00.000Z"
    }
  ],
  "message": "Work schedule retrieved successfully"
}
```

### Get My Work Schedule

```http
GET /work-schedule/my
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "my_schedule_id",
      "user_id": {
        "_id": "current_user_id",
        "name": "Nguyễn Văn A",
        "role": "staff"
      },
      "branch_id": {
        "_id": "my_branch_id",
        "name": "Chi nhánh Quận 1"
      },
      "date": "2024-11-13T00:00:00.000Z",
      "shift": "Ca 1: 7h - 15h",
      "createdAt": "2024-11-12T10:30:00.000Z",
      "updatedAt": "2024-11-12T10:30:00.000Z"
    }
  ],
  "message": "My work schedule retrieved successfully"
}
```

## Attendance API

### Checkin

```http
POST /attendance/checkin
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "attendance_id",
    "user_id": "current_user_id",
    "checkin_time": "2024-11-13T07:00:00.000Z",
    "status": "checked_in",
    "createdAt": "2024-11-13T07:00:00.000Z"
  },
  "message": "Checkin successful"
}
```

### Checkout

```http
POST /attendance/checkout
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "attendance_id",
    "user_id": "current_user_id",
    "checkin_time": "2024-11-13T07:00:00.000Z",
    "checkout_time": "2024-11-13T17:00:00.000Z",
    "status": "checked_out",
    "working_hours": 8,
    "createdAt": "2024-11-13T07:00:00.000Z",
    "updatedAt": "2024-11-13T17:00:00.000Z"
  },
  "message": "Checkout successful"
}
```

### Get My Attendance

```http
GET /attendance/my?month=11&year=2024
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `month` (optional): Month to filter (1-12)
- `year` (optional): Year to filter (4-digit year)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "attendance_id",
      "user_id": "current_user_id",
      "checkin_time": "2024-11-13T07:00:00.000Z",
      "checkout_time": "2024-11-13T17:00:00.000Z",
      "status": "checked_out",
      "working_hours": 8,
      "date": "2024-11-13",
      "createdAt": "2024-11-13T07:00:00.000Z",
      "updatedAt": "2024-11-13T17:00:00.000Z"
    }
  ],
  "message": "My attendance records retrieved successfully"
}
```

## Warehouse API

### Get Import List

```http
GET /warehouse/imports?page=1&limit=20
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Response (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "import_id",
      "import_code": "IMP20241113001",
      "supplier": {
        "_id": "supplier_id",
        "name": "Nhà cung cấp ABC",
        "phone": "+84901234567",
        "email": "contact@abc.com"
      },
      "total_amount": 15000000,
      "status": "pending",
      "items": [
        {
          "product_id": "product_id",
          "product_name": "Thuốc XYZ",
          "quantity": 100,
          "unit_price": 150000,
          "total_price": 15000000
        }
      ],
      "created_by": {
        "_id": "user_id",
        "name": "Nguyễn Văn A"
      },
      "created_at": "2024-11-13T10:00:00.000Z",
      "updated_at": "2024-11-13T10:00:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "items_per_page": 20,
    "total_items": 150,
    "total_pages": 8
  },
  "message": "Import list retrieved successfully"
}
```

### Create Import

```http
POST /warehouse/imports
```

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**

```json
{
  "supplier_id": "supplier_id",
  "items": [
    {
      "product_id": "product_id",
      "quantity": 100,
      "unit_price": 150000
    }
  ],
  "notes": "Ghi chú nhập hàng"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "_id": "new_import_id",
    "import_code": "IMP20241113002",
    "supplier_id": "supplier_id",
    "total_amount": 15000000,
    "status": "pending",
    "items": [
      {
        "product_id": "product_id",
        "quantity": 100,
        "unit_price": 150000,
        "total_price": 15000000
      }
    ],
    "created_by": "current_user_id",
    "created_at": "2024-11-13T15:30:00.000Z",
    "updated_at": "2024-11-13T15:30:00.000Z"
  },
  "message": "Import record created successfully"
}
```

## Error Handling

### Common Error Responses

#### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized access. Please login again."
}
```

#### 403 Forbidden

```json
{
  "success": false,
  "message": "Access forbidden. You don't have permission to access this resource."
}
```

#### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found."
}
```

#### 422 Unprocessable Entity

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "field_name": ["Error message for field"]
  }
}
```

#### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error. Please try again later."
}
```

## Authentication & Security

### JWT Token

- **Type**: Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Expiration**: Configurable (typically 24 hours)
- **Refresh**: Available via refresh token

### Token Storage

- **Access Token**: AsyncStorage
- **Refresh Token**: AsyncStorage
- **Auto Logout**: On token expiration or invalidation

### Security Measures

- HTTPS for production
- Token-based authentication
- Input validation and sanitization
- Rate limiting on authentication endpoints
- Password hashing with bcrypt

## Rate Limiting

### Limits

- **Authentication**: 5 requests per minute per IP
- **General API**: 60 requests per minute per user
- **Search/Filter**: 30 requests per minute per user

### Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 1609459200
```

## API Versioning

### Current Version

- **Version**: v1
- **Base Path**: `/api/v1/`

### Version Policy

- Backward compatibility maintained for 2 versions
- Deprecation notices provided 3 months in advance
- Migration guides for breaking changes

---

**Last Updated**: 2025-11-13
**API Version**: v1
**Contact**: [API Support Email]
