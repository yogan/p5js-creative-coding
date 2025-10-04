import p5 from 'p5'
import { sketch1 } from './sketches/sketch1'

const sketchContainer = document.getElementById('sketch-container')

if (sketchContainer) {
  new p5(sketch1, sketchContainer)
}