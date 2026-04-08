"use client"

import { useEffect, useRef } from "react"

export function TecnicoParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const cv = canvas
    const c = ctx
    let animId: number

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    const resize = () => {
      cv.width = cv.offsetWidth
      cv.height = cv.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    class Particle {
      x = 0; y = 0; vx = 0; speed = 0
      size = 0; alpha = 0; maxAlpha = 0; green = false

      constructor() { this.init(true) }

      init(random: boolean) {
        this.x = rand(0, cv.width)
        this.y = random ? rand(0, cv.height) : cv.height + 5
        this.speed = rand(0.3, 0.9)
        this.vx = rand(-0.1, 0.1)
        this.size = rand(1, 2.5)
        this.maxAlpha = rand(0.2, 0.55)
        this.alpha = random ? rand(0, this.maxAlpha) : 0
        this.green = Math.random() > 0.4
      }

      update() {
        this.y -= this.speed
        this.x += this.vx
        if (this.y < cv.height - 60 && this.y > 60) {
          this.alpha = this.maxAlpha
        } else if (this.y >= cv.height - 60) {
          this.alpha = ((cv.height - this.y) / 60) * this.maxAlpha
        } else {
          this.alpha = (this.y / 60) * this.maxAlpha
        }
        if (this.y < -5) this.init(false)
      }

      draw(c2: CanvasRenderingContext2D) {
        c2.save()
        c2.globalAlpha = Math.max(0, this.alpha)
        c2.fillStyle = this.green ? "#3DC45A" : "#EBF3E8"
        c2.beginPath()
        c2.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        c2.fill()
        c2.restore()
      }
    }

    const particles = Array.from({ length: 120 }, () => new Particle())

    function loop() {
      c.clearRect(0, 0, cv.width, cv.height)
      particles.forEach(p => { p.update(); p.draw(c) })
      animId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  )
}
