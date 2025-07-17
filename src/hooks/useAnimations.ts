'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export const useGSAPAnimation = () => {
  const timeline = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    timeline.current = gsap.timeline()
    
    return () => {
      if (timeline.current) {
        timeline.current.kill()
      }
    }
  }, [])

  const fadeInUp = (selector: string | Element, options?: gsap.TweenVars) => {
    if (timeline.current) {
      timeline.current.fromTo(
        selector,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", ...options }
      )
    }
  }

  const fadeInLeft = (selector: string | Element, options?: gsap.TweenVars) => {
    if (timeline.current) {
      timeline.current.fromTo(
        selector,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", ...options }
      )
    }
  }

  const fadeInRight = (selector: string | Element, options?: gsap.TweenVars) => {
    if (timeline.current) {
      timeline.current.fromTo(
        selector,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", ...options }
      )
    }
  }

  const scaleIn = (selector: string | Element, options?: gsap.TweenVars) => {
    if (timeline.current) {
      timeline.current.fromTo(
        selector,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", ...options }
      )
    }
  }

  const staggerFadeIn = (selector: string, options?: gsap.TweenVars) => {
    if (timeline.current) {
      timeline.current.fromTo(
        selector,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          ease: "power2.out", 
          stagger: 0.1,
          ...options 
        }
      )
    }
  }

  const bounceIn = (selector: string | Element, options?: gsap.TweenVars) => {
    if (timeline.current) {
      timeline.current.fromTo(
        selector,
        { opacity: 0, scale: 0.3 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          ease: "elastic.out(1, 0.3)",
          ...options 
        }
      )
    }
  }

  const typewriterEffect = (selector: string | Element, text: string, options?: gsap.TweenVars) => {
    if (timeline.current) {
      const element = typeof selector === 'string' ? document.querySelector(selector) : selector
      if (element) {
        element.textContent = ''
        timeline.current.to(element, {
          duration: text.length * 0.05,
          ease: "none",
          onUpdate: function() {
            const progress = this.progress()
            const currentLength = Math.round(progress * text.length)
            element.textContent = text.slice(0, currentLength)
          },
          ...options
        })
      }
    }
  }

  return {
    timeline: timeline.current,
    fadeInUp,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    staggerFadeIn,
    bounceIn,
    typewriterEffect
  }
}

export const useScrollReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right')
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    elements.forEach(element => {
      observer.observe(element)
    })

    return () => {
      elements.forEach(element => {
        observer.unobserve(element)
      })
    }
  }, [])
}

export const useButtonRipple = () => {
  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      pointer-events: none;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
    `

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  return { createRipple }
}

// Custom hook for form validation animations
export const useFormAnimations = () => {
  const animateError = (selector: string | Element) => {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector
    if (element) {
      element.classList.add('error-shake')
      setTimeout(() => {
        element.classList.remove('error-shake')
      }, 500)
    }
  }

  const animateSuccess = (selector: string | Element) => {
    const element = typeof selector === 'string' ? document.querySelector(selector) : selector
    if (element) {
      element.classList.add('success-bounce')
      setTimeout(() => {
        element.classList.remove('success-bounce')
      }, 600)
    }
  }

  return { animateError, animateSuccess }
}