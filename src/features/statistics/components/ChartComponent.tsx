import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { StatisticsPeriod, GroupBy } from '../types';
import { formatPeriodLabel } from '../utils/formatters';

interface ChartComponentProps {
  data: StatisticsPeriod[];
  groupBy: GroupBy;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  groupBy,
}) => {
  const screenWidth = Dimensions.get('window').width - 32;

  if (!data || data.length === 0) {
    return null;
  }

  // Prepare data for chart
  const labels = data.map(d => {
    const label = formatPeriodLabel(d.date, groupBy);
    return label && label.length > 8
      ? label.substring(0, 8) + '...'
      : label || 'N/A';
  });

  // Determine best scale for chart
  const maxRevenue = Math.max(...data.map(d => d.totalRevenue));
  let revenues = [];
  let unit = '';

  if (maxRevenue >= 1000000) {
    revenues = data.map(d => Math.round((d.totalRevenue / 1000000) * 10) / 10); // Triệu
    unit = '(Triệu)';
  } else if (maxRevenue >= 1000) {
    revenues = data.map(d => Math.round((d.totalRevenue / 1000) * 10) / 10); // Nghìn
    unit = '(Nghìn)';
  } else {
    revenues = data.map(d => d.totalRevenue);
    unit = '';
  }

  const chartData = {
    labels: labels.length > 0 ? labels : ['Không có dữ liệu'],
    datasets: [
      {
        data: revenues.length > 0 && revenues.some(r => r > 0) ? revenues : [0],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LineChart
          data={chartData}
          width={Math.max(screenWidth, labels.length * 60)}
          height={250}
          chartConfig={{
            backgroundColor: '#FFF',
            backgroundGradientFrom: '#FFF',
            backgroundGradientTo: '#FFF',
            decimalPlaces: maxRevenue >= 1000000 ? 1 : 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            style: {
              borderRadius: 8,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '2',
              stroke: '#007AFF',
            },
          }}
          bezier
          style={styles.chart}
        />
      </ScrollView>
      <View style={styles.legend}>
        <Text style={styles.legendText}>*Doanh thu {unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollContent: {
    paddingRight: 16,
  },
  chart: {
    marginVertical: 8,
    marginLeft: -20,
    borderRadius: 8,
  },
  legend: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  legendText: {
    fontSize: 10,
    color: '#999',
    fontStyle: 'italic',
  },
});
