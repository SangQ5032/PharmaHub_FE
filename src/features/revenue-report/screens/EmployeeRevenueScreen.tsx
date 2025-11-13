import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Header } from '@shared/components/header/Header';
import { getEmployeeRevenueById } from '../mockdata';
import { employeeRevenueStyles as styles } from '../styles';
import { formatCurrencyShort, formatFullCurrency, getInitials } from '../utils';

export default function EmployeeRevenueScreen({ route }: any) {
  const { employeeId } = route?.params || {};

  // Get employee data by ID
  const employee = getEmployeeRevenueById(employeeId);

  // If employee not found, show error
  if (!employee) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Danh sách nhân viên" showBack={true} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Không tìm thấy thông tin nhân viên
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate max revenue for chart scaling
  const maxRevenue = Math.max(...employee.dailyRevenues.map(d => d.revenue));
  const chartHeight = 150;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Danh sách nhân viên" showBack={true} />

      <ScrollView style={styles.content}>
        {/* Header Card with Employee Info */}
        <View style={styles.headerCard}>
          <View style={styles.employeeInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(employee.employeeName)}
              </Text>
            </View>
            <View style={styles.employeeDetails}>
              <Text style={styles.employeeName}>{employee.employeeName}</Text>
              <Text style={styles.employeeRole}>{employee.role}</Text>
              <Text style={styles.employeePeriod}>{employee.period}</Text>
            </View>
          </View>

          <View style={styles.revenueGrid}>
            <View style={styles.revenueGridItem}>
              <Text style={styles.revenueGridValue}>
                {formatCurrencyShort(employee.totalRevenue)}
              </Text>
              <Text style={styles.revenueGridLabel}>Doanh thu</Text>
            </View>
            <View style={styles.revenueGridItem}>
              <Text style={styles.revenueGridValue}>
                {employee.totalInvoices}
              </Text>
              <Text style={styles.revenueGridLabel}>Hóa đơn</Text>
            </View>
            <View style={styles.revenueGridItem}>
              <Text style={styles.revenueGridValue}>
                {formatCurrencyShort(employee.commission)}
              </Text>
              <Text style={styles.revenueGridLabel}>Hoa hồng</Text>
            </View>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Thống kê tổng quan</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatCurrencyShort(employee.totalRevenue)}
              </Text>
              <Text style={styles.statLabel}>Doanh thu</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{employee.totalInvoices}</Text>
              <Text style={styles.statLabel}>Hóa đơn</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{employee.achievementRate}%</Text>
              <Text style={styles.statLabel}>Hoàn thành</Text>
            </View>
          </View>
        </View>

        {/* Achievement Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Mục tiêu doanh thu</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              {formatFullCurrency(employee.totalRevenue)} /{' '}
              {formatFullCurrency(employee.targetRevenue)}
            </Text>
            <Text style={styles.progressValue}>
              {employee.achievementRate}%
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${employee.achievementRate}%` },
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>
            {employee.achievementRate}% hoàn thành
          </Text>
        </View>

        {/* Daily Revenue Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Doanh thu theo ngày</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chartScroll}
          >
            <View style={[styles.chartContent, { height: chartHeight }]}>
              {employee.dailyRevenues.map((day, index) => {
                const barHeight =
                  (day.revenue / maxRevenue) * (chartHeight - 40);
                return (
                  <View key={index} style={styles.chartBar}>
                    <View
                      style={[styles.chartBarFill, { height: barHeight }]}
                    />
                    <Text style={styles.chartBarLabel}>{day.date}</Text>
                    <Text style={styles.chartBarValue}>
                      {formatCurrencyShort(day.revenue)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Commission Details */}
        <View style={styles.commissionContainer}>
          <Text style={styles.commissionTitle}>Chi tiết hoa hồng</Text>
          <View style={styles.commissionRow}>
            <Text style={styles.commissionLabel}>Tỷ lệ hoa hồng:</Text>
            <Text style={styles.commissionValue}>
              {employee.commissionRate}%
            </Text>
          </View>
          <View style={styles.commissionRow}>
            <Text style={styles.commissionLabel}>Tổng doanh thu:</Text>
            <Text style={styles.commissionValue}>
              {formatFullCurrency(employee.totalRevenue)}
            </Text>
          </View>
          <View style={styles.commissionTotal}>
            <Text style={styles.commissionTotalLabel}>Tổng hoa hồng:</Text>
            <Text style={styles.commissionTotalValue}>
              {formatFullCurrency(employee.commission)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
