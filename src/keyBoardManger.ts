import {immerable} from "immer"
import { MidiData } from "./store";
import { getMessageType } from "./utils";

export type PianoKeyBoardEvent = (data: MidiData) => void

export interface KeyBoardPianoState{
    currentOctave?: number;
    onNoteEnd?: PianoKeyBoardEvent;
    onNotePlay?: PianoKeyBoardEvent;
    onMessage?: PianoKeyBoardEvent;
}

const keyToNote = (key: string, octave: number): number =>{
    
  const note_values={
    "a": 0,
    "w": 1,
    "s": 2,
    "e": 3,
    "d": 4,
    "f": 5,
    "t": 6,
    "g": 7, 
    "y": 8,
    "h": 9,
    "u": 10,
    "j": 11,
    "k": 12,
    "o": 13,
    "l": 14,  
  }
  //@ts-ignore
  const base = note_values[key] as number
  const withOctave = (12*octave)+base; 
  console.log(withOctave)
    //@ts-ignore
    return withOctave
}

function sendMIDINoteOn(channel: number, noteNumber: number, velocity: number): number[] {
    const message = [0x90 + (channel - 1), noteNumber, velocity];
    return message;
}

function sendMIDINoteOff(channel: number, noteNumber: number, velocity: number): number[] {
    const message = [0x80 + (channel - 1), noteNumber, velocity];
    return message
  }

class KeyboardPiano {
    static count = 0;
    private keys: Map<string, boolean>; // Map to track pressed keys
    private currentOctave: number;
    private instanceId: number;
    onNoteEnd?: PianoKeyBoardEvent;
    onNotePlay?: PianoKeyBoardEvent;
    onMessage?: PianoKeyBoardEvent;
    constructor({currentOctave, onNoteEnd, onNotePlay}: KeyBoardPianoState) {
        console.log(onNoteEnd)
      this.keys = new Map<string, boolean>();
      this.currentOctave = currentOctave??3; // Initial octave
      this.onNoteEnd = onNoteEnd;
      this.onNotePlay = onNotePlay;
      this.instanceId = ++KeyboardPiano.count;
      console.log(this.instanceId)
      // Add event listeners for keydown and keyup events

      document.addEventListener("keydown", this.handleKeyDown.bind(this));
      document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }
    
    get notFocused(){
        return document.activeElement?.id === "BODY-ELEMENT"
    }
    private handleKeyDown(event: KeyboardEvent) {
        // console.log(document.activeElement)
        // console.log(document.activeElement?.id === "BODY-ELEMENT")
      if (this.notFocused){
        const key = event.key;
  
        if (!this.keys.get(key)) {
          // Key is pressed for the first time
          this.keys.set(key, true);
    
          if (key === "x") {
            // Increase the octave when "z" is pressed
            this.increaseOctave();
          } else if (key === "z") {
            // Decrease the octave when "x" is pressed
            this.decreaseOctave();
          } else {
            this.playNoteForKey(key);
          }
        }
      }
     
    }
  
    private handleKeyUp(event: KeyboardEvent) {
      if (this.notFocused){
        const key = event.key;
        this.keys.set(key, false);
    
        if (key !== "z" && key !== "x") {
          this.stopNoteForKey(key);
        }
      }

    }
  
    private increaseOctave() {
      if (this.currentOctave < 8) {
        this.currentOctave++;
        console.log(`Increased octave to ${this.currentOctave}`);
      }
    }
  
    private decreaseOctave() {
      if (this.currentOctave >= 1) {
        this.currentOctave--;
        console.log(`Decreased octave to ${this.currentOctave}`);
      }
    }
  
    private playNoteForKey(key: string) {
      // Implement audio playback logic here based on the key and current octave
      const note = sendMIDINoteOn(1, keyToNote(key, this.currentOctave), 127)
      const midiData = {
        data: note,
        deviceName: "keyboard",
        eventType: getMessageType(note),
        eventTime: new Date(),
      }
      this.emitMidiMessage(midiData)
    //   console.log(`Playing note: ${note}`);
    }

    private emitMidiMessage(midiData: MidiData){
        if (this.onMessage){
            this.onMessage(midiData)
        }
    }

    
  
    stopNoteForKey(key: string) {
      // Implement logic to stop audio playback for the key
    //   const note = `${key}${this.currentOctave}`;
      const note = sendMIDINoteOff(1, keyToNote(key, this.currentOctave), 127)
      const midiData = {
        data: note,
        deviceName: "keyboard",
        eventType: getMessageType(note),
        eventTime: new Date(),
      }
    //   if (this.onNoteEnd){
    //     this.onNoteEnd(midiData)
    //   }
      this.emitMidiMessage(midiData)
    }
    
    getState(){
        this.cleanup()
        return {
            currentOctave: this.currentOctave,
            onNoteEnd: this.onNoteEnd,
            onNote: this.onNotePlay,
        }
    }

    setState({currentOctave, onNoteEnd, onNotePlay, onMessage}: KeyBoardPianoState){
        // this.currentOctave = currentOctave??3;
        this.onNoteEnd = onNoteEnd;
        this.onNotePlay = onNotePlay;
        this.onMessage = onMessage;

    }
    cleanup() {
        console.log("RUNNING CLEANUP")
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
        document.removeEventListener("keyup", this.handleKeyUp.bind(this));
    }
    
  }
  
  // Usage:

export default KeyboardPiano;
