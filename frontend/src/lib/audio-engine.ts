import type { SoundId } from "./storage/types"

type AudioSource = {
  buffer: AudioBuffer | null
  source: AudioBufferSourceNode | null
  gain: GainNode
}

class AudioEngine {
  private ctx: AudioContext | null = null
  private sources: Map<SoundId, AudioSource> = new Map()
  private masterGain: GainNode | null = null

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.5
      this.masterGain.connect(this.ctx.destination)
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume()
    }
    return this.ctx
  }

  private generateNoise(ctx: AudioContext, type: SoundId): AudioBuffer {
    const sr = ctx.sampleRate
    const duration = 8
    const length = sr * duration
    const buffer = ctx.createBuffer(2, length, sr)
    const ch0 = buffer.getChannelData(0)
    const ch1 = buffer.getChannelData(1)
    const crossfadeSamples = Math.floor(sr * 0.05)

    for (let i = 0; i < length; i++) {
      const t = i / sr
      let sample = 0

      switch (type) {
        case "rain": {
          const env = 0.5 + 0.5 * Math.sin(Math.PI * (i % Math.floor(sr * 0.3)) / Math.floor(sr * 0.3))
          sample = (Math.random() * 2 - 1) * env * 0.4
          sample += Math.sin(t * 800 + Math.sin(t * 200) * 3) * 0.05
          break
        }
        case "ocean": {
          const wave = Math.sin(t * 0.15 + Math.sin(t * 0.05) * 2) * 0.3 +
                       Math.sin(t * 0.1 + Math.sin(t * 0.03) * 3) * 0.2
          const noise = (Math.random() * 2 - 1) * 0.15
          const swell = 0.5 + 0.5 * Math.sin(t * 0.08)
          sample = (wave + noise) * swell * 0.6
          break
        }
        case "stream": {
          const gurgle = Math.sin(t * 4 + Math.sin(t * 8) * 2) * 0.15 +
                         Math.sin(t * 7 + Math.sin(t * 12) * 1.5) * 0.1
          const flow = (Math.random() * 2 - 1) * 0.3 *
                        (0.5 + 0.5 * Math.sin(t * 0.5 + Math.sin(t) * 2))
          sample = (gurgle + flow) * 0.5
          break
        }
        case "wind": {
          const gust = 0.5 + 0.5 * Math.sin(t * 0.2 + Math.sin(t * 0.1) * 3)
          sample = (Math.random() * 2 - 1) * 0.15 * gust
          sample += Math.sin(t * 120 + Math.sin(t * 30) * 5) * 0.06 * gust
          break
        }
        case "forest": {
          const chirp1 = Math.sin(t * 300 + Math.sin(t * 5) * 10) > 0.95 ? 0.1 : 0
          const chirp2 = Math.sin(t * 450 + Math.sin(t * 7) * 8) > 0.97 ? 0.08 : 0
          const rustle = (Math.random() * 2 - 1) * 0.08 *
                         (0.5 + 0.5 * Math.sin(t * 0.3))
          sample = chirp1 + chirp2 + rustle
          break
        }
        case "fireplace": {
          const crackle = (Math.random() * 2 - 1) *
                          (Math.random() > 0.98 ? 0.6 : 0.15)
          const roar = Math.sin(t * 40 + Math.sin(t * 25) * 2) * 0.1 *
                       (0.5 + 0.5 * Math.sin(t * 0.3))
          sample = (crackle + roar) * 0.5
          break
        }
        case "cafe": {
          const drone = Math.sin(t * 100 + Math.sin(t * 2) * 15) * 0.03
          const chatter = (Math.random() * 2 - 1) * 0.08 *
                          (0.3 + 0.7 * Math.sin(t * 0.4 + Math.sin(t * 0.2) * 2))
          const clink = Math.sin(t * 2000 + Math.sin(t * 10) * 20) > 0.99 ? 0.06 : 0
          sample = drone + chatter + clink
          break
        }
        case "night": {
          const cricket = Math.sin(t * 500 + Math.sin(t * 3) * 30) *
                          (Math.sin(t * 3) > 0.7 ? 0.08 : 0)
          const hush = (Math.random() * 2 - 1) * 0.05
          sample = cricket + hush
          break
        }
      }

      const fadeIn = i < crossfadeSamples ? i / crossfadeSamples : 1
      const fadeOut = i > length - crossfadeSamples ? (length - i) / crossfadeSamples : 1
      const envelope = fadeIn * fadeOut

      ch0[i] = sample * 0.5 * envelope
      ch1[i] = sample * 0.5 * envelope
    }

    return buffer
  }

  async play(soundId: SoundId, volume: number = 0.5): Promise<void> {
    this.stop(soundId)
    const ctx = this.getContext()
    const buffer = this.generateNoise(ctx, soundId)
    const gain = ctx.createGain()
    gain.gain.value = volume
    gain.connect(this.masterGain ?? ctx.destination)

    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    src.connect(gain)
    src.start()

    this.sources.set(soundId, { buffer, source: src, gain })
  }

  stop(soundId: SoundId): void {
    const entry = this.sources.get(soundId)
    if (entry) {
      try { entry.source?.stop() } catch { }
      entry.source?.disconnect()
      entry.gain?.disconnect()
      this.sources.delete(soundId)
    }
  }

  setVolume(soundId: SoundId, volume: number): void {
    const entry = this.sources.get(soundId)
    if (entry) {
      entry.gain.gain.value = volume
    }
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = volume
    }
  }

  isPlaying(soundId: SoundId): boolean {
    return this.sources.has(soundId)
  }

  stopAll(): void {
    this.sources.forEach((_, id) => this.stop(id))
  }

  cleanup(): void {
    this.stopAll()
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
  }
}

export const audioEngine = new AudioEngine()
