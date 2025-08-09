// Utility untuk greeting otomatis berdasarkan waktu Indonesia
export const getIndonesianTimeGreeting = () => {
  // Get current time in Indonesian timezone (WIB UTC+7)
  const now = new Date()
  const indonesianTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}))
  const hour = indonesianTime.getHours()
  
  // Determine greeting based on hour
  if (hour >= 5 && hour < 11) {
    return 'Selamat pagi'
  } else if (hour >= 11 && hour < 15) {
    return 'Selamat siang'
  } else if (hour >= 15 && hour < 18) {
    return 'Selamat sore'
  } else {
    return 'Selamat malam'
  }
}

// Get formatted Indonesian time string
export const getIndonesianTimeString = () => {
  const now = new Date()
  return now.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

// Get just the time portion
export const getIndonesianTime = () => {
  const now = new Date()
  return now.toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get current Indonesian date
export const getIndonesianDate = () => {
  const now = new Date()
  return now.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
