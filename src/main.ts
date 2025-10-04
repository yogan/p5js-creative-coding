import p5 from 'p5'
import { sketch1 } from './sketches/sketch1'
import { sketch2 } from './sketches/sketch2'

const sketches = {
  sketch1,
  sketch2
}

let currentP5Instance: p5 | null = null
let currentSketch = 'sketch1'

const sketchContainer = document.getElementById('sketch-container')
const menuButtons = document.querySelectorAll('.sketch-btn')

function loadSketch(sketchName: keyof typeof sketches) {
  if (currentP5Instance) {
    currentP5Instance.remove()
  }
  
  if (sketchContainer) {
    currentP5Instance = new p5(sketches[sketchName], sketchContainer)
    currentSketch = sketchName
    
    menuButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-sketch') === sketchName)
    })
  }
}

menuButtons.forEach(button => {
  button.addEventListener('click', () => {
    const sketchName = button.getAttribute('data-sketch') as keyof typeof sketches
    if (sketchName && sketchName !== currentSketch) {
      loadSketch(sketchName)
    }
  })
})

loadSketch('sketch1')