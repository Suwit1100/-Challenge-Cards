/**
 * อ่านข้อความด้วย Web Speech API
 */
export function speakText(text: string, title: string): void {
  if (!("speechSynthesis" in window)) {
    console.warn("Web Speech API ไม่รองรับในเบราว์เซอร์นี้");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(`${title}. ${text}`);
  utterance.lang = "th-TH";
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  // เลือก voice ภาษาไทยถ้ามี
  const voices = window.speechSynthesis.getVoices();
  const thaiVoice = voices.find((v) => v.lang.startsWith("th"));
  if (thaiVoice) {
    utterance.voice = thaiVoice;
  } else {
    console.warn("ไม่พบเสียงภาษาไทยในระบบ");
  }

  window.speechSynthesis.speak(utterance);
}

window.speechSynthesis.onvoiceschanged = () => {
  const voices = window.speechSynthesis.getVoices();
  voices.forEach((v) => console.log(v.name, v.lang));
};

// บาง browser ต้องเรียก getVoices() หลัง load เสียงแล้ว
window.speechSynthesis.onvoiceschanged = () => {
  console.log("voices updated:", window.speechSynthesis.getVoices());
};

/**
 * หยุดเสียงทั้งหมด
 */
export function stopSpeaking(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
