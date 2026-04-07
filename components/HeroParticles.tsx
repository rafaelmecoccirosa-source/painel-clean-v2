"use client"

import { useEffect, useRef } from "react"

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const cv = canvas
    const c = ctx
    let animId: number

    const resize = () => {
      cv.width = cv.offsetWidth
      cv.height = cv.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const rand = (a: number, b: number) => a + Math.random() * (b - a)
    const SUN_X = () => cv.width * 0.95
    const SUN_Y = () => cv.height * 0.05

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0
      size = 0; alpha = 0; maxAlpha = 0
      life = 0; decay = 0; green = false

      constructor() { this.init(true) }

      init(initial: boolean) {
        const angle = rand(Math.PI * 0.75, Math.PI * 1.25)
        const speed = rand(0.8, 2.8)
        this.x = cv.width * 0.95 + rand(-15, 15)
        this.y = cv.height * 0.05 + rand(-15, 15)
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        this.size = rand(1, 3.5)
        this.maxAlpha = rand(0.35, 0.9)
        this.alpha = initial ? rand(0, this.maxAlpha) : 0
        this.life = initial ? rand(0, 1) : 0
        this.decay = rand(0.0008, 0.003)
        this.green = Math.random() > 0.35
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.vx *= 0.995
        this.vy *= 0.995
        this.life += this.decay
        if (this.life < 0.15) this.alpha = (this.life / 0.15) * this.maxAlpha
        else if (this.life > 0.65) this.alpha = ((1 - this.life) / 0.35) * this.maxAlpha
        else this.alpha = this.maxAlpha
        this.size *= 0.998
        if (this.life >= 1 || this.x < -10 || this.y > cv.height + 10) this.init(false)
      }

      draw(c2: CanvasRenderingContext2D) {
        c2.save()
        c2.globalAlpha = Math.max(0, this.alpha)
        c2.fillStyle = this.green ? "#3DC45A" : "#EBF3E8"
        c2.beginPath()
        c2.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2)
        c2.fill()
        c2.restore()
      }
    }

    const particles = Array.from({ length: 280 }, () => new Particle())

    function drawGlow() {
      const sx = SUN_X(), sy = SUN_Y()
      // brilho externo — cobre a tela inteira a partir do canto
      const outer = c.createRadialGradient(sx, sy, 0, sx, sy, cv.width * 1.2)
      outer.addColorStop(0, "rgba(61,196,90,0.25)")
      outer.addColorStop(1, "rgba(61,196,90,0)")
      c.fillStyle = outer
      c.fillRect(0, 0, cv.width, cv.height)
      // núcleo do brilho
      const inner = c.createRadialGradient(sx, sy, 0, sx, sy, 80)
      inner.addColorStop(0, "rgba(235,243,232,1.0)")
      inner.addColorStop(0.4, "rgba(61,196,90,0.7)")
      inner.addColorStop(1, "rgba(61,196,90,0)")
      c.fillStyle = inner
      c.fillRect(0, 0, cv.width, cv.height)
    }

    function loop() {
      cv.width = cv.offsetWidth
      cv.height = cv.offsetHeight
      c.clearRect(0, 0, cv.width, cv.height)
      drawGlow()
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
