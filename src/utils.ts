import { MessageType } from "./types";

const getMessageType = (data: number[]): MessageType => {
  //@ts-ignore
  return dict[data[0]] as MessageType;
  //     return "Pitch Bend";
  //     break;
  //   case 0xd0:
  //     return "Channel Pressure";
  //     break;
  //   default:
  //     break;
  // }
  // return "NoteOn";
};
export { getMessageType };

export const isNoteOn = (data: number[]) => {
  const notOnArr = [
    0x90, 0x91, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0x9b,
    0x9c, 0x9d, 0x9e, 0x9f,
  ];
  return notOnArr.includes(data[0]);
};

export const isNoteOff = (data: number[]) => {
  const notOffArr = [
    0x81, 0x80, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x8b,
    0x8c, 0x8d, 0x8e, 0x8f,
  ];
  return notOffArr.includes(data[0]);
};

export const isNote = (data: number[]): boolean => {
  if (isNoteOff(data)) {
    return true;
  }

  if (isNoteOn(data)) {
    return true;
  }

  return false;
};

const dict = {
  0x81: "CHAN 2 NOTE OFF",
  0x80: "CHAN 1 NOTE OFF",
  0x82: "CHAN 3 NOTE OFF",
  0x83: "CHAN 4 NOTE OFF",
  0x84: "CHAN 5 NOTE OFF",
  0x85: "CHAN 6 NOTE OFF",
  0x86: "CHAN 7 NOTE OFF",
  0x87: "CHAN 8 NOTE OFF",
  0x88: "CHAN 9 NOTE OFF",
  0x89: "CHAN 10 NOTE OFF",
  0x8a: "CHAN 11 NOTE OFF",
  0x8b: "CHAN 12 NOTE OFF",
  0x8c: "CHAN 13 NOTE OFF",
  0x8d: "CHAN 14 NOTE OFF",
  0x8e: "CHAN 15 NOTE OFF",
  0x8f: "CHAN 16 NOTE OFF",
  0x90: "CHAN 1 NOTE ON",
  0x91: "CHAN 2 NOTE ON",
  0x92: "CHAN 3 NOTE ON",
  0x93: "CHAN 4 NOTE ON",
  0x94: "CHAN 5 NOTE ON",
  0x95: "CHAN 6 NOTE ON",
  0x96: "CHAN 7 NOTE ON",
  0x97: "CHAN 8 NOTE ON",
  0x98: "CHAN 9 NOTE ON",
  0x99: "CHAN 10 NOTE ON",
  0x9a: "CHAN 11 NOTE ON",
  0x9b: "CHAN 12 NOTE ON",
  0x9c: "CHAN 13 NOTE ON",
  0x9d: "CHAN 14 NOTE ON",
  0x9e: "CHAN 15 NOTE ON",
  0x9f: "CHAN 16 NOTE ON",
  0xa0: "CHAN 1 POLYPHONIC AFTERTOUCH",
  0xa1: "CHAN 2 POLYPHONIC AFTERTOUCH",
  0xa2: "CHAN 3 POLYPHONIC AFTERTOUCH",
  0xa3: "CHAN 4 POLYPHONIC AFTERTOUCH",
  0xa4: "CHAN 5 POLYPHONIC AFTERTOUCH",
  0xa5: "CHAN 6 POLYPHONIC AFTERTOUCH",
  0xa6: "CHAN 7 POLYPHONIC AFTERTOUCH",
  0xa7: "CHAN 8 POLYPHONIC AFTERTOUCH",
  0xa8: "CHAN 9 POLYPHONIC AFTERTOUCH",
  0xa9: "CHAN 10 POLYPHONIC AFTERTOUCH",
  0xaa: "CHAN 11 POLYPHONIC AFTERTOUCH",
  0xab: "CHAN 12 POLYPHONIC AFTERTOUCH",
  0xac: "CHAN 13 POLYPHONIC AFTERTOUCH",
  0xad: "CHAN 14 POLYPHONIC AFTERTOUCH",
  0xae: "CHAN 15 POLYPHONIC AFTERTOUCH",
  0xaf: "CHAN 16 POLYPHONIC AFTERTOUCH",
  0xb0: "CHAN 1 CONTROL MODE",
  0xb1: "CHAN 2 CONTROL MODE",
  0xb2: "CHAN 3 CONTROL MODE",
  0xb3: "CHAN 4 CONTROL MODE",
  0xb4: "CHAN 5 CONTROL MODE",
  0xb5: "CHAN 6 CONTROL MODE",
  0xb6: "CHAN 7 CONTROL MODE",
  0xb7: "CHAN 8 CONTROL MODE",
  0xb8: "CHAN 9 CONTROL MODE",
  0xb9: "CHAN 10 CONTROL MODE",
  0xba: "CHAN 11 CONTROL MODE",
  0xbb: "CHAN 12 CONTROL MODE",
  0xbc: "CHAN 13 CONTROL MODE",
  0xbd: "CHAN 14 CONTROL MODE",
  0xbe: "CHAN 15 CONTROL MODE",
  0xbf: "CHAN 16 CONTROL MODE",
  0xc0: "CHAN 1 PROGRAM CHANGE",
  0xc1: "CHAN 2 PROGRAM CHANGE",
  0xc2: "CHAN 3 PROGRAM CHANGE",
  0xc3: "CHAN 4 PROGRAM CHANGE",
  0xc4: "CHAN 5 PROGRAM CHANGE",
  0xc5: "CHAN 6 PROGRAM CHANGE",
  0xc6: "CHAN 7 PROGRAM CHANGE",
  0xc7: "CHAN 8 PROGRAM CHANGE",
  0xc8: "CHAN 9 PROGRAM CHANGE",
  0xc9: "CHAN 10 PROGRAM CHANGE",
  0xca: "CHAN 11 PROGRAM CHANGE",
  0xcb: "CHAN 12 PROGRAM CHANGE",
  0xcc: "CHAN 13 PROGRAM CHANGE",
  0xcd: "CHAN 14 PROGRAM CHANGE",
  0xce: "CHAN 15 PROGRAM CHANGE",
  0xcf: "CHAN 16 PROGRAM CHANGE",
  0xd0: "CHAN 1 CHANNEL AFTERTOUCH",
  0xd1: "CHAN 2 CHANNEL AFTERTOUCH",
  0xd2: "CHAN 3 CHANNEL AFTERTOUCH",
  0xd3: "CHAN 4 CHANNEL AFTERTOUCH",
  0xd4: "CHAN 5 CHANNEL AFTERTOUCH",
  0xd5: "CHAN 6 CHANNEL AFTERTOUCH",
  0xd6: "CHAN 7 CHANNEL AFTERTOUCH",
  0xd7: "CHAN 8 CHANNEL AFTERTOUCH",
  0xd8: "CHAN 9 CHANNEL AFTERTOUCH",
  0xd9: "CHAN 10 CHANNEL AFTERTOUCH",
  0xda: "CHAN 11 CHANNEL AFTERTOUCH",
  0xdb: "CHAN 12 CHANNEL AFTERTOUCH",
  0xdc: "CHAN 13 CHANNEL AFTERTOUCH",
  0xdd: "CHAN 14 CHANNEL AFTERTOUCH",
  0xde: "CHAN 15 CHANNEL AFTERTOUCH",
  0xdf: "CHAN 16 CHANNEL AFTERTOUCH",
  0xe0: "CHAN 1 PITCH WHEEL",
  0xe1: "CHAN 2 PITCH WHEEL",
  0xe2: "CHAN 3 PITCH WHEEL",
  0xe3: "CHAN 4 PITCH WHEEL",
  0xe4: "CHAN 5 PITCH WHEEL",
  0xe5: "CHAN 6 PITCH WHEEL",
  0xe6: "CHAN 7 PITCH WHEEL",
  0xe7: "CHAN 8 PITCH WHEEL",
  0xe8: "CHAN 9 PITCH WHEEL",
  0xe9: "CHAN 10 PITCH WHEEL",
  0xea: "CHAN 11 PITCH WHEEL",
  0xeb: "CHAN 12 PITCH WHEEL",
  0xec: "CHAN 13 PITCH WHEEL",
  0xed: "CHAN 14 PITCH WHEEL",
  0xee: "CHAN 15 PITCH WHEEL",
  0xef: "CHAN 16 PITCH WHEEL",
  0xf0: "SYSTEM EXCLUSIVE",
  0xf1: "SYSTEM COMMON",
  0xf2: "SYS COM SONG POSITION",
  0xf3: "SYS COM SONG SELECT",
  0xf4: "SYSTEM COMMON - UNDEFINED",
  0xf5: "SYSTEM COMMON - UNDEFINED",
  0xf6: "SYS COM TUNE REQUEST",
  0xf7: "SYS COM-END OF",
  0xf8: "SYS REAL TIME TIMING",
  0xf9: "SYS REAL TIME UNDEFINED",
  0xfa: "SYS REAL TIME START",
  0xfb: "SYS REAL TIME CONTINUE",
  0xfc: "SYS REAL TIME STOP",
  0xfd: "SYS REAL TIME UNDEFINED",
  0xfe: "SYS REAL TIME ACTIVE",
  0xff: "SYS REAL TIME SYS",
};

const noteNamesDict = {
  0: 'C-1',
  1: 'C#-1',
  2: 'D-1',
  3: 'D#-1/Eb-1',
  4: 'E-1',
  5: 'F-1',
  6: 'F#-1/Gb-1',
  7: 'G-1',
  8: 'G#-1/Ab-1',
  9: 'A-1',
  10: 'A#-1/Bb-1',
  11: 'B-1',
  12: 'C0',
  13: 'C#0/Db0',
  14: 'D0',
  15: 'D#0/Eb0',
  16: 'E0',
  17: 'F0',
  18: 'F#0/Gb0',
  19: 'G0',
  20: 'G#0/Ab0',
  21: 'A0',
  22: "A#0/Bb0",
  23: "B0",
  24: "C1",
  25: "C#1/Db1",
  26: "D1",
  27: "D#1/Eb1",
  28: "E1",
  29: "F1",
  30: "F#1/Gb1",
  31: "G1",
  32: "G#1/Ab1",
  33: "A1",
  34: "A#1/Bb1",
  35: "B1",
  36: "C2",
  37: "C#2/Db2",
  38: "D2",
  39: "D#2/Eb2",
  40: "E2",
  41: "F2",
  42: "F#2/Gb2",
  43: "G2",
  44: "G#2/Ab2",
  45: "A2",
  46: "A#2/Bb2",
  47: "B2",
  48: "C3",
  49: "C#3/Db3",
  50: "D3",
  51: "D#3/Eb3",
  52: "E3",
  53: "F3",
  54: "F#3/Gb3",
  55: "G3",
  56: "G#3/Ab3",
  57: "A3",
  58: "A#3/Bb3",
  59: "B3",
  60: "C4",
  61: "C#4/Db4",
  62: "D4",
  63: "D#4/Eb4",
  64: "E4",
  65: "F4",
  66: "F#4/Gb4",
  67: "G4",
  68: "G#4/Ab4",
  69: "A4",
  70: "A#4/Bb4",
  71: "B4",
  72: "C5",
  73: "C#5/Db5",
  74: "D5",
  75: "D#5/Eb5",
  76: "E5",
  77: "F5",
  78: "F#5/Gb5",
  79: "G5",
  80: "G#5/Ab5",
  81: "A5",
  82: "A#5/Bb5",
  83: "B5",
  84: "C6",
  85: "C#6/Db6",
  86: "D6",
  87: "D#6/Eb6",
  88: "E6",
  89: "F6",
  90: "F#6/Gb6",
  91: "G6",
  92: "G#6/Ab6",
  93: "A6",
  94: "A#6/Bb6",
  95: "B6",
  96: "C7",
  97: "C#7/Db7",
  98: "D7",
  99: "D#7/Eb7",
  100: "E7",
  101: "F7",
  102: "F#7/Gb7",
  103: "G7",
  104: "G#7/Ab7",
  105: "A7",
  106: "A#7/Bb7",
  107: "B7",
  108: "C8",
  109: "C#8/Db8",
  110: "D8",
  111: "D#8/Eb8",
  112: "E8",
  113: "F8",
  114: "F#8/Gb8",
  115: "G8",
  116: "G#8/Ab8",
  117: "A8",
  118: "A#8/Bb8",
  119: "B8",
  120: "C9",
  121: "C#9/Db9",
  122: "D9",
  123: "D#9/Eb9",
  124: "E9",
  125: "F9",
  126: "F#9/Gb9",
  127: "G9",
};

export function getNoteEnglishName(noteData: number[]): string | undefined {
  //@ts-ignore
  return noteNamesDict[noteData[1]];
}

export function clamp(input: number, min: number, max: number): number {
  return input < min ? min : input > max ? max : input;
}

export function map(
  current: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
): number {
  const mapped: number =
    ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

export function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
// 0x81,Chan 2 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x80,Chan 1 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x82,Chan 3 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x83,Chan 4 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x84,Chan 5 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x85,Chan 6 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x86,Chan 7 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x87,Chan 8 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x88,Chan 9 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x89,Chan 10 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x8A,Chan 11 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x8B,Chan 12 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x8C,Chan 13 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x8D,Chan 14 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x8E,Chan 15 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x8F,Chan 16 Note Off,Note Number (0-127),Note Velocity (0-127)
// 0x90,Chan 1 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x91,Chan 2 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x92,Chan 3 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x93,Chan 4 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x94,Chan 5 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x95,Chan 6 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x96,Chan 7 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x97,Chan 8 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x98,Chan 9 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x99,Chan 10 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x9A,Chan 11 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x9B,Chan 12 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x9C,Chan 13 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x9D,Chan 14 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x9E,Chan 15 Note On,Note Number (0-127),Note Velocity (0-127)
// 0x9F,Chan 16 Note On,Note Number (0-127),Note Velocity (0-127)
// 0xA0,Chan 1 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA1,Chan 2 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA2,Chan 3 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA3,Chan 4 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA4,Chan 5 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA5,Chan 6 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA6,Chan 7 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA7,Chan 8 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA8,Chan 9 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xA9,Chan 10 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xAA,Chan 11 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xAB,Chan 12 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xAC,Chan 13 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xAD,Chan 14 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xAE,Chan 15 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xAF,Chan 16 Polyphonic Aftertouch,Note Number (0-127),Aftertouch pressure (0-127)
// 0xB0,Chan 1 Control Mode change,See MIDI controls,See MIDI controls
// 0xB1,Chan 2 Control Mode change,See MIDI controls,See MIDI controls
// 0xB2,Chan 3 Control Mode change,See MIDI controls,See MIDI controls
// 0xB3,Chan 4 Control Mode change,See MIDI controls,See MIDI controls
// 0xB4,Chan 5 Control Mode change,See MIDI controls,See MIDI controls
// 0xB5,Chan 6 Control Mode change,See MIDI controls,See MIDI controls
// 0xB6,Chan 7 Control Mode change,See MIDI controls,See MIDI controls
// 0xB7,Chan 8 Control Mode change,See MIDI controls,See MIDI controls
// 0xB8,Chan 9 Control Mode change,See MIDI controls,See MIDI controls
// 0xB9,Chan 10 Control Mode change,See MIDI controls,See MIDI controls
// 0xBA,Chan 11 Control Mode change,See MIDI controls,See MIDI controls
// 0xBB,Chan 12 Control Mode change,See MIDI controls,See MIDI controls
// 0xBC,Chan 13 Control Mode change,See MIDI controls,See MIDI controls
// 0xBD,Chan 14 Control Mode change,See MIDI controls,See MIDI controls
// 0xBE,Chan 15 Control Mode change,See MIDI controls,See MIDI controls
// 0xBF,Chan 16 Control Mode change,See MIDI controls,See MIDI controls
// 0xC0,Chan 1 Program Change,Program # (0-127),-
// 0xC1,Chan 2 Program Change,Program # (0-127),-
// 0xC2,Chan 3 Program Change,Program # (0-127),-
// 0xC3,Chan 4 Program Change,Program # (0-127),-
// 0xC4,Chan 5 Program Change,Program # (0-127),-
// 0xC5,Chan 6 Program Change,Program # (0-127),-
// 0xC6,Chan 7 Program Change,Program # (0-127),-
// 0xC7,Chan 8 Program Change,Program # (0-127),-
// 0xC8,Chan 9 Program Change,Program # (0-127),-
// 0xC9,Chan 10 Program Change,Program # (0-127),-
// 0xCA,Chan 11 Program Change,Program # (0-127),-
// 0xCB,Chan 12 Program Change,Program # (0-127),-
// 0xCC,Chan 13 Program Change,Program # (0-127),-
// 0xCD,Chan 14 Program Change,Program # (0-127),-
// 0xCE,Chan 15 Program Change,Program # (0-127),-
// 0xCF,Chan 16 Program Change,Program # (0-127),-
// 0xD0,Chan 1 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD1,Chan 2 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD2,Chan 3 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD3,Chan 4 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD4,Chan 5 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD5,Chan 6 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD6,Chan 7 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD7,Chan 8 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD8,Chan 9 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xD9,Chan 10 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xDA,Chan 11 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xDB,Chan 12 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xDC,Chan 13 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xDD,Chan 14 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xDE,Chan 15 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xDF,Chan 16 Channel Aftertouch,Aftertouch pressure (0-127),-
// 0xE0,Chan 1 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE1,Chan 2 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE2,Chan 3 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE3,Chan 4 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE4,Chan 5 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE5,Chan 6 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE6,Chan 7 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE7,Chan 8 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE8,Chan 9 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xE9,Chan 10 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xEA,Chan 11 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xEB,Chan 12 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xEC,Chan 13 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xED,Chan 14 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xEE,Chan 15 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xEF,Chan 16 Pitch Wheel range,Pitch Wheel LSB (0-127),Pitch Wheel MSB (0-127)
// 0xF0,System Exclusive,**,**
// 0xF1,System Common - undefined,-,-
// 0xF2,Sys Com Song Position Pntr,LSB,MSB
// 0xF3,Sys Com Song Select(Song #),(0-127),-
// 0xF4,System Common - undefined,-,-
// 0xF5,System Common - undefined,-,-
// 0xF6,Sys Com tune request,-,-
// 0xF7,Sys Com-end of SysEx (EOX),-,-
// 0xF8,Sys real time timing clock,-,-
// 0xF9,Sys real time undefined,-,-
// 0xFA,Sys real time start,-,-
// 0xFB,Sys real time continue,-,-
// 0xFC,Sys real time stop,-,-
// 0xFD,Sys real time undefined,-,-
// 0xFE,Sys real time active sensing,-,-
// 0xFF,Sys real time sys reset,-,-


