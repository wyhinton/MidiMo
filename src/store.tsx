import create from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { EffectType, MessageType } from "./types";
import { Connection, Input, Output } from "@react-midi/hooks/dist/types";

export interface FuncCarrier {
  func: MidiProcessor;
}

export type MidiProcessor = (data: MidiData) => MidiData;

export interface MidiData {
  data: number[];
  deviceName: string;
  eventType: MessageType;
  blocked?: boolean;
  eventTime?: Date;
}
export interface ModuleData {
  id: string;
  description: string;
  active: boolean;
  effectType: EffectType;
  expanded: boolean;
  processor?: FuncCarrier;
  data?: any;
}

export const reorderit = (
  list: ModuleData[],
  startIndex: number,
  endIndex: number
): ModuleData[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export interface GlobalVar {
  name: string;
  value: string | boolean | number;
}

interface StoreLoad {
  state: TodoState;
  version: number;
}

interface TodoState {
  modules: ModuleData[];
  globals: GlobalVar[];
  midiChain: MidiData[];
  startMessage: MidiData | undefined;
  inputDevice: Connection | undefined;
  inputDeviceName: string | undefined;
  outputDevice: Output | undefined;
  showProcessingIndicator: boolean;
  showOutputIndicator: boolean;
  addModule: (description: string, effectType: EffectType) => void;
  addGlobal: (global: GlobalVar) => void;
  deleteModule: (id: string) => void;
  loadStore: (settings: StoreLoad) => void;
  removeTodo: (id: string) => void;
  setProcessor: (id: string, processor: FuncCarrier) => void;
  setInputDevice: (device: Connection | undefined) => void;
  setInputDeviceName: (deviceName: string | undefined) => void;
  setOutputDevice: (device: Output | undefined) => void;
  setModuleData: (id: string, data: any) => void;
  setStartMessage: (msg: MidiData) => void;
  setMidiChainData: (dataArr: MidiData[]) => void;
  setShowProcessingIndicator: (should: boolean) => void;
  setShowOutputIndicator: (should: boolean) => void;
  // setO: (should: boolean) => void;
  toggleCompletedState: (id: string) => void;
  toggleExpanded: (id: string) => void;
  clearMidiChain: () => void;
  reorder: (sourceIndex: number, destinationIndex: number) => void;
  // evaluateModules: (moduleIndex: number) => MidiData;
}

export const pipe =
  <T,>(...fns: Array<(arg: T) => T>) =>
  (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value);

export interface FilterModuleData {
  "NOTE ON": boolean;
  "NOTE OFF": boolean;
  "POLYPHONIC AFTERTOUCH": boolean;
  "CONTROL MODE": boolean;
  "PROGRAM CHANGE": boolean;
  "CHANNEL AFTERTOUCH": boolean;
  "PITCH WHEEL": boolean;
  "SYSTEM EXCLUSIVE": boolean;
  "SYSTEM COMMON": boolean;
  "SYS COM SONG POSITION": boolean;
  "SYS COM SONG SELECT": boolean;
  "SYSTEM COMMON - UNDEFINED": boolean;
  "SYS COM TUNE REQUEST": boolean;
  "SYS COM-END OF": boolean;
  "SYS REAL TIME TIMING": boolean;
  "SYS REAL TIME UNDEFINED": boolean;
  "SYS REAL TIME START": boolean;
  "SYS REAL TIME CONTINUE": boolean;
  "SYS REAL TIME STOP": boolean;
  "SYS REAL TIME ACTIVE": boolean;
  "SYS REAL TIME SYS": boolean;
}

const defaultFilterModuleSettings = {
  "NOTE ON": false,
  "NOTE OFF": false,
  "POLYPHONIC AFTERTOUCH": false,
  "CONTROL MODE": false,
  "PROGRAM CHANGE": false,
  "CHANNEL AFTERTOUCH": false,
  "PITCH WHEEL": false,
  "SYSTEM EXCLUSIVE": false,
  "SYSTEM COMMON": false,
  "SYS COM SONG POSITION": false,
  "SYS COM SONG SELECT": false,
  "SYSTEM COMMON - UNDEFINED": false,
  "SYS COM TUNE REQUEST": false,
  "SYS COM-END OF": false,
  "SYS REAL TIME TIMING": false,
  "SYS REAL TIME UNDEFINED": false,
  "SYS REAL TIME START": false,
  "SYS REAL TIME CONTINUE": false,
  "SYS REAL TIME STOP": false,
  "SYS REAL TIME ACTIVE": false,
  "SYS REAL TIME SYS": false,
};

const defaultCodeModuleSettings = {
  code: `console.log("hello)`,
};

const defaultLoggerSettings = {};

const moduleDefaultsDict = {
  Code: defaultCodeModuleSettings,
  Filter: defaultFilterModuleSettings,
  Logger: defaultLoggerSettings,
};

export const useStore = create<TodoState>()(
  devtools(
    persist(
      (set, get) => ({
        // initial state
        modules: [
          {
            id: "1",
            description: "something1",
            active: true,
            effectType: "Code",
            expanded: false,
          },
          {
            id: "logger1",
            description: "something3",
            active: true,
            effectType: "Logger",
            expanded: false,
          },
          {
            id: "filter1",
            description: "filter1",
            active: true,
            effectType: "Filter",
            expanded: false,
            data: defaultFilterModuleSettings,
          },
          {
            id: "code2",
            description: "code2",
            active: true,
            effectType: "Code",
            expanded: false,
          },
          {
            id: "logger2",
            description: "something3",
            active: true,
            effectType: "Logger",
            expanded: false,
          },
        ],
        globals: [
          {
            name: "mystring",
            value: "testvalue",
          },
          {
            name: "mystring2",
            value: "testvalue2",
          },
        ],
        startMessage: undefined,
        midiChain: [],
        outputDevice: undefined,
        inputDevice: undefined,
        inputDeviceName: undefined,
        showProcessingIndicator: false,
        showOutputIndicator: false,
        setMidiChainData: (dataArr) => {
          set((state) => ({
            midiChain: dataArr,
          }));
        },
        addModule: (description: string, effectType: EffectType) => {
          set((state) => ({
            modules: [
              ...state.modules,
              {
                id: uuidv4(),
                description,
                active: true,
                expanded: true,
                effectType: effectType,
                data: moduleDefaultsDict[effectType],
              } as ModuleData,
            ],
          }));
        },
        addGlobal: (global) => {
          set((state) => ({
            globals: [...state.globals, global],
          }));
        },
        clearMidiChain: () => {
          set((state) => ({
            midiChain: [],
            modules: [],
          }));
        },
        deleteModule: (id) => {
          set((state) => ({
            modules: state.modules.filter((m) => m.id !== id),
          }));
        },
        loadStore: (data) => {
          set((state) => ({
            modules: data.state.modules,
            globals: data.state.globals,
          }));
        },
        reorder: (sourceIndex, destIndex) => {
          set((state) => ({
            modules: reorderit(state.modules, sourceIndex, destIndex),
          }));
        },
        removeTodo: (id) => {
          set((state) => ({
            modules: state.modules.filter((todo) => todo.id !== id),
          }));
        },
        toggleCompletedState: (id) => {
          set((state) => ({
            modules: state.modules.map((todo) =>
              todo.id === id
                ? ({ ...todo, active: !todo.active } as ModuleData)
                : todo
            ),
          }));
        },
        toggleExpanded: (id) => {
          set((state) => ({
            modules: state.modules.map((todo) =>
              todo.id === id
                ? ({ ...todo, expanded: !todo.expanded } as ModuleData)
                : todo
            ),
          }));
        },
        setProcessor: (id, funcCarrier) => {
          set((state) => ({
            modules: state.modules.map((todo) =>
              todo.id === id
                ? ({ ...todo, processor: funcCarrier } as ModuleData)
                : todo
            ),
          }));
        },
        setOutputDevice: (outDevice) => {
          set((state) => ({
            outputDevice: outDevice,
          }));
        },
        setInputDevice: (inDevice) => {
          set((state) => ({
            inputDevice: inDevice,
          }));
        },
        setInputDeviceName: (inputDeviceName) => {
          set((state) => ({
            inputDeviceName: inputDeviceName,
          }));
        },
        setStartMessage: (msg) => {
          set((state) => ({
            startMessage: msg,
          }));
        },
        //PROCESSING
        setShowProcessingIndicator: (should) => {
          set((state) => ({
            showProcessingIndicator: should,
          }));
        },
        //OUTPUT
        setShowOutputIndicator: (should) => {
          set((state) => ({
            showOutputIndicator: should,
          }));
        },
        setModuleData: (id, data) => {
          set((state) => ({
            modules: state.modules.map((todo) =>
              todo.id === id
                ? ({
                    ...todo,
                    data: JSON.parse(JSON.stringify(data)),
                  } as ModuleData)
                : todo
            ),
          }));
        },
      }),
      {
        name: "midi-storage", // name of item in the storage (must be unique)
        storage: createJSONStorage(() => localStorage), // (optional) by default the 'localStorage' is used
        // partialize: (state) => ({ bears: state.bears }),
      }
    )
  )
);

export default useStore;

interface MyState {
  bears: number;
  addABear: () => void;
}
