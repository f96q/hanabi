type Settings = {
  gravity: number
  damping: number
  sparkSize: number
  sparkQuantity: number
  frame: number
}

type Spark = {
  x: number
  y: number
  vx: number
  vy: number
}

export class Fireworks {
  settings: Settings
  sparkSize: number
  sparks: Spark[]
  context: CanvasRenderingContext2D
  canvas: HTMLCanvasElement

  constructor(selector: string) {
    const canvas: HTMLCanvasElement | null = document.querySelector(selector)
    if (!canvas) {
      throw 'canvas is null'
    }
    this.canvas = canvas
    this.canvas.width = 500
    this.canvas.height = 500
    const context = this.canvas.getContext('2d')
    if (!context) {
      throw 'context is null'
    }
    this.context = context
    this.context.fillStyle = '#000000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.settings = {
      gravity: 0.2,
      damping: 0.95,
      sparkSize: 3,
      sparkQuantity: 1500,
      frame: 60,
    }
    this.sparkSize = 0
    this.sparks = []
    this.fire()
  }

  initSparks(): void {
    const x = this.canvas.width / 2
    const y = this.canvas.height / 2
    const quantity = [...Array(this.settings.sparkQuantity).keys()]
    quantity.forEach(() => {
      const angle = Math.random() * (Math.PI * 2)
      const speed = Math.random() * 6
      this.sparks.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed })
    })
  }

  update(): void {
    this.sparks.forEach((spark) => {
      spark.x += spark.vx
      spark.y += spark.vy + this.settings.gravity
      spark.vx *= this.settings.damping
      spark.vy *= this.settings.damping
      this.draw(spark)
    })
    this.context.globalCompositeOperation = 'source-over'
    this.context.fillStyle = 'rgba(0, 0, 0, 0.3)'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.sparkSize *= 0.97
    if (this.sparkSize < 0.03) {
      this.fire()
      return
    }
    requestAnimationFrame(() => setTimeout(this.update.bind(this), 1000 / this.settings.frame))
  }

  fire(): void {
    this.sparkSize = this.settings.sparkSize
    this.sparks = []
    this.initSparks()
    requestAnimationFrame(() => setTimeout(this.update.bind(this), 1000 / this.settings.frame))
  }

  draw(spark: Spark): void {
    this.context.fillStyle = '#723057'
    this.context.globalCompositeOperation = 'lighter'
    this.context.beginPath()
    this.context.arc(spark.x, spark.y, this.sparkSize, 0, Math.PI * 2, true)
    this.context.fill()
  }
}
