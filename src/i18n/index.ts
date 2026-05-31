import { getLocales } from 'expo-localization';

const locale = getLocales()[0]?.languageCode ?? 'en';
const lang = locale === 'ja' ? 'ja' : locale === 'zh' ? 'zh' : 'en';

const strings = {
  en: {
    appName: 'Mahjong Solitaire',
    newGame: 'New Game',
    bestTime: 'Best Time',
    pairs: 'Pairs',
    hint: 'Hint',
    shuffle: 'Shuffle',
    gameOver: 'No more moves!',
    youWin: 'Cleared!',
    playAgain: 'Play Again',
    noHint: 'No hint available',
    time: 'Time',
    score: 'Score',
  },
  ja: {
    appName: '麻雀ソリティア',
    newGame: '新規ゲーム',
    bestTime: 'ベストタイム',
    pairs: 'ペア数',
    hint: 'ヒント',
    shuffle: 'シャッフル',
    gameOver: 'ゲームオーバー',
    youWin: 'クリア！',
    playAgain: 'もう一度',
    noHint: 'ヒントなし',
    time: '時間',
    score: 'スコア',
  },
  zh: {
    appName: '麻将接龙',
    newGame: '新游戏',
    bestTime: '最佳时间',
    pairs: '配对数',
    hint: '提示',
    shuffle: '重排',
    gameOver: '无法移动！',
    youWin: '通关！',
    playAgain: '再玩一次',
    noHint: '无提示',
    time: '时间',
    score: '分数',
  },
};

export const t = strings[lang];
