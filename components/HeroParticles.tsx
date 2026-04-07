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
    const SUN_Y = () => cv.height * -0.02

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0
      size = 0; alpha = 0; maxAlpha = 0
      traveled = 0; maxDist = 0; green = false
      angle = 0; speed = 0

      constructor() { this.init(true) }

      init(random: boolean) {
        this.angle = rand(Math.PI * 0.72, Math.PI * 1.28)
        this.speed = rand(1.0, 3.5)
        this.size = rand(1, 3)
        this.maxAlpha = rand(0.4, 0.95)
        this.green = Math.random() > 0.35
        this.maxDist = cv.width * 1.1

        // sempre nasce em ponto aleatório do trajeto, nunca acumula na origem
        const startDist = random ? rand(0, this.maxDist) : rand(0, 40)
        this.traveled = startDist
        this.x = cv.width * 0.97 + Math.cos(this.angle) * startDist
        this.y = cv.height * -0.02 + Math.sin(this.angle) * startDist
        this.vx = Math.cos(this.angle) * this.speed
        this.vy = Math.sin(this.angle) * this.speed

        const fadeInDist = 30
        const fadeOutStart = this.maxDist * 0.65
        if (startDist < fadeInDist) {
          this.alpha = (startDist / fadeInDist) * this.maxAlpha
        } else if (startDist > fadeOutStart) {
          this.alpha = ((this.maxDist - startDist) / (this.maxDist - fadeOutStart)) * this.maxAlpha
        } else {
          this.alpha = this.maxAlpha * rand(0.5, 1.0)
        }
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.traveled += this.speed

        const fadeInDist = 30
        const fadeOutStart = this.maxDist * 0.65

        if (this.traveled < fadeInDist) {
          this.alpha = (this.traveled / fadeInDist) * this.maxAlpha
        } else if (this.traveled > fadeOutStart) {
          this.alpha = ((this.maxDist - this.traveled) / (this.maxDist - fadeOutStart)) * this.maxAlpha
        } else {
          this.alpha = this.maxAlpha
        }

        if (this.x < -20 || this.y > cv.height + 20 || this.y < -20 || this.traveled > this.maxDist) {
          this.init(false)
        }
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

    // criação — todas com random=true para nascerem espalhadas
    const particles = Array.from({ length: 300 }, () => new Particle())

    function drawGlow() {
      const sx = SUN_X(), sy = SUN_Y()
      const outer = c.createRadialGradient(sx, sy, 0, sx, sy, cv.width * 1.4)
      outer.addColorStop(0, "rgba(61,196,90,0.3)")
      outer.addColorStop(1, "rgba(61,196,90,0)")
      c.fillStyle = outer
      c.fillRect(0, 0, cv.width, cv.height)
      const inner = c.createRadialGradient(sx, sy, 0, sx, sy, 126)
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
