# Branch APIs — curl examples and sample responses

Base URL (replace as needed): `http://localhost:3000`

NOTE: protected endpoints require an Authorization header: `Authorization: Bearer <ACCESS_TOKEN>`.

1) Get all branches

Request:

```bash
curl -X GET "http://localhost:3000/api/branches"
```

Sample response (200):

```json
{
  "success": true,
  "data": [
    {
      "_id": "64f1a1b2c3d4e5f678901234",
      "name": "Chi nhánh A",
      "address": "123 Đường A, Hà Nội",
      "phone": "0123456789",
      "revenue_target": 1000000,
      "createdAt": "2025-11-21T07:00:00.000Z",
      "updatedAt": "2025-11-21T07:00:00.000Z",
      "__v": 0
    }
  ]
}
```

2) Create a branch

Required fields (controller validation): `name`, `address`, `phone`.

Request:

```bash
curl -X POST "http://localhost:3000/api/branches" \
  -H "Content-Type: application/json" \
  -d '{"name":"Chi nhánh B","address":"456 Đường B, HCM","phone":"0987654321","revenue_target":500000}'
```

Sample response (201):

```json
{
  "success": true,
  "data": {
    "_id": "6500b2c3d4e5f67890123456",
    "name": "Chi nhánh B",
    "address": "456 Đường B, HCM",
    "phone": "0987654321",
    "revenue_target": 500000,
    "createdAt": "2025-11-21T07:15:00.000Z",
    "updatedAt": "2025-11-21T07:15:00.000Z",
    "__v": 0
  }
}
```

3) Get branch by id

Request:

```bash
curl -X GET "http://localhost:3000/api/branches/<BRANCH_ID>"
```

Sample response (200):

```json
{
  "success": true,
  "data": {
    "_id": "64f1a1b2c3d4e5f678901234",
    "name": "Chi nhánh A",
    "address": "123 Đường A, Hà Nội",
    "phone": "0123456789",
    "revenue_target": 1000000,
    "createdAt": "2025-11-21T07:00:00.000Z",
    "updatedAt": "2025-11-21T07:00:00.000Z",
    "__v": 0
  }
}
```

4) Update a branch

Request (PUT):

```bash
curl -X PUT "http://localhost:3000/api/branches/<BRANCH_ID>" \
  -H "Content-Type: application/json" \
  -d '{"address":"Số 99, Đường Mới, Hà Nội","revenue_target":1500000}'
```

Sample response (200):

```json
{
  "success": true,
  "data": {
    "_id": "64f1a1b2c3d4e5f678901234",
    "name": "Chi nhánh A",
    "address": "Số 99, Đường Mới, Hà Nội",
    "phone": "0123456789",
    "revenue_target": 1500000,
    "createdAt": "2025-11-21T07:00:00.000Z",
    "updatedAt": "2025-11-21T07:20:00.000Z",
    "__v": 0
  }
}
```

5) Delete a branch

Request:

```bash
curl -X DELETE "http://localhost:3000/api/branches/<BRANCH_ID>"
```

Sample response (200):

```json
{
  "success": true,
  "message": "Branch deleted"
}
```

6) Get inventory for a branch (protected)

Endpoint: `GET /api/branches/:id/inventory`
Requires roles: `employee`, `branch-manager`, `system-admin` (middleware `protect` + `authorizeRoles`).

Request:

```bash
curl -X GET "http://localhost:3000/api/branches/<BRANCH_ID>/inventory" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Sample response (200):

```json
{
  "success": true,
  "data": [
    {
      "medicine_id": "6500c1d2e3f4567890123456",
      "name": "Paracetamol",
      "quantity": 120,
      "unit": "box"
    }
  ]
}
```

7) Get inventory report for a branch (protected)

Endpoint: `GET /api/branches/:id/reports/inventory`
Requires roles: `branch-manager`, `system-admin`.

Request:

```bash
curl -X GET "http://localhost:3000/api/branches/<BRANCH_ID>/reports/inventory" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Sample response (200):

```json
{
  "success": true,
  "data": {
    "branch_id": "64f1a1b2c3d4e5f678901234",
    "report": [
      {
        "medicine_name": "Paracetamol",
        "opening_stock": 100,
        "purchased": 50,
        "sold": 30,
        "closing_stock": 120
      }
    ]
  }
}
```

---

Notes:
- Replace `<BRANCH_ID>` with actual MongoDB ObjectId for the branch.
- Replace `<ACCESS_TOKEN>` with a valid JWT (the project uses its own JWT creation for backend). The two protected routes require authentication and role-based authorization.
- Create/update endpoints currently are not protected by middleware in the code. If you want them protected, consider adding `protect` and `authorizeRoles('system-admin')` in `branch.routes.js`.

If bạn muốn, tôi có thể:
- Chạy thêm tìm kiếm để liệt kê tất cả các file sử dụng các trường branch-related để cập nhật sang `branch_id` (nếu cần). 
- Hoặc tạo Postman collection từ các curl trên.
