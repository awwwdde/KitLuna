import { create } from 'zustand'

interface AudioState {
  /** Пользователь снял ограничение autoplay (клик / касание). */
  unlocked: boolean
  /** После разблокировки: полный вкл/выкл амбиента. */
  soundOn: boolean
  /** Амбиент реально играет (буфер загружен и не на паузе). */
  playing: boolean
  unlock: () => void
  setSoundOn: (on: boolean) => void
  toggleSound: () => void
  setPlaying: (v: boolean) => void
}

export const useAudioStore = create<AudioState>(set => ({
  unlocked: false,
  soundOn: true,
  playing: false,
  unlock: () => set({ unlocked: true, soundOn: true }),
  setSoundOn: soundOn => set({ soundOn }),
  toggleSound: () => set(s => ({ soundOn: !s.soundOn })),
  setPlaying: playing => set({ playing }),
}))
