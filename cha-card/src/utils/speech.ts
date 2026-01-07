/**
 * อ่านข้อความด้วย Web Speech API
 */
export function speakText(text: string, title: string): void {
  if (!("speechSynthesis" in window)) {
    console.warn("Web Speech API ไม่รองรับในเบราว์เซอร์นี้");
    return;
  }

  // ยกเลิกเสียงเก่าก่อน
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(`${title}. ${text}`);
  utterance.lang = "th-TH";
  utterance.rate = 0.9; // ความเร็วในการพูด
  utterance.pitch = 1.0; // ระดับเสียง

  window.speechSynthesis.speak(utterance);
}

/**
 * หยุดเสียงทั้งหมด
 */
export function stopSpeaking(): void {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
