import React from 'react';
import { Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface FilterChipsProps {
  filters: Array<{
    value: string;
    label: string;
  }>;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedValue,
  onSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map(filter => {
        const isSelected = selectedValue === filter.value;
        return (
          <TouchableOpacity
            key={filter.value}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onSelect(filter.value)}
          >
            <Text
              style={[styles.chipText, isSelected && styles.chipTextSelected]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  contentContainer: {
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  chipSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFF',
  },
});
