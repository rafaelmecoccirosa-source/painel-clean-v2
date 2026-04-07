"use client"

import { useEffect, useRef } from "react"

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    class Particle {
      x = 0; y = 0; vx = 0; vy = 0
      size = 0; maxAlpha = 0; alpha = 0
      life = 0; decay = 0; green = false

      constructor(initial: boolean) { this.init(initial) }

      init(initial: boolean) {
        this.x = rand(0, canvas!.width)
        this.y = initial ? rand(0, canvas!.height) : canvas!.height + 4
        this.vx = rand(-0.15, 0.15)
        this.vy = rand(-0.3, -0.9)
        this.size = rand(1, 2.8)
        this.maxAlpha = rand(0.2, 0.65)
        this.alpha = initial ? rand(0, this.maxAlpha) : 0
        this.life = initial ? rand(0, 1) : 0
        this.decay = rand(0.003, 0.007)
        this.green = Math.random() > 0.4
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.life += this.decay
        if (this.life < 0.2) this.alpha = (this.life / 0.2) * this.maxAlpha
        else if (this.life > 0.75) this.alpha = ((1 - this.life) / 0.25) * this.maxAlpha
        else this.alpha = this.maxAlpha
        if (this.life >= 1 || this.y < -10) this.init(false)
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.green ? "#3DC45A" : "#EBF3E8"
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const particles = Array.from({ length: 100 }, () => new Particle(true))

    let rayAngle = 0
    const SUN_X = () => canvas!.width * 0.78
    const SUN_Y = () => canvas!.height * 0.22
    const SUN_R = 44

    function drawSun() {
      const sx = SUN_X(), sy = SUN_Y()

      // glow externo
      const grd = ctx!.createRadialGradient(sx, sy, SUN_R * 0.4, sx, sy, SUN_R * 3.5)
      grd.addColorStop(0, "rgba(61,196,90,0.15)")
      grd.addColorStop(1, "rgba(61,196,90,0)")
      ctx!.fillStyle = grd
      ctx!.beginPath()
      ctx!.arc(sx, sy, SUN_R * 3.5, 0, Math.PI * 2)
      ctx!.fill()

      // raios
      ctx!.save()
      ctx!.translate(sx, sy)
      ctx!.rotate(rayAngle)
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        ctx!.strokeStyle = "rgba(61,196,90,0.3)"
        ctx!.lineWidth = i % 2 === 0 ? 1.5 : 0.8
        ctx!.beginPath()
        ctx!.moveTo(Math.cos(a) * (SUN_R + 8), Math.sin(a) * (SUN_R + 8))
        ctx!.lineTo(Math.cos(a) * (SUN_R + 20 + (i % 3 === 0 ? 10 : 0)), Math.sin(a) * (SUN_R + 20 + (i % 3 === 0 ? 10 : 0)))
        ctx!.stroke()
      }
      ctx!.restore()

      // núcleo
      const core = ctx!.createRadialGradient(sx, sy, 0, sx, sy, SUN_R)
      core.addColorStop(0, "#EBF3E8")
      core.addColorStop(0.45, "#3DC45A")
      core.addColorStop(1, "rgba(61,196,90,0.15)")
      ctx!.fillStyle = core
      ctx!.beginPath()
      ctx!.arc(sx, sy, SUN_R, 0, Math.PI * 2)
      ctx!.fill()
    }

    function loop() {
      if (!canvas || !ctx) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      rayAngle += 0.003
      drawSun()
      particles.forEach(p => { p.update(); p.draw(ctx!) })
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
