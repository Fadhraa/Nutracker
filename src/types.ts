/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulation' | 'Luteal';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number; // kg
  height: number; // cm

}

export interface DailyLog {
  date: string;
  mood: number; // 1-5
  stressLevel: number; // 1-5
  symptoms: string[];
  caloriesConsumed: number;
  waterIntake: number; // ml
}

export interface CycleData {
  lastPeriodDate: string;
  cycleLength: number; // default 28
  periodLength: number; // default 5
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  phaseSuitability: CyclePhase[];
  ingredients: string[];
  steps: string[];
  type: 'Morning' | 'Noon' | 'Night' | 'Snack';
}
