/**
 * Helper functions for medicine units
 * Hỗ trợ làm việc với đơn vị thuốc linh hoạt dựa trên package_structure
 */

export type PackageStructure = {
  [key: string]: {
    contains: number;
    child: string | null;
  };
};

/**
 * Lấy danh sách đơn vị hợp lệ từ package_structure và base_unit
 * @param medicine - Medicine object với package_structure
 * @returns Array of valid unit names
 */
export const getValidUnits = (medicine: {
  base_unit?: string;
  package_structure?: PackageStructure;
}): string[] => {
  if (!medicine) {
    return []; // Không có thuốc, trả về mảng rỗng
  }

  const units: string[] = [];
  const baseUnit = medicine.base_unit;

  // Lấy tất cả đơn vị từ package_structure
  if (
    medicine.package_structure &&
    typeof medicine.package_structure === 'object'
  ) {
    Object.keys(medicine.package_structure).forEach(unit => {
      if (!units.includes(unit)) {
        units.push(unit);
      }
    });
  }

  // Nếu có base_unit và chưa có trong danh sách, thêm vào
  if (baseUnit && !units.includes(baseUnit)) {
    units.push(baseUnit);
  }

  // Nếu không có đơn vị nào, trả về mảng rỗng thay vì fallback hardcode
  return units;
};

/**
 * Kiểm tra đơn vị có hợp lệ không dựa trên package_structure
 * @param medicine - Medicine object với package_structure
 * @param unit - Unit name to validate
 * @returns True if unit is valid
 */
export const isValidUnit = (
  medicine: {
    base_unit?: string;
    package_structure?: PackageStructure;
  },
  unit: string,
): boolean => {
  if (!medicine || !unit || typeof unit !== 'string') {
    return false;
  }

  const validUnits = getValidUnits(medicine);
  const normalizedUnit = unit.toLowerCase().trim();

  // So sánh không phân biệt hoa thường
  return validUnits.some(
    validUnit => validUnit.toLowerCase().trim() === normalizedUnit,
  );
};

/**
 * Lấy tên hiển thị của đơn vị (tiếng Việt)
 * @param unit - Unit name (box, blister, tablet, bottle, etc.)
 * @returns Vietnamese name
 */
export const getUnitDisplayName = (unit: string): string => {
  if (!unit) {
    return '';
  }

  const normalizedUnit = unit.toLowerCase().trim();

  const unitMap: { [key: string]: string } = {
    // Tiếng Anh
    box: 'Hộp',
    blister: 'Vỉ',
    tablet: 'Viên',
    bottle: 'Lọ',
    capsule: 'Viên nang',
    vial: 'Lọ',
    tube: 'Ống',
    pack: 'Gói',
    package: 'Gói',
    // Tiếng Việt - viết thường
    hop: 'Hộp',
    vi: 'Vỉ',
    vien: 'Viên',
    lo: 'Lọ',
    goi: 'Gói',
    // Tiếng Việt - có dấu
    hộp: 'Hộp',
    vỉ: 'Vỉ',
    viên: 'Viên',
    lọ: 'Lọ',
    gói: 'Gói',
    ống: 'Ống',
  };

  // Nếu đơn vị đã là tiếng Việt có dấu và viết hoa chữ cái đầu, trả về như cũ
  if (unitMap[normalizedUnit]) {
    return unitMap[normalizedUnit];
  }

  // Nếu không tìm thấy trong map, kiểm tra xem có phải là tiếng Việt không
  // Nếu đơn vị đã viết hoa chữ cái đầu và có dấu, có thể đã là tên hiển thị
  if (
    unit[0] === unit[0].toUpperCase() &&
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(
      unit,
    )
  ) {
    return unit;
  }

  // Fallback: trả về unit gốc với chữ cái đầu viết hoa
  return unit.charAt(0).toUpperCase() + unit.slice(1);
};

/**
 * Tính multiplier từ đơn vị về base unit
 * @param medicine - Medicine object với package_structure
 * @param unit - Unit name
 * @returns Multiplier (số base units trong 1 unit)
 */
export const getUnitMultiplier = (
  medicine: {
    base_unit?: string;
    package_structure?: PackageStructure;
  },
  unit: string,
): number => {
  if (!medicine || !unit) {
    return 1;
  }

  const baseUnit = medicine.base_unit;
  if (!baseUnit) {
    return 1;
  }

  // So sánh không phân biệt hoa thường
  const normalizeUnit = (u: string) => u.toLowerCase().trim();
  const normalizedUnit = normalizeUnit(unit);
  const normalizedBaseUnit = normalizeUnit(baseUnit);

  // Nếu là base unit, multiplier = 1
  if (normalizedUnit === normalizedBaseUnit) {
    return 1;
  }

  // Nếu không có package_structure, không thể tính được
  if (
    !medicine.package_structure ||
    typeof medicine.package_structure !== 'object'
  ) {
    return 1;
  }

  const structure = medicine.package_structure;
  let multiplier = 1;
  let currentUnit = normalizedUnit;
  const visited = new Set<string>(); // Tránh vòng lặp vô hạn

  // Navigate from requested unit down to base unit
  while (
    currentUnit &&
    currentUnit !== normalizedBaseUnit &&
    !visited.has(currentUnit)
  ) {
    visited.add(currentUnit);

    // Tìm key trong structure (không phân biệt hoa thường)
    let unitKey: string | undefined;
    for (const key of Object.keys(structure)) {
      if (normalizeUnit(key) === currentUnit) {
        unitKey = key;
        break;
      }
    }

    if (!unitKey) {
      // Không tìm thấy đơn vị trong structure
      return 1;
    }

    const unitConfig = structure[unitKey];
    if (!unitConfig || !unitConfig.contains || unitConfig.contains <= 0) {
      return 1;
    }

    multiplier *= unitConfig.contains;

    if (!unitConfig.child) {
      // Đã đến đơn vị cuối cùng
      break;
    }

    currentUnit = normalizeUnit(unitConfig.child);
  }

  return multiplier;
};

/**
 * Tính toán số lượng tồn kho theo từng đơn vị từ package_structure
 * @param medicine - Medicine object với package_structure
 * @param totalQuantityInBaseUnit - Tổng số lượng tồn kho ở đơn vị base
 * @returns Object chứa số lượng theo từng đơn vị
 */
export const calculateQuantitiesByUnit = (
  medicine: {
    base_unit?: string;
    package_structure?: PackageStructure;
  },
  totalQuantityInBaseUnit: number,
): Record<string, number> => {
  if (!medicine || !totalQuantityInBaseUnit || totalQuantityInBaseUnit <= 0) {
    return {};
  }

  const baseUnit = medicine.base_unit || 'tablet';
  const result: Record<string, number> = {};

  // Luôn có base unit
  result[baseUnit] = totalQuantityInBaseUnit;

  // Tính toán cho các đơn vị khác từ package_structure
  if (
    medicine.package_structure &&
    typeof medicine.package_structure === 'object'
  ) {
    const structure = medicine.package_structure;

    // Lấy tất cả các đơn vị (bao gồm cả base unit)
    const allUnits = Object.keys(structure);

    // Tính toán số lượng cho mỗi đơn vị
    allUnits.forEach(unit => {
      if (unit === baseUnit) {
        // Base unit đã được set ở trên
        return;
      }
      const multiplier = getUnitMultiplier(medicine, unit);
      if (multiplier > 0) {
        result[unit] = Math.floor(totalQuantityInBaseUnit / multiplier);
      }
    });
  }

  return result;
};

/**
 * Sắp xếp các đơn vị theo thứ tự từ lớn đến nhỏ dựa trên multiplier
 * @param medicine - Medicine object với package_structure
 * @returns Array of units sorted from largest to smallest
 */
export const getSortedUnits = (medicine: {
  base_unit?: string;
  package_structure?: PackageStructure;
}): string[] => {
  const units = getValidUnits(medicine);

  // Sắp xếp theo multiplier từ lớn đến nhỏ
  return units.sort((a, b) => {
    const multiplierA = getUnitMultiplier(medicine, a);
    const multiplierB = getUnitMultiplier(medicine, b);
    return multiplierB - multiplierA;
  });
};
