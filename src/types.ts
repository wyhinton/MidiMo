import { MidiData, ModuleData } from "./store";

export type EffectType = "Code" | "Logger" | "Filter";

export const midiMessageTypes = [
  "NOTE ON",
  "NOTE OFF",
  "POLYPHONIC AFTERTOUCH",
  "CONTROL MODE",
  "PROGRAM CHANGE",
  "CHANNEL AFTERTOUCH",
  "PITCH WHEEL",
  "SYSTEM EXCLUSIVE",
  "SYSTEM COMMON",
  "SYS COM SONG POSITION",
  "SYS COM SONG SELECT",
  "SYSTEM COMMON - UNDEFINED",
  "SYS COM TUNE REQUEST",
  "SYS COM-END OF",
  "SYS REAL TIME TIMING",
  "SYS REAL TIME UNDEFINED",
  "SYS REAL TIME START",
  "SYS REAL TIME CONTINUE",
  "SYS REAL TIME STOP",
  "SYS REAL TIME ACTIVE",
  "SYS REAL TIME SYS",
] as const;

export type MessageType = typeof midiMessageTypes[number];


export interface ModuleProps {
  moduleData: ModuleData;
  midiData: MidiData | undefined;
  index: number;
}
