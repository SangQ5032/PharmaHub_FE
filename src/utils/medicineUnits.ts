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

// MedicineUnit type mới từ API
export type MedicineUnit = {
  _id: string;
  name: string;
  short_name: string;
  ratio_to_base: number;
};

/**
 * Helper function để lấy tên đơn vị từ base_unit (có thể là object hoặc string)
 */
const getBaseUnitName = (
  baseUnit: MedicineUnit | string | undefined,
): string | null => {
  if (!baseUnit) {
    return null;
  }

  // Nếu là object (MedicineUnit)
  if (typeof baseUnit === 'object' && baseUnit !== null) {
    return baseUnit.short_name || baseUnit.name || null;
  }

  // Nếu là string
  if (typeof baseUnit === 'string') {
    return baseUnit;
  }

  return null;
};

/**
 * Lấy short_name của unit từ medicine object
 * Ưu tiên short_name từ units array, sau đó mới dùng name hoặc unit gốc
 * @param medicine - Medicine object với units array
 * @param unit - Unit name (có thể là short_name, name, hoặc key từ package_structure)
 * @returns short_name của unit (hoặc unit gốc nếu không tìm thấy)
 */
export const getUnitShortName = (
  medicine: {
    base_unit?: MedicineUnit | string;
    units?: MedicineUnit[];
    package_structure?: PackageStructure;
  },
  unit: string,
): string => {
  if (!medicine || !unit || typeof unit !== 'string') {
    return unit || '';
  }

  const normalizeUnit = (u: string | undefined | null) => {
    if (!u || typeof u !== 'string') return '';
    return u.toLowerCase().trim();
  };
  const normalizedUnit = normalizeUnit(unit);
  if (!normalizedUnit) {
    return unit;
  }

  // Tìm trong units array
  if (medicine.units && Array.isArray(medicine.units)) {
    const foundUnit = medicine.units.find(u => {
      if (!u || typeof u !== 'object') return false;
      const unitName = u.short_name || u.name || '';
      if (!unitName || typeof unitName !== 'string') return false;
      return normalizeUnit(unitName) === normalizedUnit;
    });

    if (foundUnit && foundUnit.short_name) {
      return foundUnit.short_name;
    }
  }

  // Kiểm tra base_unit
  const baseUnitName = getBaseUnitName(medicine.base_unit);
  if (baseUnitName && normalizeUnit(baseUnitName) === normalizedUnit) {
    // Nếu base_unit là object, lấy short_name
    if (typeof medicine.base_unit === 'object' && medicine.base_unit !== null) {
      return (
        medicine.base_unit.short_name || medicine.base_unit.name || baseUnitName
      );
    }
    return baseUnitName;
  }

  // Nếu không tìm thấy, trả về unit gốc
  return unit;
};

/**
 * Lấy danh sách đơn vị hợp lệ từ package_structure, base_unit và units array
 * @param medicine - Medicine object với package_structure
 * @returns Array of valid unit names
 */
export const getValidUnits = (medicine: {
  base_unit?: MedicineUnit | string;
  units?: MedicineUnit[];
  package_structure?: PackageStructure;
}): string[] => {
  if (!medicine) {
    return []; // Không có thuốc, trả về mảng rỗng
  }

  const units: string[] = [];

  // Xử lý units array (cấu trúc mới từ API)
  if (medicine.units && Array.isArray(medicine.units)) {
    medicine.units.forEach(unit => {
      if (unit && typeof unit === 'object') {
        const unitName = unit.short_name || unit.name;
        if (
          unitName &&
          typeof unitName === 'string' &&
          !units.includes(unitName)
        ) {
          units.push(unitName);
        }
      }
    });
  }

  // Lấy base_unit name
  const baseUnitName = getBaseUnitName(medicine.base_unit);
  if (baseUnitName && !units.includes(baseUnitName)) {
    units.push(baseUnitName);
  }

  // Lấy tất cả đơn vị từ package_structure (legacy)
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

  // Nếu không có đơn vị nào, trả về mảng rỗng
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
    base_unit?: MedicineUnit | string;
    units?: MedicineUnit[];
    package_structure?: PackageStructure;
  },
  unit: string,
): boolean => {
  if (!medicine || !unit || typeof unit !== 'string') {
    return false;
  }

  const validUnits = getValidUnits(medicine);
  if (!unit || typeof unit !== 'string') {
    return false;
  }
  const normalizedUnit = unit.toLowerCase().trim();

  // So sánh không phân biệt hoa thường
  return validUnits.some(
    validUnit =>
      validUnit &&
      typeof validUnit === 'string' &&
      validUnit.toLowerCase().trim() === normalizedUnit,
  );
};

/**
 * Lấy tên hiển thị của đơn vị (tiếng Việt)
 * @param unit - Unit name (box, blister, tablet, bottle, etc.) hoặc MedicineUnit object
 * @returns Vietnamese name
 */
export const getUnitDisplayName = (
  unit: string | MedicineUnit | undefined | null,
): string => {
  if (!unit) {
    return '';
  }

  // Nếu là MedicineUnit object
  if (typeof unit === 'object' && unit !== null) {
    return unit.name || unit.short_name || '';
  }

  // Nếu là string
  if (typeof unit !== 'string' || !unit) {
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
 * Lấy ratio_to_base của một đơn vị
 * Ưu tiên sử dụng unit_ratios nếu có, sau đó mới dùng ratio_to_base từ units array
 * @param medicine - Medicine object với units array và unit_ratios
 * @param unit - Unit name
 * @returns ratio_to_base của đơn vị (1 nếu là base_unit hoặc không tìm thấy)
 */
export const getUnitRatioToBase = (
  medicine: {
    base_unit?: MedicineUnit | string;
    units?: MedicineUnit[];
    unit_ratios?: { [key: string]: number };
  },
  unit: string,
): number => {
  if (!medicine || !unit) {
    return 1;
  }

  const normalizeUnit = (u: string | null | undefined) => {
    if (!u || typeof u !== 'string') return '';
    return u.toLowerCase().trim();
  };
  const normalizedUnit = normalizeUnit(unit);
  if (!normalizedUnit) {
    return 1;
  }
  const baseUnitName = getBaseUnitName(medicine.base_unit);

  // Nếu là base_unit, ratio_to_base = 1
  if (baseUnitName) {
    const normalizedBaseUnit = normalizeUnit(baseUnitName);
    if (normalizedBaseUnit && normalizedBaseUnit === normalizedUnit) {
      // Kiểm tra xem base_unit có phải là object với ratio_to_base không
      if (
        typeof medicine.base_unit === 'object' &&
        medicine.base_unit !== null
      ) {
        return medicine.base_unit.ratio_to_base || 1;
      }
      return 1;
    }
  }

  // Tìm trong units array
  if (medicine.units && Array.isArray(medicine.units)) {
    const foundUnit = medicine.units.find(u => {
      if (!u || typeof u !== 'object') return false;
      const unitName = u.short_name || u.name || '';
      if (!unitName || typeof unitName !== 'string') return false;
      return unitName.toLowerCase().trim() === normalizedUnit;
    });

    if (foundUnit) {
      // Ưu tiên sử dụng unit_ratios nếu có
      if (medicine.unit_ratios && typeof medicine.unit_ratios === 'object') {
        const ratio = medicine.unit_ratios[foundUnit._id];
        if (ratio !== undefined && ratio !== null && ratio > 0) {
          return ratio;
        }
      }

      // Fallback về ratio_to_base từ units array
      return foundUnit.ratio_to_base || 1;
    }
  }

  return 1;
};

/**
 * Tìm đơn vị ngay dưới một đơn vị (đơn vị nhỏ hơn gần nhất)
 * Sử dụng multiplier để tính chính xác hơn
 * @param medicine - Medicine object với units array
 * @param unit - Unit name
 * @returns Đơn vị ngay dưới hoặc base unit nếu không tìm thấy
 */
const getNextLowerUnit = (
  medicine: {
    base_unit?: MedicineUnit | string;
    units?: MedicineUnit[];
    package_structure?: PackageStructure;
    unit_ratios?: { [key: string]: number };
  },
  unit: string,
): string | null => {
  if (!medicine || !unit) {
    return null;
  }

  const normalizeUnit = (u: string | undefined | null) => {
    if (!u || typeof u !== 'string') return '';
    return u.toLowerCase().trim();
  };
  const normalizedUnit = normalizeUnit(unit);
  if (!normalizedUnit) {
    return null;
  }
  const baseUnitName = getBaseUnitName(medicine.base_unit);

  if (!baseUnitName) {
    return null;
  }

  const normalizedBaseUnit = normalizeUnit(baseUnitName);
  if (!normalizedBaseUnit) {
    return null;
  }

  // Nếu là base unit, không có đơn vị nhỏ hơn
  if (normalizedUnit === normalizedBaseUnit) {
    return null;
  }

  // Lấy multiplier của unit hiện tại (số base units trong 1 unit)
  const currentMultiplier = getUnitMultiplier(medicine, unit);

  if (currentMultiplier <= 1) {
    return baseUnitName;
  }

  // Lấy tất cả các đơn vị hợp lệ
  const validUnits = getValidUnits(medicine);

  // Tìm đơn vị có multiplier nhỏ hơn nhưng gần nhất với currentMultiplier
  let bestMatch: { unit: string; multiplier: number } | null = null;

  for (const validUnit of validUnits) {
    if (typeof validUnit !== 'string') continue;

    const normalizedValidUnit = normalizeUnit(validUnit);

    // Bỏ qua chính unit hiện tại
    if (normalizedValidUnit === normalizedUnit) {
      continue;
    }

    // Bỏ qua base unit (sẽ xử lý riêng)
    if (normalizedValidUnit === normalizedBaseUnit) {
      continue;
    }

    const unitMultiplier = getUnitMultiplier(medicine, validUnit);

    // Tìm đơn vị có multiplier nhỏ hơn currentMultiplier nhưng lớn nhất
    if (unitMultiplier > 0 && unitMultiplier < currentMultiplier) {
      if (!bestMatch || unitMultiplier > bestMatch.multiplier) {
        bestMatch = { unit: validUnit, multiplier: unitMultiplier };
      }
    }
  }

  // Nếu tìm thấy đơn vị phù hợp, trả về nó
  if (bestMatch) {
    return bestMatch.unit;
  }

  // Nếu không tìm thấy, trả về base unit
  return baseUnitName;
};

/**
 * Lấy thông tin hiển thị tỷ lệ chuyển đổi đơn vị
 * @param medicine - Medicine object với units array
 * @param unit - Unit name
 * @returns Chuỗi hiển thị tỷ lệ (ví dụ: "1 Hộp = 10 Vỉ" hoặc "1 Vỉ = 10 Viên") hoặc null nếu là base unit
 */
export const getUnitConversionText = (
  medicine: {
    base_unit?: MedicineUnit | string;
    units?: MedicineUnit[];
    package_structure?: PackageStructure;
    unit_ratios?: { [key: string]: number };
  },
  unit: string,
): string | null => {
  if (!medicine || !unit) {
    return null;
  }

  const baseUnitName = getBaseUnitName(medicine.base_unit);
  if (!baseUnitName) {
    return null;
  }

  const normalizeUnit = (u: string) => u.toLowerCase().trim();
  const normalizedUnit = normalizeUnit(unit);
  const normalizedBaseUnit = normalizeUnit(baseUnitName);

  // Nếu là base unit, không hiển thị tỷ lệ
  if (normalizedUnit === normalizedBaseUnit) {
    return null;
  }

  // Lấy multiplier của unit hiện tại (số base units trong 1 unit)
  const currentMultiplier = getUnitMultiplier(medicine, unit);

  if (currentMultiplier <= 1) {
    return null;
  }

  // Tìm đơn vị ngay dưới
  const nextLowerUnit = getNextLowerUnit(medicine, unit);
  if (!nextLowerUnit) {
    return null;
  }

  // Lấy multiplier của đơn vị ngay dưới
  const lowerMultiplier = getUnitMultiplier(medicine, nextLowerUnit);

  if (lowerMultiplier <= 0) {
    return null;
  }

  // Tính tỷ lệ: số đơn vị nhỏ hơn trong 1 đơn vị lớn
  const ratioToNext = currentMultiplier / lowerMultiplier;

  if (ratioToNext <= 1) {
    return null;
  }

  // Hiển thị: "1 [đơn vị lớn] = [ratio] [đơn vị nhỏ hơn]"
  const unitDisplayName = getUnitDisplayName(unit);
  const nextUnitDisplayName = getUnitDisplayName(nextLowerUnit);

  return `1 ${unitDisplayName} = ${Math.round(
    ratioToNext,
  )} ${nextUnitDisplayName}`;
};

/**
 * Tính multiplier từ đơn vị về base unit
 * @param medicine - Medicine object với package_structure
 * @param unit - Unit name
 * @returns Multiplier (số base units trong 1 unit)
 */
export const getUnitMultiplier = (
  medicine: {
    base_unit?: MedicineUnit | string;
    units?: MedicineUnit[];
    package_structure?: PackageStructure;
    unit_ratios?: { [key: string]: number };
  },
  unit: string,
): number => {
  if (!medicine || !unit) {
    return 1;
  }

  // Xử lý units array (cấu trúc mới)
  if (medicine.units && Array.isArray(medicine.units)) {
    const baseUnitName = getBaseUnitName(medicine.base_unit);
    if (baseUnitName) {
      const normalizeUnit = (u: string | undefined | null) => {
        if (!u || typeof u !== 'string') return '';
        return u.toLowerCase().trim();
      };
      const normalizedUnit = normalizeUnit(unit);
      if (!normalizedUnit) {
        return 1;
      }
      const normalizedBaseUnit = normalizeUnit(baseUnitName);

      // Nếu là base unit, multiplier = 1
      if (normalizedUnit === normalizedBaseUnit) {
        return 1;
      }

      // Tìm unit trong units array
      const foundUnit = medicine.units.find(u => {
        if (!u || typeof u !== 'object') return false;
        const unitName = u.short_name || u.name || '';
        if (!unitName || typeof unitName !== 'string') return false;
        return unitName.toLowerCase().trim() === normalizedUnit;
      });

      if (foundUnit) {
        // Ưu tiên sử dụng unit_ratios nếu có
        if (medicine.unit_ratios && typeof medicine.unit_ratios === 'object') {
          const ratio = medicine.unit_ratios[foundUnit._id];
          if (ratio !== undefined && ratio !== null && ratio > 0) {
            return ratio;
          }
        }

        // Fallback về ratio_to_base từ units array
        // ratio_to_base đã là tỷ lệ so với base unit
        // Ví dụ: nếu ratio_to_base = 10, nghĩa là 1 unit này = 10 base units
        return foundUnit.ratio_to_base || 1;
      }
    }
  }

  const baseUnitName = getBaseUnitName(medicine.base_unit);
  if (!baseUnitName) {
    return 1;
  }

  // So sánh không phân biệt hoa thường
  const normalizeUnit = (u: string | undefined | null) => {
    if (!u || typeof u !== 'string') return '';
    return u.toLowerCase().trim();
  };
  const normalizedUnit = normalizeUnit(unit);
  if (!normalizedUnit) {
    return 1;
  }
  const normalizedBaseUnit = normalizeUnit(baseUnitName);

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
      if (key && normalizeUnit(key) === currentUnit) {
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

    if (unitConfig.child && typeof unitConfig.child === 'string') {
      currentUnit = normalizeUnit(unitConfig.child);
    } else {
      break;
    }
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
    base_unit?: MedicineUnit | string;
    units?: MedicineUnit[];
    package_structure?: PackageStructure;
  },
  totalQuantityInBaseUnit: number,
): Record<string, number> => {
  if (!medicine || !totalQuantityInBaseUnit || totalQuantityInBaseUnit <= 0) {
    return {};
  }

  const baseUnitName = getBaseUnitName(medicine.base_unit) || 'tablet';
  const result: Record<string, number> = {};

  // Luôn có base unit
  result[baseUnitName] = totalQuantityInBaseUnit;

  // Tính toán cho các đơn vị khác từ units array (cấu trúc mới)
  if (medicine.units && Array.isArray(medicine.units)) {
    medicine.units.forEach(unit => {
      if (unit && typeof unit === 'object') {
        const unitName = unit.short_name || unit.name;
        if (
          unitName &&
          typeof unitName === 'string' &&
          unitName !== baseUnitName
        ) {
          const multiplier = getUnitMultiplier(medicine, unitName);
          if (multiplier > 0) {
            result[unitName] = Math.floor(totalQuantityInBaseUnit / multiplier);
          }
        }
      }
    });
  }

  // Tính toán cho các đơn vị khác từ package_structure (legacy)
  if (
    medicine.package_structure &&
    typeof medicine.package_structure === 'object'
  ) {
    const structure = medicine.package_structure;

    // Lấy tất cả các đơn vị (bao gồm cả base unit)
    const allUnits = Object.keys(structure);

    // Tính toán số lượng cho mỗi đơn vị
    allUnits.forEach(unit => {
      if (unit === baseUnitName) {
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
  base_unit?: MedicineUnit | string;
  units?: MedicineUnit[];
  package_structure?: PackageStructure;
}): string[] => {
  const units = getValidUnits(medicine);

  // Sắp xếp theo multiplier từ lớn đến nhỏ
  return units
    .filter(u => typeof u === 'string')
    .sort((a, b) => {
      const multiplierA = getUnitMultiplier(medicine, a);
      const multiplierB = getUnitMultiplier(medicine, b);
      return multiplierB - multiplierA;
    });
};
