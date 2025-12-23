import RNPrint from 'react-native-print';
import Share from 'react-native-share';
import { Platform, Alert } from 'react-native';
import { Invoice } from '../types';

/**
 * Tạo HTML template cho hóa đơn
 */
export const generateInvoiceHTML = (invoice: Invoice): string => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ';
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Tiền mặt';
      case 'card':
        return 'Thẻ';
      case 'transfer':
        return 'Chuyển khoản';
      case 'e-wallet':
        return 'Ví điện tử';
      default:
        return method;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hóa đơn ${invoice.invoice_code}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 12px;
      color: #333;
      line-height: 1.6;
      padding: 20px;
      background: #fff;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #0066CC;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #0066CC;
      font-size: 24px;
      margin-bottom: 10px;
    }
    .header h2 {
      color: #666;
      font-size: 18px;
      font-weight: normal;
    }
    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    .info-section {
      flex: 1;
      min-width: 250px;
      margin-bottom: 20px;
    }
    .info-section h3 {
      color: #0066CC;
      font-size: 14px;
      margin-bottom: 10px;
      border-bottom: 2px solid #EEE;
      padding-bottom: 5px;
    }
    .info-row {
      margin-bottom: 8px;
      font-size: 12px;
    }
    .info-label {
      font-weight: bold;
      color: #666;
      display: inline-block;
      width: 120px;
    }
    .info-value {
      color: #333;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .items-table thead {
      background-color: #0066CC;
      color: #fff;
    }
    .items-table th {
      padding: 12px 8px;
      text-align: left;
      font-size: 12px;
      font-weight: bold;
    }
    .items-table td {
      padding: 10px 8px;
      border-bottom: 1px solid #EEE;
      font-size: 12px;
    }
    .items-table tbody tr:hover {
      background-color: #F5F5F5;
    }
    .text-right {
      text-align: right;
    }
    .text-center {
      text-align: center;
    }
    .summary {
      margin-top: 20px;
      margin-left: auto;
      width: 300px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 12px;
    }
    .summary-label {
      color: #666;
    }
    .summary-value {
      font-weight: bold;
      color: #333;
    }
    .total-row {
      border-top: 2px solid #0066CC;
      border-bottom: 2px solid #0066CC;
      padding: 12px 0;
      margin-top: 10px;
      font-size: 16px;
    }
    .total-label {
      color: #0066CC;
      font-weight: bold;
    }
    .total-value {
      color: #0066CC;
      font-weight: bold;
      font-size: 18px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #EEE;
      text-align: center;
      color: #999;
      font-size: 11px;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      background-color: #4CAF50;
      color: #fff;
    }
    .note-section {
      margin-top: 20px;
      padding: 15px;
      background-color: #F9F9F9;
      border-left: 4px solid #0066CC;
      font-size: 12px;
    }
    @media print {
      body {
        padding: 10px;
      }
      .invoice-container {
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <h1>PHARMA HUB</h1>
      <h2>HÓA ĐƠN BÁN HÀNG</h2>
    </div>

    <div class="invoice-info">
      <div class="info-section">
        <h3>Thông tin cửa hàng</h3>
        <div class="info-row">
          <span class="info-label">Tên cửa hàng:</span>
          <span class="info-value">${invoice.branch_id?.name || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Địa chỉ:</span>
          <span class="info-value">${invoice.branch_id?.address || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Số điện thoại:</span>
          <span class="info-value">${invoice.branch_id?.phone || 'N/A'}</span>
        </div>
      </div>

      <div class="info-section">
        <h3>Thông tin hóa đơn</h3>
        <div class="info-row">
          <span class="info-label">Mã hóa đơn:</span>
          <span class="info-value"><strong>${
            invoice.invoice_code
          }</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Ngày tạo:</span>
          <span class="info-value">${formatDate(invoice.createdAt)}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Trạng thái:</span>
          <span class="info-value">
            <span class="status-badge">${getStatusLabel(invoice.status)}</span>
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">Nhân viên:</span>
          <span class="info-value">${invoice.employee_id?.name || 'N/A'}</span>
        </div>
      </div>
    </div>

    <div class="invoice-info">
      <div class="info-section">
        <h3>Thông tin khách hàng</h3>
        <div class="info-row">
          <span class="info-label">Tên khách hàng:</span>
          <span class="info-value">${invoice.customer_name || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Số điện thoại:</span>
          <span class="info-value">${invoice.customer_phone || 'N/A'}</span>
        </div>
        ${
          invoice.customer_id?.address
            ? `
        <div class="info-row">
          <span class="info-label">Địa chỉ:</span>
          <span class="info-value">${invoice.customer_id.address}</span>
        </div>
        `
            : ''
        }
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 5%;">STT</th>
          <th style="width: 30%;">Tên sản phẩm</th>
          <th style="width: 15%;">Lô hàng</th>
          <th class="text-center" style="width: 10%;">Số lượng</th>
          <th class="text-right" style="width: 15%;">Đơn giá</th>
          <th class="text-right" style="width: 15%;">Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items
          .map(
            (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${item.name}</td>
          <td>${item.batch_number || 'N/A'}</td>
          <td class="text-center">${item.quantity} ${item.unit || 'cái'}</td>
          <td class="text-right">${formatCurrency(item.unit_price)}</td>
          <td class="text-right"><strong>${formatCurrency(
            item.line_total,
          )}</strong></td>
        </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-row">
        <span class="summary-label">Tổng tiền hàng:</span>
        <span class="summary-value">${formatCurrency(invoice.subtotal)}</span>
      </div>
      ${
        invoice.discount && invoice.discount > 0
          ? `
      <div class="summary-row">
        <span class="summary-label">Chiết khấu:</span>
        <span class="summary-value">-${formatCurrency(invoice.discount)}</span>
      </div>
      `
          : ''
      }
      ${
        invoice.tax_amount && invoice.tax_amount > 0
          ? `
      <div class="summary-row">
        <span class="summary-label">Thuế (${invoice.tax_rate || 0}%):</span>
        <span class="summary-value">${formatCurrency(invoice.tax_amount)}</span>
      </div>
      `
          : ''
      }
      <div class="summary-row total-row">
        <span class="total-label">TỔNG CỘNG:</span>
        <span class="total-value">${formatCurrency(invoice.total_amount)}</span>
      </div>
      <div class="summary-row" style="margin-top: 10px;">
        <span class="summary-label">Phương thức thanh toán:</span>
        <span class="summary-value">${getPaymentMethodLabel(
          invoice.payment_method,
        )}</span>
      </div>
    </div>

    ${
      invoice.note
        ? `
    <div class="note-section">
      <strong>Ghi chú:</strong> ${invoice.note}
    </div>
    `
        : ''
    }

    <div class="footer">
      <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
      <p>Hóa đơn được tạo bởi hệ thống Pharma Hub</p>
    </div>
  </div>
</body>
</html>
  `;

  return html;
};

/**
 * In hóa đơn
 */
export const printInvoice = async (invoice: Invoice): Promise<void> => {
  try {
    const html = generateInvoiceHTML(invoice);

    await RNPrint.print({
      html,
      printerURL: undefined, // Sử dụng printer mặc định
      jobName: `Hoa_don_${invoice.invoice_code}`,
    });
  } catch (error: any) {
    Alert.alert(
      'Lỗi',
      error?.message || 'Không thể in hóa đơn. Vui lòng thử lại.',
    );
    throw error;
  }
};

/**
 * Chia sẻ hóa đơn dưới dạng HTML/PDF
 */
export const shareInvoice = async (invoice: Invoice): Promise<void> => {
  try {
    const html = generateInvoiceHTML(invoice);

    // Tạo file HTML tạm thời để chia sẻ
    const shareOptions = {
      title: `Hóa đơn ${invoice.invoice_code}`,
      message: `Hóa đơn ${
        invoice.invoice_code
      } - Tổng tiền: ${invoice.total_amount.toLocaleString('vi-VN')} đ`,
      // Trên iOS, có thể share HTML trực tiếp
      // Trên Android, cần convert sang PDF hoặc share dưới dạng text
      ...(Platform.OS === 'ios'
        ? {
            url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}`,
          }
        : {
            // Android: share dưới dạng text với HTML content
            // Hoặc có thể sử dụng thư viện khác để convert HTML sang PDF
            message:
              `Hóa đơn ${invoice.invoice_code}\n\n` +
              `Khách hàng: ${invoice.customer_name}\n` +
              `Tổng tiền: ${invoice.total_amount.toLocaleString(
                'vi-VN',
              )} đ\n\n` +
              `Chi tiết hóa đơn:\n${html.substring(0, 500)}...`,
          }),
    };

    await Share.open(shareOptions);
  } catch (error: any) {
    // User có thể đã hủy share, không cần hiển thị lỗi
    if (error?.message !== 'User did not share') {
      Alert.alert(
        'Lỗi',
        error?.message || 'Không thể chia sẻ hóa đơn. Vui lòng thử lại.',
      );
    }
  }
};

/**
 * Hiển thị menu chọn in hoặc chia sẻ
 */
export const showPrintOptions = (invoice: Invoice): void => {
  Alert.alert('In/Chia sẻ hóa đơn', 'Chọn hành động bạn muốn thực hiện:', [
    {
      text: 'In hóa đơn',
      onPress: () => printInvoice(invoice),
    },
    {
      text: 'Chia sẻ',
      onPress: () => shareInvoice(invoice),
    },
    {
      text: 'Hủy',
      style: 'cancel',
    },
  ]);
};
