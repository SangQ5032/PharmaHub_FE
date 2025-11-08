// src/features/auth/services/phoneAuth.service.ts
import { auth } from '@config/firebase';
import { authApi } from '../api/auth.api';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

export interface PhoneAuthResult {
  success: boolean;
  error?: string;
}

export interface VerifyOTPResult {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: any;
  error?: string;
}

class PhoneAuthService {
  private confirmation: FirebaseAuthTypes.ConfirmationResult | null = null;

  /**
   * Gửi mã OTP đến số điện thoại sử dụng Firebase
   */
  async sendOTP(phoneNumber: string): Promise<PhoneAuthResult> {
    try {
      // Định dạng số điện thoại theo format Firebase (E.164)
      const formattedPhone = this.formatPhoneNumberForFirebase(phoneNumber);

      // Gửi OTP sử dụng Firebase Phone Authentication
      const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
      this.confirmation = confirmation;

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Lỗi gửi OTP:', error);
      return {
        success: false,
        error: this.getFirebaseErrorMessage(error),
      };
    }
  }

  /**
   * Xác thực mã OTP và lấy idToken để gửi lên server
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<VerifyOTPResult> {
    try {
      if (!this.confirmation) {
        return {
          success: false,
          error: 'Vui lòng gửi mã OTP trước',
        };
      }

      // Xác thực OTP với Firebase
      const userCredential = await this.confirmation.confirm(otp);

      if (!userCredential || !userCredential.user) {
        return {
          success: false,
          error: 'Không thể xác thực OTP',
        };
      }

      const user = userCredential.user;

      // Lấy idToken từ Firebase
      const idToken = await user.getIdToken();

      // Gửi idToken lên server để lấy accessToken và refreshToken
      const response = await authApi.verifyFirebaseToken({
        idToken: idToken,
      });

      if (response.success) {
        // Clear confirmation sau khi verify thành công
        this.confirmation = null;

        return {
          success: true,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
        };
      } else {
        return {
          success: false,
          error: response.message || 'Không thể xác thực với server',
        };
      }
    } catch (error: any) {
      console.error('Lỗi xác thực OTP:', error);
      return {
        success: false,
        error: this.getFirebaseErrorMessage(error),
      };
    }
  }

  /**
   * Định dạng số điện thoại theo chuẩn E.164 cho Firebase (ví dụ: +84912345678)
   */
  private formatPhoneNumberForFirebase(phoneNumber: string): string {
    // Loại bỏ khoảng trắng và ký tự đặc biệt
    let cleaned = phoneNumber.replace(/\s+/g, '').replace(/[()-]/g, '');

    // Nếu số bắt đầu bằng 0, thay bằng +84
    if (cleaned.startsWith('0')) {
      cleaned = '+84' + cleaned.substring(1);
    }
    // Nếu số bắt đầu bằng 84, thêm dấu +
    else if (cleaned.startsWith('84')) {
      cleaned = '+' + cleaned;
    }
    // Nếu số chưa có mã quốc gia, thêm +84
    else if (!cleaned.startsWith('+')) {
      cleaned = '+84' + cleaned;
    }
    // Nếu đã có dấu + nhưng chưa có mã quốc gia
    else if (cleaned.startsWith('+') && !cleaned.startsWith('+84')) {
      // Giả định là số Việt Nam nếu không có mã quốc gia
      if (cleaned.length <= 10) {
        cleaned = '+84' + cleaned.substring(1);
      }
    }

    return cleaned;
  }

  /**
   * Chuyển đổi lỗi Firebase sang thông báo tiếng Việt
   */
  private getFirebaseErrorMessage(error: any): string {
    const code = error?.code;

    switch (code) {
      case 'auth/invalid-phone-number':
        return 'Số điện thoại không hợp lệ';
      case 'auth/too-many-requests':
        return 'Quá nhiều yêu cầu. Vui lòng thử lại sau';
      case 'auth/invalid-verification-code':
        return 'Mã OTP không đúng';
      case 'auth/session-expired':
        return 'Phiên đăng nhập đã hết hạn. Vui lòng gửi lại mã OTP';
      case 'auth/code-expired':
        return 'Mã OTP đã hết hạn. Vui lòng gửi lại mã mới';
      case 'auth/quota-exceeded':
        return 'Đã vượt quá giới hạn. Vui lòng thử lại sau';
      case 'auth/network-request-failed':
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối';
      default:
        return error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại';
    }
  }

  /**
   * Reset session (dùng khi người dùng muốn thay đổi số điện thoại)
   */
  resetSession(): void {
    this.confirmation = null;
  }
}

export const phoneAuthService = new PhoneAuthService();
