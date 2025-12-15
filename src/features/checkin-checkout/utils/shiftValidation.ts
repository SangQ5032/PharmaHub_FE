/**
 * Utility functions để validate thời gian checkin/checkout theo ca làm việc
 */

export type Shift = 'morning' | 'afternoon';

/**
 * Xác định ca làm việc dựa trên giờ hiện tại
 * - Ca sáng: 7:00 - 15:00
 * - Ca chiều: 15:00 - 22:00
 * - Trả về null nếu không có ca nào
 */
export const getCurrentShift = (date: Date = new Date()): Shift | null => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  const morningStart = 7 * 60; // 7:00
  const morningEnd = 15 * 60; // 15:00
  const afternoonStart = 15 * 60; // 15:00
  const afternoonEnd = 22 * 60; // 22:00

  if (timeInMinutes >= morningStart && timeInMinutes < morningEnd) {
    return 'morning';
  } else if (timeInMinutes >= afternoonStart && timeInMinutes < afternoonEnd) {
    return 'afternoon';
  }

  return null; // Không có ca nào
};

/**
 * Lấy khoảng thời gian cho phép của ca
 */
export const getShiftTimeRange = (
  shift: Shift,
): { start: number; end: number } => {
  if (shift === 'morning') {
    return { start: 7, end: 15 }; // 7h đến 15h
  } else {
    return { start: 15, end: 22 }; // 15h đến 22h
  }
};

/**
 * Kiểm tra thời gian có nằm trong khoảng cho phép của ca không
 */
export const isTimeInShiftRange = (
  date: Date,
  shift: Shift,
): { isValid: boolean; message?: string } => {
  const hour = date.getHours();
  const minute = date.getMinutes();
  const timeInMinutes = hour * 60 + minute;

  const { start, end } = getShiftTimeRange(shift);
  const startInMinutes = start * 60;
  const endInMinutes = end * 60;

  if (timeInMinutes < startInMinutes) {
    return {
      isValid: false,
      message: `Thời gian checkin không hợp lệ. Ca ${
        shift === 'morning' ? 'sáng' : 'chiều'
      } bắt đầu từ ${start}:00.`,
    };
  }

  if (timeInMinutes >= endInMinutes) {
    return {
      isValid: false,
      message: `Thời gian checkin không hợp lệ. Ca ${
        shift === 'morning' ? 'sáng' : 'chiều'
      } kết thúc lúc ${end}:00.`,
    };
  }

  return { isValid: true };
};

/**
 * Validate thời gian checkin
 * - Xác định ca dựa trên giờ checkin
 * - Kiểm tra xem thời gian có nằm trong khoảng cho phép không
 */
export const validateCheckinTime = (
  checkinTime: Date = new Date(),
): { isValid: boolean; message?: string; shift?: Shift | null } => {
  const shift = getCurrentShift(checkinTime);

  if (!shift) {
    return {
      isValid: false,
      message:
        'Hiện tại không có ca làm việc nào. Ca sáng: 7:00 - 15:00, Ca chiều: 15:00 - 22:00.',
      shift: null,
    };
  }

  const validation = isTimeInShiftRange(checkinTime, shift);

  if (!validation.isValid) {
    return {
      isValid: false,
      message: validation.message,
      shift,
    };
  }

  return {
    isValid: true,
    shift,
  };
};

/**
 * Validate thời gian checkout
 * - Lấy ca từ thời gian checkin
 * - Cho phép checkout sớm (trước giờ kết thúc ca) hoặc muộn (sau giờ kết thúc ca tối đa 1 giờ)
 * - Checkout phải sau checkin ít nhất 30 phút
 */
export const validateCheckoutTime = (
  checkinTime: Date,
  checkoutTime: Date = new Date(),
): { isValid: boolean; message?: string; shift?: Shift | null } => {
  // Xác định ca từ thời gian checkin
  const shift = getCurrentShift(checkinTime);

  if (!shift) {
    return {
      isValid: false,
      message: 'Không xác định được ca làm việc từ thời gian checkin.',
      shift: null,
    };
  }
  const { end } = getShiftTimeRange(shift);

  const checkoutHour = checkoutTime.getHours();
  const checkoutMinute = checkoutTime.getMinutes();
  const checkoutTimeInMinutes = checkoutHour * 60 + checkoutMinute;

  const endInMinutes = end * 60;

  // Checkout phải sau checkin
  const checkinTimeInMinutes =
    checkinTime.getHours() * 60 + checkinTime.getMinutes();
  if (checkoutTimeInMinutes <= checkinTimeInMinutes) {
    return {
      isValid: false,
      message: 'Thời gian checkout phải sau thời gian checkin.',
      shift,
    };
  }

  // Checkout phải sau checkin ít nhất 30 phút (để tránh checkout ngay lập tức)
  const minWorkingMinutes = 1;
  if (checkoutTimeInMinutes < checkinTimeInMinutes + minWorkingMinutes) {
    return {
      isValid: false,
      message: 'Thời gian checkout phải sau thời gian checkin ít nhất 30 phút.',
      shift,
    };
  }

  // Cho phép checkout sớm (trước giờ kết thúc ca) hoặc muộn (sau giờ kết thúc ca tối đa 1 giờ)
  // Không giới hạn checkout sớm, chỉ giới hạn checkout muộn
  const maxCheckoutInMinutes = endInMinutes + 60; // Cho phép checkout muộn nhất 1 giờ sau giờ kết thúc ca
  if (checkoutTimeInMinutes > maxCheckoutInMinutes) {
    return {
      isValid: false,
      message: `Thời gian checkout không hợp lệ. Ca ${
        shift === 'morning' ? 'sáng' : 'chiều'
      } kết thúc lúc ${end}:00. Bạn có thể checkout muộn nhất đến ${
        end + 1
      }:00.`,
      shift,
    };
  }

  return {
    isValid: true,
    shift,
  };
};

/**
 * Format thời gian để hiển thị
 */
export const formatShiftTime = (shift: Shift): string => {
  const { start, end } = getShiftTimeRange(shift);
  return `${start}:00 - ${end}:00`;
};

/**
 * Tính toán status đúng của bản ghi attendance
 * Logic:
 * - 'checked_out': checkout đúng giờ (có checkin và checkout, không muộn, không sớm)
 * - 'late': đi trễ (checkin muộn so với giờ bắt đầu ca)
 * - 'early': về sớm (checkout sớm so với giờ kết thúc ca, nhưng checkin đúng giờ)
 * - 'absent': vắng mặt (không có checkin)
 * - 'checked_in': đang làm (có checkin nhưng chưa checkout)
 */
export const calculateAttendanceStatus = (
  checkinTime: string | null,
  checkoutTime: string | null,
  shift: Shift,
  scheduledShift?: { shift: Shift } | null,
): 'checked_in' | 'checked_out' | 'late' | 'early' | 'absent' => {
  // Nếu không có checkin thì là absent
  if (!checkinTime) {
    return 'absent';
  }

  const checkin = new Date(checkinTime);
  const { start, end } = getShiftTimeRange(shift);

  // Giờ bắt đầu ca (cho phép muộn tối đa 15 phút)
  const shiftStartHour = start;
  const shiftStartMinutes = shiftStartHour * 60;
  const lateThresholdMinutes = shiftStartMinutes + 15; // Cho phép muộn 15 phút

  // Giờ kết thúc ca (cho phép về sớm tối đa 30 phút)
  const shiftEndHour = end;
  const shiftEndMinutes = shiftEndHour * 60;
  const earlyThresholdMinutes = shiftEndMinutes - 30; // Cho phép về sớm 30 phút

  // Tính thời gian checkin (phút trong ngày)
  const checkinHour = checkin.getHours();
  const checkinMinute = checkin.getMinutes();
  const checkinTimeInMinutes = checkinHour * 60 + checkinMinute;

  // Kiểm tra checkin muộn
  const isLate = checkinTimeInMinutes > lateThresholdMinutes;

  // Nếu chưa checkout
  if (!checkoutTime) {
    if (isLate) {
      return 'late';
    }
    return 'checked_in';
  }

  // Nếu đã checkout
  const checkout = new Date(checkoutTime);
  const checkoutHour = checkout.getHours();
  const checkoutMinute = checkout.getMinutes();
  const checkoutTimeInMinutes = checkoutHour * 60 + checkoutMinute;

  // Kiểm tra checkout sớm (chỉ khi checkin đúng giờ)
  const isEarly = !isLate && checkoutTimeInMinutes < earlyThresholdMinutes;

  // Xác định status cuối cùng
  if (isLate) {
    // Nếu checkin muộn thì luôn là 'late', dù checkout có sớm hay không
    return 'late';
  } else if (isEarly) {
    // Checkin đúng giờ nhưng checkout sớm
    return 'early';
  } else {
    // Checkin đúng giờ và checkout đúng giờ
    return 'checked_out';
  }
};
