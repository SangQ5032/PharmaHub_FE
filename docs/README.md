# PharmaHub Frontend

## Tổng Quan Dự Án

PharmaHub là một ứng dụng di động React Native được phát triển để quản lý các hoạt động trong ngành dược phẩm, bao gồm quản lý lịch làm việc, chấm công, và quản lý kho.

### Thông tin Cơ Bản

- **Tên Dự Án**: PharmaHub_FE
- **Phiên Bản**: 0.0.1
- **Ngôn Ngữ Lập Trình**: TypeScript, React Native
- **Nền Tảng**: Android, iOS
- **Node.js Version**: >=18

## Kiến Trúc Dự Án

### Cấu Trúc Thư Mục

```
src/
├── app/                    # Cấu hình ứng dụng chính
│   ├── index.ts           # Xuất các thành phần chính
│   ├── navigation/        # Điều hướng ứng dụng
│   ├── providers/         # Context providers
│   └── query/            # Cấu hình React Query
├── config/               # Cấu hình hệ thống
│   └── firebase/         # Cấu hình Firebase
├── features/             # Các tính năng chính
│   ├── auth/            # Xác thực người dùng
│   ├── work-schdule/    # Quản lý lịch làm việc
│   ├── checkin-checkout/ # Chấm công
│   └── warehouse/       # Quản lý kho
└── shared/              # Thành phần chia sẻ
    ├── components/      # Component chung
    ├── screens/         # Màn hình chung
    ├── services/        # Dịch vụ API
    ├── types/          # Kiểu dữ liệu chung
    └── constants/      # Hằng số
```

### Các Tính Năng Chính

#### 1. Xác Thực (Auth)

- **LoginScreen**: Đăng nhập bằng tên đăng nhập/mật khẩu
- **PhoneLoginScreen**: Đăng nhập bằng xác thực Firebase
- **AuthProvider**: Quản lý trạng thái xác thực
- **useAuthStore**: Quản lý trạng thái toàn cục bằng Zustand

#### 2. Quản Lý Lịch Làm Việc (Work Schedule)

- **WorkScheduleScreen**: Xem lịch làm việc tổng quát
- **MyWorkScheduleScreen**: Xem lịch làm việc cá nhân
- **API Integration**: Lấy dữ liệu lịch từ backend

#### 3. Chấm Công (Checkin/Checkout)

- **CheckinCheckoutScreen**: Màn hình chấm công
- **Thời Gian Thực**: Hiển thị thời gian làm việc hiện tại
- **Trạng Thái**: Theo dõi trạng thái checkin/checkout

#### 4. Quản Lý Kho (Warehouse)

- **ImportListScreen**: Danh sách phiếu nhập kho
- **ImportCard**: Component hiển thị thông tin phiếu nhập
- **API Integration**: Quản lý dữ liệu kho

## Công Nghệ Sử Dụng

### Core Technologies

- **React Native 0.80.1**: Framework phát triển ứng dụng mobile
- **TypeScript 5.0.4**: Ngôn ngữ lập trình
- **React 19.1.0**: Thư viện UI

### Navigation & State Management

- **@react-navigation/native 7.1.18**: Điều hướng ứng dụng
- **@react-navigation/bottom-tabs 7.8.4**: Tab navigation
- **zustand 5.0.8**: Quản lý state toàn cục
- **@tanstack/react-query 5.90.5**: Quản lý data fetching

### Authentication & Database

- **@react-native-firebase/app 23.5.0**: Firebase integration
- **@react-native-firebase/auth 23.5.0**: Xác thực Firebase
- **@react-native-async-storage/async-storage 2.2.0**: Lưu trữ cục bộ

### UI & UX

- **react-native-vector-icons 10.3.0**: Icon library
- **react-native-gesture-handler 2.29.0**: Xử lý gesture
- **react-native-safe-area-context 5.6.1**: Xử lý safe area
- **react-native-screens 4.18.0**: Quản lý screens

### Development Tools

- **axios 1.12.2**: HTTP client
- **eslint 8.19.0**: Code linting
- **prettier 2.8.8**: Code formatting
- **jest 29.6.3**: Testing framework
- **husky 9.1.7**: Git hooks

## Cài Đặt & Chạy Ứng Dụng

### Yêu Cầu Hệ Thống

- Node.js >= 18
- Yarn package manager
- React Native development environment

### Các Bước Cài Đặt

1. **Cài đặt dependencies**:

   ```bash
   yarn install
   ```

2. **Chạy trên Android**:

   ```bash
   yarn android
   ```

3. **Chạy trên iOS**:

   ```bash
   yarn ios
   ```

4. **Chạy development server**:
   ```bash
   yarn start
   ```

### Môi Trường Phát Triển

- **API URL**:
  - Android Emulator: `http://10.0.2.2:8080/api`
  - iOS Simulator: `http://localhost:8080/api`
  - Thiết bị thật: `http://[IP_máy_tính]:8080/api`

## Cấu Trúc API

### Authentication API

- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/phone-login` - Đăng nhập bằng phone
- `POST /api/auth/logout` - Đăng xuất

### Work Schedule API

- `GET /api/work-schedule` - Lấy lịch làm việc
- `GET /api/work-schedule/my` - Lấy lịch làm việc cá nhân

### Attendance API

- `POST /api/attendance/checkin` - Checkin
- `POST /api/attendance/checkout` - Checkout
- `GET /api/attendance/my` - Lấy thông tin chấm công

### Warehouse API

- `GET /api/warehouse/imports` - Lấy danh sách phiếu nhập
- `POST /api/warehouse/imports` - Tạo phiếu nhập mới

## Quản Lý State

### Zustand Store

Dự án sử dụng Zustand để quản lý state toàn cục:

```typescript
// Auth State
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
  setToken: (accessToken: string, refreshToken?: string) => Promise<void>;
  setUser: (user: any) => void;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}
```

### React Query

Sử dụng React Query để quản lý data fetching:

```typescript
// Ví dụ sử dụng
const { data, isLoading, error } = useQuery({
  queryKey: ['work-schedule'],
  queryFn: getWorkSchedule,
});
```

## Xử Lý Lỗi & Bảo Mật

### Authentication

- Token-based authentication sử dụng JWT
- Tự động refresh token
- Redirect đến login khi token hết hạn

### API Error Handling

- Global error interceptor
- Automatic logout on 401 errors
- User-friendly error messages

### Data Validation

- TypeScript interfaces
- Runtime validation
- Input sanitization

## Testing

### Unit Testing

- Jest framework
- React Testing Library
- Test coverage for critical components

### Integration Testing

- API integration tests
- Navigation tests
- State management tests

## Deployment

### Build Production

```bash
# Android
yarn build:android

# iOS
yarn build:ios
```

### Environment Variables

- API endpoints
- Firebase configuration
- App secrets

## Contributing

### Code Style

- ESLint + Prettier
- TypeScript strict mode
- Component naming convention
- File organization

### Git Workflow

- Feature branches
- Pull requests
- Code reviews
- Automated testing

## Documentation

### API Documentation

- OpenAPI/Swagger specs
- API endpoint documentation
- Request/response examples

### Component Documentation

- Storybook integration
- Component props documentation
- Usage examples

## Support

### Contact

- Development Team: [email]
- Technical Support: [email]
- Documentation: [link]

### Issue Tracking

- GitHub Issues
- Bug reports
- Feature requests

---

**Last Updated**: 2025-11-13
**Version**: 0.0.1
