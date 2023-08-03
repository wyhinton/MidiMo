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



export const defaultFilterModuleSettings: FilterModuleData = {
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

const defaultCodeModuleSettings: CodeModuleData = {
  codeText: `
  //all code blocks have acces to a data variable
  //they must return a data variable
  return data`,
};


export interface CodeModuleData {
  codeText: string;
}

const defaultLoggerSettings = {};

export interface EnvelopeModuleData {

}

const defaultEnvelopeSettings: EnvelopeModuleData = {

}

export const moduleDefaultsDict = {
  Code: defaultCodeModuleSettings,
  Filter: defaultFilterModuleSettings,
  Logger: defaultLoggerSettings,
  Envelope:  defaultEnvelopeSettings,
};