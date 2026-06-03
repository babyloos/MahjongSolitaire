import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGameStore, showHint } from '../store/gameStore';
import { playSound } from '../utils/sounds';
import { loadInterstitial, showInterstitialIfReady } from '../utils/ads';
import { GameBoard } from '../components/GameBoard';
import { BG, SURFACE, ACCENT, TEXT, TEXT_DIM } from '../constants/theme';
import { t } from '../i18n';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

export function GameScreen({ navigation }: Props) {
  const { tiles, hintIds, pairsRemoved, isOver, isWon, elapsedSec, start, tap, shuffle, tick } = useGameStore();

  const levelsSinceAd = useRef(0);
  const prevWon = useRef(false);
  const prevLose = useRef(false);

  useEffect(() => { loadInterstitial(); }, []);
  useEffect(() => {
    if (isWon && !prevWon.current) {
      playSound('win');
      levelsSinceAd.current += 1;
      if (levelsSinceAd.current >= 3) { levelsSinceAd.current = 0; showInterstitialIfReady(); }
    }
    prevWon.current = isWon;
  }, [isWon]);
  useEffect(() => {
    if (isOver && !prevLose.current) playSound('error');
    prevLose.current = isOver;
  }, [isOver]);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(tick, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOver || isWon) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOver, isWon]);

  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function handleRestart() {
    if (timerRef.current) clearInterval(timerRef.current);
    start();
    timerRef.current = setInterval(tick, 1000);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'< '}{t.appName}</Text>
        </TouchableOpacity>
        <Text style={styles.timer}>{formatTime(elapsedSec)}</Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>{t.pairs}</Text>
          <Text style={styles.statValue}>{pairsRemoved} / 72</Text>
        </View>
        <TouchableOpacity style={styles.actionBtn} onPress={showHint}>
          <Text style={styles.actionText}>{t.hint}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={shuffle}>
          <Text style={styles.actionText}>{t.shuffle}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.restartBtn]} onPress={handleRestart}>
          <Text style={styles.actionText}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* Board */}
      <ScrollView
        contentContainerStyle={styles.boardContainer}
        scrollEnabled={false}
      >
        <GameBoard tiles={tiles} hintIds={hintIds} onTap={tap} />
      </ScrollView>

      {/* Game Over Modal */}
      <Modal visible={isOver} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{t.gameOver}</Text>
            <Text style={styles.modalSub}>{pairsRemoved} / 72 {t.pairs}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleRestart}>
              <Text style={styles.modalBtnText}>{t.playAgain}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtnSec} onPress={shuffle}>
              <Text style={styles.modalBtnSecText}>{t.shuffle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Win Modal */}
      <Modal visible={isWon} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={[styles.modalTitle, { color: '#ffd700' }]}>{t.youWin}</Text>
            <Text style={styles.modalSub}>{formatTime(elapsedSec)}</Text>
            <TouchableOpacity style={styles.modalBtn} onPress={handleRestart}>
              <Text style={styles.modalBtnText}>{t.playAgain}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    padding: 4,
  },
  backText: {
    color: TEXT_DIM,
    fontSize: 14,
  },
  timer: {
    color: TEXT,
    fontSize: 18,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: TEXT_DIM,
    fontSize: 11,
  },
  statValue: {
    color: TEXT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionBtn: {
    backgroundColor: SURFACE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  restartBtn: {
    backgroundColor: '#5a2000',
  },
  actionText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '600',
  },
  boardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: SURFACE,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: 280,
    gap: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ACCENT,
  },
  modalSub: {
    fontSize: 16,
    color: TEXT_DIM,
  },
  modalBtn: {
    backgroundColor: ACCENT,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBtnSec: {
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: '#5a3a1a',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnSecText: {
    color: TEXT,
    fontSize: 16,
  },
});
