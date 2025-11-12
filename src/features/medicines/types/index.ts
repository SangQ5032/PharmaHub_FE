export type Medicine = {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  unit?: string;
  price?: number;
  expiry_date?: string;
  supplier_id?: string | { [key: string]: any };
  warning_threshold?: number;
  // Thêm trường khác nếu API trả thêm
};
