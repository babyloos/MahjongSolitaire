import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore } from '../store/gameStore';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from '../utils/ads';
import { initSounds } from '../utils/sounds';
import { BG, SURFACE, ACCENT, TEXT, TEXT_DIM } from '../constants/theme';
import { t } from '../i18n';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function HomeScreen({ navigation }: Props) {
  const { start, bestSec } = useGameStore();

  function handlePlay() {
    start();
    navigation.navigate('Game');
  }

  function formatTime(sec: number): string {
    if (sec === 0) return '--:--';
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleArea}>
        <Text style={styles.titleJp}>麻雀ソリティア</Text>
        <Text style={styles.titleEn}>Mahjong Solitaire</Text>
      </View>

      <View style={styles.tilePreview}>
        {['東', '南', '西', '北', '中', '発', '白'].map((ch, i) => (
          <View key={i} style={styles.sampleTile}>
            <Text style={styles.sampleText}>{ch}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.playBtn} onPress={handlePlay} activeOpacity={0.8}>
        <Text style={styles.playBtnText}>{t.newGame}</Text>
      </TouchableOpacity>

      {bestSec > 0 && (
        <View style={styles.bestRow}>
          <Text style={styles.bestLabel}>{t.bestTime}</Text>
          <Text style={styles.bestValue}>{formatTime(bestSec)}</Text>
        </View>
      )}
      <BannerAd unitId={BANNER_AD_UNIT_ID} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titleArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleJp: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f5e6c8',
    letterSpacing: 4,
  },
  titleEn: {
    fontSize: 14,
    color: TEXT_DIM,
    marginTop: 6,
    letterSpacing: 2,
  },
  tilePreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 48,
  },
  sampleTile: {
    width: 40,
    height: 52,
    backgroundColor: '#f5f0dc',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#c8b890',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  sampleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c1a00',
  },
  playBtn: {
    backgroundColor: ACCENT,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 4,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  playBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
  },
  bestLabel: {
    color: TEXT_DIM,
    fontSize: 14,
  },
  bestValue: {
    color: TEXT,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
