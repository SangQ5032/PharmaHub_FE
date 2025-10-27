<!-- authApi — định nghĩa endpoint /auth/login

authSlice — nơi lưu token sau login

useLogin hook — gọi API + dispatch token

LoginScreen — UI gọi useLogin -->

Diễn giải cấu trúc thư mục
1) app/

navigation/ → Điều hướng chính của app (AppNavigator.tsx dùng React Navigation).

hooks/

useAppDispatch.ts → hook wrapper để dùng dispatch typed của Redux Toolkit.

store/

index.ts → cấu hình Redux store (thường combine các slice, add middleware,...).

2) features/

Một module theo domain. Ví dụ auth/ chứa tất cả thứ liên quan đến đăng nhập.

features/auth/

slice/authSlice.ts
→ Redux slice quản lý state auth (token, user, loading,...)

screens/LoginScreen.tsx
→ UI của màn hình login.

api/authApi.ts
→ gọi API login/refresh token...

api/hooks/useLogin.ts
→ custom hook để gọi login dễ dùng trong UI

types.ts
→ kiểu của User, LoginPayload...

components/
→ có thể chứa form, header riêng cho auth (hiện chưa có file)

features/checkin/

(chưa thấy file con → dự định sẽ có slice / screens / api...)

3) shared/

Chứa các phần dùng chung giữa nhiều feature.

types/api.ts → kiểu response chung

config/reactotron.ts → config Reactotron để debug

constants/routes.ts → tập trung định nghĩa tên route để tránh hardcode

utils/ → helper (chưa thấy file cụ thể)

components/ → UI shared (input, button,...)

input/Input.tsx

button/Button.tsx

services/api.ts → setup base axios/fetch instance dùng toàn app

assets/ → icon, ảnh,...

Ví dụ luồng api call login
User            LoginScreen           useLogin Hook         authApi           Redux Slice        Store/UI
 |                   |                     |                   |                  |               |
 | --- tap Login --->|                     |                   |                  |               |
 |                   | --- call useLogin -------------------->|                  |               |
 |                   |                     |--- call loginApi ---------->        |               |
 |                   |                     |                   |--- HTTP ---> Backend API
 |                   |                     |                   |<-- JSON ---|
 |                   |                     |<-- success data --|                  |               |
 |                   |                     |---- dispatch(setAuth) -------------->|               |
 |                   |                     |                                       |-- update --> UI re-render
 |<-- navigate or show success ------------|                     |                  |               |
