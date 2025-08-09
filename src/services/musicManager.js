// StarSender Music Manager
// Beautiful background music system for enhanced broadcasting experience

class MusicManager {
  constructor() {
    this.audioContext = null
    this.currentSource = null
    this.gainNode = null
    this.isPlaying = false
    this.currentTrackIndex = 0
    this.volume = 0.3
    
    this.tracks = [
      {
        name: "StarSender Anthem",
        description: "Epic orchestral theme for campaign launches",
        frequency: 440, // A4
        type: "orchestral",
        tempo: 120,
        duration: 30000
      },
      {
        name: "Smooth Broadcasting",
        description: "Chill lofi beats for steady message sending",
        frequency: 329.63, // E4
        type: "lofi",
        tempo: 85,
        duration: 45000
      },
      {
        name: "Success Celebration",
        description: "Triumphant fanfare for completed campaigns",
        frequency: 523.25, // C5
        type: "fanfare", 
        tempo: 140,
        duration: 20000
      },
      {
        name: "CORS Breaker",
        description: "Electronic beats for technical challenges",
        frequency: 293.66, // D4
        type: "electronic",
        tempo: 128,
        duration: 35000
      },
      {
        name: "WhatsApp Warrior",
        description: "Battle music for overcoming delivery obstacles",
        frequency: 392, // G4
        type: "battle",
        tempo: 150,
        duration: 40000
      }
    ]
    
    this.initializeAudio()
  }

  async initializeAudio() {
    try {
      if (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.gainNode = this.audioContext.createGain()
        this.gainNode.connect(this.audioContext.destination)
        this.gainNode.gain.value = this.volume

        console.log('🎵 StarSender Music Manager initialized')
      } else {
        throw new Error('AudioContext not supported')
      }
    } catch (error) {
      console.log('🎵 Audio context not available, using fallback mode')
      this.audioContext = null
      this.gainNode = null
    }
  }

  generateTone(frequency, type = 'sine', duration = 1000) {
    if (!this.audioContext) {
      return this.generateFallbackMusic(type, duration)
    }

    const oscillator = this.audioContext.createOscillator()
    const envelope = this.audioContext.createGain()
    
    oscillator.connect(envelope)
    envelope.connect(this.gainNode)
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
    oscillator.type = type
    
    // Create ADSR envelope
    envelope.gain.setValueAtTime(0, this.audioContext.currentTime)
    envelope.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1) // Attack
    envelope.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.3) // Decay
    envelope.gain.setValueAtTime(0.2, this.audioContext.currentTime + duration / 1000 - 0.1) // Sustain
    envelope.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration / 1000) // Release
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration / 1000)
    
    return { oscillator, envelope }
  }

  generateFallbackMusic(type, duration) {
    // Fallback for browsers without Web Audio API
    console.log(`🎵 Playing ${type} music (${duration}ms) - Fallback mode`)
    return { 
      oscillator: { 
        stop: () => console.log('🎵 Music stopped'),
        start: () => console.log('🎵 Music started')
      } 
    }
  }

  async playTrack(trackIndex = this.currentTrackIndex) {
    if (this.isPlaying) {
      this.stop()
    }

    const track = this.tracks[trackIndex]
    if (!track) return

    console.log(`🎵 Now playing: ${track.name} - ${track.description}`)
    
    this.currentTrackIndex = trackIndex
    this.isPlaying = true

    if (track.type === 'orchestral') {
      this.playOrchestralTheme(track)
    } else if (track.type === 'lofi') {
      this.playLofiBeats(track)
    } else if (track.type === 'fanfare') {
      this.playFanfare(track)
    } else if (track.type === 'electronic') {
      this.playElectronic(track)
    } else if (track.type === 'battle') {
      this.playBattleMusic(track)
    }

    // Auto-loop or switch track
    setTimeout(() => {
      if (this.isPlaying) {
        this.nextTrack()
      }
    }, track.duration)
  }

  playOrchestralTheme(track) {
    const melody = [
      { freq: track.frequency, duration: 500 },
      { freq: track.frequency * 1.25, duration: 500 },
      { freq: track.frequency * 1.5, duration: 1000 },
      { freq: track.frequency * 1.33, duration: 500 },
      { freq: track.frequency, duration: 1000 }
    ]

    this.playMelody(melody, 'sawtooth')
    
    // Add harmonies
    setTimeout(() => {
      this.playMelody(melody.map(note => ({
        ...note,
        freq: note.freq * 0.75
      })), 'triangle')
    }, 250)
  }

  playLofiBeats(track) {
    const beatPattern = [
      { freq: track.frequency * 0.5, duration: 200 },
      { freq: 0, duration: 100 },
      { freq: track.frequency * 0.75, duration: 150 },
      { freq: 0, duration: 150 },
      { freq: track.frequency * 0.5, duration: 200 },
      { freq: 0, duration: 200 }
    ]

    this.playRepeatingPattern(beatPattern, 'triangle', track.duration)
  }

  playFanfare(track) {
    const fanfareNotes = [
      { freq: track.frequency, duration: 300 },
      { freq: track.frequency * 1.25, duration: 300 },
      { freq: track.frequency * 1.5, duration: 600 },
      { freq: track.frequency * 2, duration: 1200 }
    ]

    this.playMelody(fanfareNotes, 'square')
    
    // Add trumpet-like harmonics
    setTimeout(() => {
      fanfareNotes.forEach((note, index) => {
        setTimeout(() => {
          this.generateTone(note.freq * 1.01, 'sawtooth', note.duration * 0.8)
        }, index * 300)
      })
    }, 100)
  }

  playElectronic(track) {
    // Electronic beat with bass drops
    const bassLine = [
      { freq: track.frequency * 0.25, duration: 400 },
      { freq: track.frequency * 0.33, duration: 400 },
      { freq: track.frequency * 0.25, duration: 800 }
    ]

    const leadSynth = [
      { freq: track.frequency * 2, duration: 200 },
      { freq: track.frequency * 2.5, duration: 200 },
      { freq: track.frequency * 3, duration: 400 }
    ]

    this.playRepeatingPattern(bassLine, 'square', track.duration)
    
    setTimeout(() => {
      this.playRepeatingPattern(leadSynth, 'sawtooth', track.duration)
    }, 800)
  }

  playBattleMusic(track) {
    // Intense battle rhythm
    const battleRhythm = [
      { freq: track.frequency * 0.5, duration: 150 },
      { freq: track.frequency, duration: 150 },
      { freq: track.frequency * 1.5, duration: 300 },
      { freq: track.frequency * 0.75, duration: 200 },
      { freq: track.frequency * 1.25, duration: 300 }
    ]

    this.playRepeatingPattern(battleRhythm, 'square', track.duration)
    
    // Add percussion-like effects
    setTimeout(() => {
      const percussion = battleRhythm.map(note => ({
        ...note,
        freq: note.freq * 0.1,
        duration: note.duration * 0.5
      }))
      
      this.playRepeatingPattern(percussion, 'triangle', track.duration)
    }, 150)
  }

  playMelody(notes, waveType = 'sine') {
    let currentTime = 0
    
    notes.forEach(note => {
      if (note.freq > 0) {
        setTimeout(() => {
          if (this.isPlaying) {
            this.generateTone(note.freq, waveType, note.duration)
          }
        }, currentTime)
      }
      currentTime += note.duration
    })
  }

  playRepeatingPattern(pattern, waveType = 'sine', totalDuration) {
    const patternDuration = pattern.reduce((sum, note) => sum + note.duration, 0)
    const repetitions = Math.floor(totalDuration / patternDuration)
    
    for (let i = 0; i < repetitions; i++) {
      setTimeout(() => {
        if (this.isPlaying) {
          this.playMelody(pattern, waveType)
        }
      }, i * patternDuration)
    }
  }

  stop() {
    this.isPlaying = false
    console.log('🎵 Music stopped')
    
    // Emit event
    window.dispatchEvent(new CustomEvent('music:stopped'))
  }

  pause() {
    this.isPlaying = false
    console.log('⏸️ Music paused')
  }

  resume() {
    if (!this.isPlaying) {
      this.playTrack(this.currentTrackIndex)
      console.log('▶️ Music resumed')
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length
    this.playTrack(this.currentTrackIndex)
  }

  previousTrack() {
    this.currentTrackIndex = this.currentTrackIndex > 0 ? 
      this.currentTrackIndex - 1 : 
      this.tracks.length - 1
    this.playTrack(this.currentTrackIndex)
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime)
    }
    console.log(`🔊 Volume set to ${Math.round(this.volume * 100)}%`)
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex]
  }

  getTrackList() {
    return this.tracks.map((track, index) => ({
      ...track,
      index,
      isPlaying: index === this.currentTrackIndex && this.isPlaying
    }))
  }

  // Special effects for different campaign events
  playSuccessSound() {
    if (this.audioContext) {
      this.generateTone(523.25, 'sine', 200) // C5
      setTimeout(() => this.generateTone(659.25, 'sine', 200), 200) // E5
      setTimeout(() => this.generateTone(783.99, 'sine', 400), 400) // G5
    }
    console.log('🎉 Success sound played!')
  }

  playErrorSound() {
    if (this.audioContext) {
      this.generateTone(220, 'square', 300) // A3
      setTimeout(() => this.generateTone(196, 'square', 300), 300) // G3
    }
    console.log('❌ Error sound played!')
  }

  playNotificationSound() {
    if (this.audioContext) {
      this.generateTone(800, 'sine', 100)
      setTimeout(() => this.generateTone(1000, 'sine', 100), 150)
    }
    console.log('🔔 Notification sound played!')
  }

  // Adaptive music based on campaign progress
  adaptMusicToProgress(progress) {
    if (progress < 25) {
      // Starting phase - epic anthem
      if (this.currentTrackIndex !== 0) {
        this.playTrack(0)
      }
    } else if (progress < 75) {
      // Middle phase - smooth broadcasting
      if (this.currentTrackIndex !== 1) {
        this.playTrack(1)
      }
    } else if (progress < 95) {
      // Final phase - electronic intensity
      if (this.currentTrackIndex !== 3) {
        this.playTrack(3)
      }
    } else {
      // Success phase - celebration
      if (this.currentTrackIndex !== 2) {
        this.playTrack(2)
      }
    }
  }

  // Background ambient for different moods
  setMoodMusic(mood) {
    const moodToTrack = {
      'epic': 0,      // StarSender Anthem
      'chill': 1,     // Smooth Broadcasting  
      'victory': 2,   // Success Celebration
      'technical': 3, // CORS Breaker
      'battle': 4     // WhatsApp Warrior
    }

    const trackIndex = moodToTrack[mood] || 0
    this.playTrack(trackIndex)
    console.log(`🎭 Mood set to: ${mood}`)
  }
}

// Create global instance
const musicManager = new MusicManager()

// Export for use
export default musicManager

// Make globally available
window.musicManager = musicManager

console.log('🎵 StarSender Music Manager Ready!')
console.log('🎼 5 Epic tracks loaded')
console.log('🎚️ Advanced audio engine initialized')
