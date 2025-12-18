# PharmaHub_FE

Ứng dụng **mobile React Native** cho PharmaHub (Front-end).

## Công nghệ sử dụng

- **React Native**: `0.80.1`
- **React**: `19.1.0`
- **TypeScript**
- **Điều hướng**: `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs`
- **Gọi API**: `axios`
- **Quản lý server-state/cache**: `@tanstack/react-query`
- **State management**: `zustand`
- **UI**: `react-native-paper`
- **Firebase**: `@react-native-firebase/app`, `@react-native-firebase/auth`
- **Test**: `jest` (preset `react-native`)
- **Lint/Format**: `eslint`, `prettier`
- **Git hooks**: `husky` + `lint-staged`

## Yêu cầu môi trường

- **Node.js**: `>= 18`
- **Yarn**: dự án **bắt buộc dùng Yarn** ()
- **Android**:
  - Android Studio + Android SDK, thiết bị/emulator
  - JDK theo hướng dẫn React Native (khuyến nghị theo bộ cài Android Studio)
- **iOS (macOS)**:
  - Xcode
  - CocoaPods (trong repo đang dùng **1.15.2** theo `ios/Podfile.lock`)

## Cài đặt

```bash
cd /Users/nguyentung/Desktop/PharmaHub_FE
yarn install
```

## Chạy dự án

### Chạy Metro (bundler)

Mở 1 terminal:

```bash
yarn start
```

### Chạy Android

Mở terminal khác (hoặc sau khi đã chạy `yarn start`):

```bash
yarn android
```

> Lưu ý: Android emulator truy cập máy host qua `10.0.2.2` (không phải `localhost`).

### Chạy iOS

Cài Pods (thường chỉ cần lần đầu hoặc khi đổi native deps):

```bash
cd ios
pod install
cd ..
```

Chạy iOS:

```bash
yarn ios
```

## Cấu hình API

Base URL hiện đang được cấu hình trong:
- `src/shared/config/api.ts`

Mặc định:
- Android emulator: `http://10.0.2.2:8080/api`
- iOS simulator: `http://localhost:8080/api`

Nếu chạy trên **thiết bị thật**, bạn cần đổi sang **IP thật** của máy tính (VD: `http://192.168.1.100:8080/api`).

## Firebase

Firebase được khởi tạo tự động từ file cấu hình native:
- **Android**: `android/app/google-services.json`
- **iOS**: `ios/.../GoogleService-Info.plist` (cần có trong Xcode project)

Wrapper hiện có ở:
- `src/config/firebase/index.ts`

## Lệnh hữu ích

```bash
# chạy test
yarn test

# lint
yarn lint
```

## Cấu trúc thư mục (tóm tắt)

- `src/app`: app shell (navigation, providers, query client, ...)
- `src/features`: các module theo feature (auth, sales, warehouse, payroll, ...)
- `src/shared`: thành phần dùng chung (components, config, hooks, services, types, utils)

## Ghi chú

- Nếu bạn gặp lỗi build iOS sau khi cài thư viện native, thử:
  - `cd ios && pod install --repo-update && cd ..`
- Nếu Android không chạy được, kiểm tra:
  - emulator/device đã bật
  - Android SDK/JDK đúng theo môi trường React Native


