# Component Guide

## Tổng Quan Component

PharmaHub Frontend sử dụng kiến trúc component-based với React Native. Tài liệu này hướng dẫn cách sử dụng và phát triển các component trong dự án.

## Cấu Trúc Component

### Shared Components

Các component chia sẻ được đặt trong `src/shared/components/`:

```
src/shared/components/
├── button/
│   └── Button.tsx
├── header/
│   └── Header.tsx
├── input/
│   └── Input.tsx
├── bottom-tap-navigator/
│   └── HomeTap.tsx
└── index.ts
```

### Feature Components

Các component riêng cho từng feature được đặt trong thư mục feature tương ứng:

```
src/features/
├── auth/components/
├── work-schdule/components/
├── checkin-checkout/components/
└── warehouse/components/
```

## Component Tiêu Biểu

### Button Component

**Đường Dẫn**: `src/shared/components/button/Button.tsx`

**Mô Tả**: Component button đa năng với các variant và kích cỡ khác nhau.

**Props**:

```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}
```

**Sử Dụng**:

```tsx
import { Button } from '@shared/components';

// Primary button
<Button
  title="Submit"
  onPress={handleSubmit}
  variant="primary"
/>

// Secondary button with loading
<Button
  title="Loading..."
  onPress={handleAction}
  loading={true}
  variant="secondary"
  size="large"
/>
```

### Header Component

**Đường Dẫn**: `src/shared/components/header/Header.tsx`

**Mô Tả**: Component header tiêu chuẩn cho các màn hình.

**Props**:

```typescript
interface HeaderProps {
  title: string;
  showBack?: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
  onBack?: () => void;
  onAvatarPress?: () => void;
  rightComponent?: React.ReactNode;
}
```

**Sử Dụng**:

```tsx
import { Header } from '@shared/components';

// Header with back button
<Header
  title="Work Schedule"
  showBack={true}
  onBack={() => navigation.goBack()}
/>

// Header with avatar
<Header
  title="Profile"
  showAvatar={true}
  avatarUrl="https://example.com/avatar.jpg"
  onAvatarPress={handleAvatarPress}
/>
```

### Input Component

**Đường Dẫn**: `src/shared/components/input/Input.tsx`

**Mô Tả**: Component input text với validation và hỗ trợ nhiều kiểu input.

**Props**:

```typescript
interface InputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
  label?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
}
```

**Sử Dụng**:

```tsx
import { Input } from '@shared/components';

// Basic input
<Input
  placeholder="Enter your name"
  value={name}
  onChangeText={setName}
  label="Full Name"
/>

// Password input with error
<Input
  placeholder="Enter password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  error={passwordError}
  label="Password"
/>

// Multiline input
<Input
  placeholder="Enter description"
  value={description}
  onChangeText={setDescription}
  multiline={true}
  numberOfLines={4}
  label="Description"
/>
```

### ImportCard Component

**Đường Dẫn**: `src/features/warehouse/components/ImportCard.tsx`

**Mô Tả**: Component hiển thị thông tin phiếu nhập kho.

**Props**:

```typescript
interface ImportCardProps {
  import: ImportRecord;
  onPress?: (importRecord: ImportRecord) => void;
  style?: ViewStyle;
}
```

**Sử Dụng**:

```tsx
import { ImportCard } from '@features/warehouse/components';

<ImportCard import={importRecord} onPress={record => handlePress(record)} />;
```

## Navigation Components

### Bottom Tab Navigator

**Đường Dẫn**: `src/shared/components/bottom-tap-navigator/HomeTap.tsx`

**Mô Tả**: Component bottom tab navigator cho trang chủ.

**Props**:

```typescript
interface HomeNavigatorProps {
  tabs: TabItem[];
  activeTintColor?: string;
  inactiveTintColor?: string;
  tabBarStyle?: ViewStyle;
}

interface TabItem {
  name: string;
  component: React.ComponentType;
  label: string;
  icon?: string;
}
```

**Sử Dụng**:

```tsx
import { HomeNavigator } from '@shared/components';

const tabs: TabItem[] = [
  {
    name: 'Home',
    component: HomeScreen,
    label: 'Trang chủ',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    label: 'Tài khoản',
  },
];

<HomeNavigator
  tabs={tabs}
  activeTintColor="#4CAF50"
  inactiveTintColor="#9E9E9E"
/>;
```

## Custom Hooks

### useLogin Hook

**Đường Dẫn**: `src/features/auth/hooks/useLogin.ts`

**Mô Tả**: Custom hook xử lý logic đăng nhập.

**Sử Dụng**:

```tsx
import { useLogin } from '@features/auth/hooks';

const LoginScreen = () => {
  const { mutate: login, isPending, error } = useLogin();

  const handleLogin = () => {
    login(
      { username, password },
      {
        onSuccess: () => {
          // Handle success
        },
        onError: (error) => {
          // Handle error
        },
      }
    );
  };

  return (
    // Login form
  );
};
```

### useWorkSchedule Hook

**Đường Dẫn**: `src/features/work-schdule/hooks/useWorkSchedule.ts`

**Mô Tả**: Custom hook lấy dữ liệu lịch làm việc.

**Sử Dụng**:

```tsx
import { useWorkSchedules } from '@features/work-schdule/hooks';

const WorkScheduleScreen = () => {
  const { data, isLoading, error, refetch } = useWorkSchedules();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    // Schedule list
  );
};
```

### useAttendance Hook

**Đường Dẫn**: `src/features/checkin-checkout/hooks/useAttendance.ts`

**Mô Tả**: Custom hook xử lý chấm công.

**Sử Dụng**:

```tsx
import { useCheckin, useCheckout, useMyAttendance } from '@features/checkin-checkout/hooks';

const CheckinCheckoutScreen = () => {
  const { data: attendanceData } = useMyAttendance();
  const checkinMutation = useCheckin();
  const checkoutMutation = useCheckout();

  const handleCheckin = async () => {
    await checkinMutation.mutateAsync({});
  };

  const handleCheckout = async () => {
    await checkoutMutation.mutateAsync({});
  };

  return (
    // Checkin/checkout UI
  );
};
```

## Providers

### AuthProvider

**Đường Dẫn**: `src/app/providers/AuthProvider.tsx`

**Mô Tả**: Context provider quản lý trạng thái xác thực.

**Sử Dụng**:

```tsx
import { AuthProvider } from '@app/providers';

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

// Trong component con
import { useAuth } from '@app/providers';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  return (
    // Profile UI
  );
};
```

## Styling Guidelines

### Color Palette

```typescript
// Primary Colors
const COLORS = {
  primary: '#4CAF50', // Green
  secondary: '#9E9E9E', // Gray
  background: '#FFFFFF', // White
  text: '#333333', // Dark Gray
  textSecondary: '#757575', // Medium Gray
  error: '#F44336', // Red
  warning: '#FF9800', // Orange
  success: '#4CAF50', // Green
  border: '#E0E0E0', // Light Gray
};
```

### Typography

```typescript
const TYPOGRAPHY = {
  fontSize: {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 18,
    xxlarge: 20,
    title: 22,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};
```

### Spacing

```typescript
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};
```

## Best Practices

### Component Naming

- Sử dụng PascalCase cho component names
- Đặt tên file trùng với component name
- Sử dụng `.tsx` extension cho TypeScript React components

### Props Interface

```tsx
// Tốt: Props interface rõ ràng
interface UserProfileProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  isLoading?: boolean;
}

// Tránh: Props interface quá chung chung
interface Props {
  data: any;
  action: Function;
}
```

### Component Structure

```tsx
// Cấu trúc chuẩn
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@shared/components';

interface MyComponentProps {
  title: string;
  onPress: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onPress }) => {
  // Component logic

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Button title="Action" onPress={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default MyComponent;
```

### Error Handling

```tsx
// Luôn xử lý error trong components
const MyComponent = () => {
  const { data, error, isLoading } = useSomeQuery();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Có lỗi xảy ra</Text>
        <Button title="Thử lại" onPress={refetch} />
      </View>
    );
  }

  return (
    // Normal component
  );
};
```

## Testing Components

### Unit Testing

```tsx
// __tests__/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@shared/components';

describe('Button Component', () => {
  it('should render correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />,
    );

    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPress} />,
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Integration Testing

```tsx
// __tests__/LoginScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '@features/auth/screens/LoginScreen';

describe('LoginScreen', () => {
  it('should handle login flow', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);

    fireEvent.changeText(getByPlaceholderText('Tên đăng nhập'), 'testuser');
    fireEvent.changeText(getByPlaceholderText('Mật khẩu'), 'password123');
    fireEvent.press(getByText('Đăng nhập'));

    // Add assertions for login flow
  });
});
```

---

**Last Updated**: 2025-11-13
**Version**: 1.0
**Contact**: [Development Team Email]
