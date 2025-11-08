# Hướng dẫn sử dụng Reactotron

## Cài đặt Reactotron Desktop App

1. Tải Reactotron desktop app từ: https://github.com/infinitered/reactotron/releases
2. Cài đặt và mở ứng dụng
3. Đảm bảo Reactotron đang chạy trước khi khởi động app React Native

## Cấu hình

### Android
- **Emulator**: Tự động sử dụng host `10.0.2.2` để kết nối với localhost
- **Thiết bị thật**: Cần sửa host trong `src/shared/config/reactotron.ts` thành IP thực tế của máy (VD: `192.168.1.100`)

### iOS
- **Simulator**: Sử dụng `localhost`
- **Thiết bị thật**: Cần sửa host thành IP thực tế của máy

## Sử dụng

Sau khi cấu hình xong, bạn có thể sử dụng Reactotron trong code:

```typescript
// Log thông thường
console.tron.log('Hello Reactotron');

// Log với tag
console.tron.display({
  name: 'API Request',
  value: { url: '/api/users', method: 'GET' },
});

// Log error
console.tron.error('Something went wrong', error);

// Clear timeline
console.tron.clear();
```

## Kiểm tra kết nối

1. Mở Reactotron desktop app
2. Khởi động app React Native
3. Kiểm tra console trong Reactotron - nếu thấy log "✅ Reactotron đã được khởi tạo" thì đã kết nối thành công

## Troubleshooting

### Reactotron không kết nối được

1. **Kiểm tra Reactotron desktop app đang chạy**: Đảm bảo app đang mở và sẵn sàng nhận kết nối
2. **Kiểm tra firewall**: Tắt firewall hoặc cho phép kết nối qua port mặc định (9090)
3. **Kiểm tra host**: 
   - Android emulator: Dùng `10.0.2.2`
   - iOS simulator: Dùng `localhost`
   - Thiết bị thật: Dùng IP thực tế của máy (tìm bằng `ipconfig` hoặc `ifconfig`)
4. **Kiểm tra console log**: Xem có thông báo lỗi gì không trong Metro bundler

### Lỗi "Cannot find module 'reactotron-react-native'"

Chạy lại:
```bash
yarn install
```

### Reactotron không hiển thị network requests

Kiểm tra cấu hình `networking` trong `reactotron.ts` và đảm bảo không ignore URL bạn cần.

## Lưu ý

- Reactotron chỉ hoạt động trong môi trường `__DEV__` (development)
- Trong production build, Reactotron sẽ không được include vào bundle
- Nếu không kết nối được, code vẫn chạy bình thường nhờ fallback mock object

