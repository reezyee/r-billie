const BLUR_LEVELS = 4;
const MAX_BLUR = 2;
const VERSE_INTERVAL = 2000;

const lyrics = document.querySelector('.lyrics');
const lyricsWrapper = document.querySelector('.lyrics-wrapper');
const lyricsBg = document.querySelector('.lyrics-bg');
let currentVerseIdx = null;

function scrollLyricsToVerse(verse) {
  const scrollOffset = Math.floor(lyricsWrapper.clientHeight * 0.2);
  const versePosition = verse.offsetTop - scrollOffset;

  lyricsWrapper.scrollTop = versePosition;
}

function setVerse(verseIdx) {
  const currentVerse = lyrics.children[currentVerseIdx];
  const newVerse = lyrics.children[verseIdx];
  if (currentVerse) {
    currentVerse.classList.remove('highlight');
  }
  if (newVerse) {
    scrollLyricsToVerse(newVerse);
    newVerse.classList.add('highlight');
  }
  for (let i = 0; i < lyrics.children.length; i++) {
    const verse = lyrics.children[i];
    const dist = Math.abs(i - verseIdx);
    const blurLevel = Math.min(dist, BLUR_LEVELS);
    if (verse === newVerse) {
      verse.style = '';
    } else {
      verse.style.textShadow = `0 0 ${blurLevel}px var(--text-color)`;
    }
  }
  currentVerseIdx = verseIdx;
}

function incrementVerse(amount) {
  const newVerseIdx = Math.max(0, (currentVerseIdx + amount) % lyrics.children.length);
  setVerse(newVerseIdx);
}

setVerse(0);
setInterval(() => {
  incrementVerse(1);
}, VERSE_INTERVAL);
