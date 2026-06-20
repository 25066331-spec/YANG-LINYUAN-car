export interface SmartCarState {
  batteryPercent: number; // 0-100
  tempSetting: number; // 16.0 - 28.0 °C
  isPreconditioning: boolean;
  preconditionProgress: number; // 0-100%
  seatVentilationLevel: number; // 0 (Off), 1, 2, 3
  seatHeatingLevel: number; // 0 (Off), 1, 2, 3
  windowDefogActive: boolean;
  cabinAcActive: boolean;
  doorLockState: 'locked' | 'unlocked' | 'scheduling';
  ambientUnderglow: 'glacier-blue' | 'silent-purple' | 'aurora-green' | 'solar-gold';
  headlightsOn: boolean;
  tireStatus: {
    frontLeft: number; // bar
    frontRight: number;
    rearLeft: number;
    rearRight: number;
  };
  openDoors: {
    trunk: boolean;
    frunk: boolean;
    leftFront: boolean;
    rightFront: boolean;
  };
  currentSentryMode: boolean;
  sentryActivityCount: number;
}

export type ScenePresetId = 'winter-morning' | 'summer-cool' | 'roadtrip' | 'sentry-active' | 'eco-conserve';

export interface ScenePreset {
  id: ScenePresetId;
  name: string;
  description: string;
  icon: string;
  stateUpdates: Partial<SmartCarState>;
}
