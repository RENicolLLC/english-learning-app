import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Text,
} from 'react-native';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, fontSize, fontWeight } from '../theme/colors';

const MOCK_LESSONS = [
  {
    id: '1',
    title: 'Basic Conversations',
    description: 'Learn everyday English conversations',
    progress: 0,
  },
  {
    id: '2',
    title: 'Grammar Fundamentals',
    description: 'Master essential English grammar rules',
    progress: 0,
  },
  {
    id: '3',
    title: 'Vocabulary Building',
    description: 'Expand your English vocabulary',
    progress: 0,
  },
];

export const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Continue your English journey</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Lessons</Text>
          {MOCK_LESSONS.map((lesson) => (
            <Card
              key={lesson.id}
              title={lesson.title}
              description={lesson.description}
              onPress={() => {
                // Navigate to lesson
                console.log('Navigate to lesson:', lesson.id);
              }}
            >
              <View style={styles.lessonFooter}>
                <Button
                  title="Continue"
                  size="small"
                  onPress={() => {
                    // Start lesson
                    console.log('Start lesson:', lesson.id);
                  }}
                />
                <Text style={styles.progress}>
                  {`${lesson.progress}% Complete`}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Practice</Text>
          <View style={styles.practiceButtons}>
            <Button
              title="Vocabulary Quiz"
              variant="secondary"
              style={styles.practiceButton}
              onPress={() => {
                console.log('Start vocabulary quiz');
              }}
            />
            <Button
              title="Speaking Practice"
              variant="outline"
              style={styles.practiceButton}
              onPress={() => {
                console.log('Start speaking practice');
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  progress: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  practiceButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  practiceButton: {
    flex: 1,
  },
}); 