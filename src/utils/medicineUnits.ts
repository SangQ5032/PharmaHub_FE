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
    return ['tablet']; // fallback
  }

  const units: string[] = [];
  const baseUnit = medicine.base_unit || 'tablet';

  // Luôn có base_unit
  if (!units.includes(baseUnit)) {
    units.push(baseUnit);
  }

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

  // Fallback: nếu không có package_structure, trả về 3 đơn vị mặc định (backward compatibility)
  if (units.length === 1 && units[0] === baseUnit) {
    return ['box', 'blister', 'tablet'];
  }

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
  return validUnits.includes(unit.toLowerCase());
};

/**
 * Lấy tên hiển thị của đơn vị (tiếng Việt)
 * @param unit - Unit name (box, blister, tablet, bottle, etc.)
 * @returns Vietnamese name
 */
export const getUnitDisplayName = (unit: string): string => {
  const unitMap: { [key: string]: string } = {
    box: 'Hộp',
    hop: 'Hộp',
    blister: 'Vỉ',
    vi: 'Vỉ',
    tablet: 'Viên',
    vien: 'Viên',
    bottle: 'Lọ',
    lo: 'Lọ',
    capsule: 'Viên nang',
    vial: 'Lọ',
    tube: 'Ống',
    pack: 'Gói',
  };

  return unitMap[unit.toLowerCase()] || unit;
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

  const baseUnit = medicine.base_unit || 'tablet';
  const normalizedUnit = unit.toLowerCase();

  // Nếu là base unit, multiplier = 1
  if (normalizedUnit === baseUnit || normalizedUnit === 'tablet') {
    return 1;
  }

  // Nếu không có package_structure, fallback về giá trị mặc định
  if (
    !medicine.package_structure ||
    typeof medicine.package_structure !== 'object'
  ) {
    // Fallback cho backward compatibility
    if (normalizedUnit === 'box') return 100;
    if (normalizedUnit === 'blister') return 10;
    return 1;
  }

  const structure = medicine.package_structure;
  let multiplier = 1;
  let currentUnit = normalizedUnit;

  // Navigate from requested unit down to base unit
  while (currentUnit !== baseUnit && currentUnit !== 'tablet') {
    const unitConfig = structure[currentUnit];

    if (!unitConfig || !unitConfig.contains) {
      // Không tìm thấy cấu trúc, fallback
      if (currentUnit === 'box') return 100;
      if (currentUnit === 'blister') return 10;
      return 1;
    }

    multiplier *= unitConfig.contains;
    currentUnit = unitConfig.child || baseUnit;

    if (!currentUnit) {
      currentUnit = baseUnit;
    }
  }

  return multiplier;
};
