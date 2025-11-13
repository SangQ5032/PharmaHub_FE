# Development Guide

## Hướng Dẫn Phát Triển

Tài liệu này cung cấp hướng dẫn chi tiết cho việc phát triển và duy trì dự án PharmaHub Frontend.

## Yêu Cầu Hệ Thống

### Bắt Buộc

- **Node.js**: >= 18.0.0
- **Yarn**: >= 1.22.0
- **React Native CLI**: >= 19.0.0
- **Android Studio**: >= 2021.1.1 (cho Android development)
- **Xcode**: >= 14.0 (cho iOS development)

### Kiểm Tra Version

```bash
node --version    # Should be >= 18.0.0
yarn --version    # Should be >= 1.22.0
npm --version     # Should be >= 8.0.0
```

## Cài Đặt Môi Trường

### 1. Cài Đặt Dependencies

```bash
# Install all dependencies
yarn install

# Install pods for iOS (macOS only)
cd ios && pod install && cd ..
```

### 2. Cấu Hình Firebase

1. Tạo project trên Firebase Console
2. Thêm file `google-services.json` vào `android/app/`
3. Thêm file `GoogleService-Info.plist` vào iOS project
4. Cấu hình Firebase trong `src/config/firebase/index.ts`

### 3. Cấu Hình Backend API

1. Đảm bảo backend server đang chạy
2. Kiểm tra API URL trong `src/shared/services/api.ts`
3. Cấu hình CORS nếu cần

## Phát Triển

### Khởi Động Development Server

```bash
# Start Metro bundler
yarn start

# Run on Android
yarn android

# Run on iOS
yarn ios
```

### Hot Reload

- **Enable**: Tự động kích hoạt khi dùng `yarn start`
- **Manual Reload**:
  - Android: Shake device or Ctrl+M → "Reload"
  - iOS: Shake device or Cmd+R

### Debugging

```bash
# Enable React Native Debugger
yarn start --reset-cache

# Open debugger
# http://localhost:8081/debugger-ui
```

## Cấu Trúc File & Thư Mục

### Quy Tắc Đặt Tên

```
# Components
Button.tsx          # Component chính
Button.test.tsx     # Test file
Button.styles.ts    # Styles (nếu tách riêng)

# Screens
LoginScreen.tsx
LoginScreen.test.tsx

# Hooks
useLogin.ts
useLogin.test.tsx

# Types
types.ts
types.test.tsx
```

### Import Path Aliases

Dự án sử dụng path aliases để đơn giản hóa imports:

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["src/shared/*"],
      "@features/*": ["src/features/*"],
      "@app/*": ["src/app/*"],
      "@config/*": ["src/config/*"]
    }
  }
}
```

**Ví dụ sử dụng**:

```tsx
// Thay vì: import { Button } from '../../../shared/components/button/Button'
import { Button } from '@shared/components/button/Button';

// Thay vì: import { useLogin } from '../../../features/auth/hooks/useLogin'
import { useLogin } from '@features/auth/hooks/useLogin';
```

## Phát Triển Component Mới

### 1. Tạo Component

```bash
# Tạo thư mục component
mkdir -p src/shared/components/NewComponent

# Tạo file component chính
touch src/shared/components/NewComponent/NewComponent.tsx

# Tạo file types (nếu cần)
touch src/shared/components/NewComponent/types.ts

# Tạo file styles (nếu tách riêng)
touch src/shared/components/NewComponent/styles.ts

# Tạo file test
mkdir -p __tests__/shared/components
touch __tests__/shared/components/NewComponent.test.tsx
```

### 2. Cấu Trúc Component Chuẩn

```tsx
// src/shared/components/NewComponent/NewComponent.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NewComponentProps } from './types';

const NewComponent: React.FC<NewComponentProps> = ({
  title,
  onPress,
  variant = 'primary',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewComponent;
```

### 3. Thêm vào Index File

```tsx
// src/shared/components/index.ts
export { default as Button } from './button/Button';
export { default as Header } from './header/Header';
export { default as Input } from './input/Input';
export { default as NewComponent } from './NewComponent/NewComponent';
```

### 4. Viết Test

```tsx
// __tests__/shared/components/NewComponent.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewComponent from '@shared/components/NewComponent';

describe('NewComponent', () => {
  it('should render correctly', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <NewComponent title="Test Title" onPress={onPress} />,
    );

    expect(getByText('Test Title')).toBeTruthy();
  });
});
```

## Phát Triển Feature Mới

### 1. Tạo Cấu Trúc Feature

```bash
# Tạo thư mục feature
mkdir -p src/features/new-feature

# Tạo các thư mục con
mkdir -p src/features/new-feature/{api,hooks,screens,components,types,store}
```

### 2. Cấu Trúc Feature Chuẩn

```
src/features/new-feature/
├── api/
│   └── new-feature.api.ts
├── hooks/
│   └── useNewFeature.ts
├── screens/
│   ├── NewFeatureListScreen.tsx
│   └── NewFeatureDetailScreen.tsx
├── components/
│   └── NewFeatureCard.tsx
├── types/
│   └── types.ts
├── store/
│   └── useNewFeatureStore.ts
└── index.ts
```

### 3. API Integration

```tsx
// src/features/new-feature/api/new-feature.api.ts
import api from '@shared/services/api';

export const getNewFeatureData = async (params: any) => {
  const response = await api.get('/new-feature', { params });
  return response.data;
};

export const createNewFeature = async (data: any) => {
  const response = await api.post('/new-feature', data);
  return response.data;
};
```

### 4. Custom Hook

```tsx
// src/features/new-feature/hooks/useNewFeature.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNewFeatureData, createNewFeature } from '../api/new-feature.api';

export const useNewFeature = (params?: any) => {
  return useQuery({
    queryKey: ['new-feature', params],
    queryFn: () => getNewFeatureData(params),
  });
};

export const useCreateNewFeature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['new-feature'] });
    },
  });
};
```

### 5. Navigation Integration

```tsx
// src/shared/constants/routes.ts
export const ROUTES = {
  // ... existing routes
  NEW_FEATURE: 'NewFeature',
  NEW_FEATURE_DETAIL: 'NewFeatureDetail',
};

// src/app/navigation/AppNavigator.tsx
import NewFeatureListScreen from '@features/new-feature/screens/NewFeatureListScreen';

// Thêm route vào MainStack
<MainStack.Screen name={ROUTES.NEW_FEATURE} component={NewFeatureListScreen} />;
```

## Testing

### Unit Testing

```bash
# Run all tests
yarn test

# Run specific test file
yarn test NewComponent.test.tsx

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Test Structure

```tsx
// __tests__/features/auth/useLogin.test.tsx
import { renderHook, act } from '@testing-library/react-native';
import { useLogin } from '@features/auth/hooks/useLogin';

// Mock API
jest.mock('@features/auth/api/auth.api', () => ({
  login: jest.fn(),
}));

describe('useLogin Hook', () => {
  it('should handle successful login', async () => {
    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.mutateAsync({
        username: 'testuser',
        password: 'password123',
      });
    });

    expect(result.current.isSuccess).toBe(true);
  });
});
```

### Integration Testing

```tsx
// __tests__/integration/Navigation.test.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, fireEvent } from '@testing-library/react-native';
import AppNavigator from '@app/navigation/AppNavigator';

describe('Navigation Integration', () => {
  it('should navigate between screens', () => {
    const { getByText } = render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>,
    );

    fireEvent.press(getByText('Work Schedule'));
    // Add assertions for navigation
  });
});
```

## Code Quality

### ESLint & Prettier

```bash
# Check linting
yarn lint

# Fix linting issues
yarn lint --fix

# Format code
yarn prettier
```

### Husky Git Hooks

Dự án sử dụng Husky để đảm bảo code quality:

```bash
# Pre-commit hook sẽ tự động:
# 1. Chạy ESLint
# 2. Chạy Prettier
# 3. Chạy tests

# Nếu có lỗi, commit sẽ bị hủy
```

### TypeScript Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

## Performance Optimization

### 1. React.memo

```tsx
import React, { memo } from 'react';

const ExpensiveComponent = memo(({ data }: { data: any[] }) => {
  return (
    // Component logic
  );
});

export default ExpensiveComponent;
```

### 2. useMemo & useCallback

```tsx
import React, { useMemo, useCallback } from 'react';

const MyComponent = ({ items, onItemClick }) => {
  const expensiveValue = useMemo(() => {
    return items.filter(item => item.active);
  }, [items]);

  const handleClick = useCallback((item) => {
    onItemClick(item);
  }, [onItemClick]);

  return (
    // Component using expensiveValue and handleClick
  );
};
```

### 3. Virtualized Lists

```tsx
import { FlatList } from 'react-native';

const ItemList = ({ data }) => {
  const renderItem = useCallback(
    ({ item }) => <ItemComponent item={item} />,
    [],
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
};
```

## Debugging

### React Native Debugger

```bash
# Install React Native Debugger
# https://github.com/jhen0409/react-native-debugger

# Open debugger
# Cmd+T (macOS) or Ctrl+T (Windows/Linux)
```

### Flipper

```bash
# Install Flipper
# https://fbflipper.com/

# Open Flipper for advanced debugging
```

### Console Logging

```tsx
// Development logging
if (__DEV__) {
  console.log('Debug info:', data);
}

// Error logging
console.error('Error message:', error);
```

## Build & Deployment

### Development Build

```bash
# Android development build
yarn android --variant=debug

# iOS development build
yarn ios --configuration=Debug
```

### Production Build

```bash
# Android production build
yarn android --variant=release

# iOS production build
yarn ios --configuration=Release
```

### Environment Variables

```typescript
// .env.development
API_BASE_URL=http://localhost:8080/api
FIREBASE_CONFIG=development

// .env.production
API_BASE_URL=https://api.pharmahub.com/api
FIREBASE_CONFIG=production
```

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues

```bash
# Clear Metro cache
yarn start --reset-cache

# Clear watchman
watchman watch-del-all

# Clear node modules and reinstall
rm -rf node_modules yarn.lock
yarn install
```

#### 2. iOS Build Issues

```bash
# Clean iOS build
cd ios && xcodebuild clean

# Reset iOS pods
cd ios && rm -rf Pods Podfile.lock
pod install
```

#### 3. Android Build Issues

```bash
# Clean Android build
cd android && ./gradlew clean

# Reset Android cache
cd android && ./gradlew cleanBuildCache
```

#### 4. TypeScript Errors

```bash
# Check TypeScript compilation
yarn tsc --noEmit

# Fix TypeScript errors
yarn tsc --noEmit --pretty
```

### Performance Issues

#### 1. Slow App Startup

- Lazy load heavy components
- Optimize bundle size
- Use code splitting

#### 2. Memory Leaks

- Clean up event listeners
- Cancel subscriptions
- Use useEffect cleanup

#### 3. Slow Navigation

- Use navigation optimizations
- Preload screens
- Optimize route transitions

---

**Last Updated**: 2025-11-13
**Version**: 1.0
**Contact**: [Development Team Email]
