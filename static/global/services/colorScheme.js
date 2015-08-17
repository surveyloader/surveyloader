import Color from 'color'

export default {
  index (i) {
    return Color()
      .hsl((i % 6) * 60, 80, 75)
      .rgbString()
  }
}