import gsap from "gsap"
import "./physics"
import { spawn } from "./physics"

const button = document.querySelector(".menu-btn")
const menuOverlay = document.querySelector(".menu-overlay")
const menuModal = document.querySelector(".menu-modal")
const links = document.querySelectorAll(".menu-links h2:not(.active)")
const linkButton = document.querySelector(".link-button")
const images = new Array(5).fill(null).map((_, i) => `url('/images/${i + 1}.jpg')`)
const menuLinks = document.querySelector(".menu-links")

let lastRandom
let image

splitDomText(linkButton)
const linkButtonChars = linkButton.querySelectorAll("span")

let toggled = false
let lastTl
button.addEventListener("click", () => {
    toggled = !toggled
    button.classList.toggle("toggled")
    menuOverlay.classList.toggle("toggled")
    menuModal.classList.toggle("toggled")

    if (toggled) spawn()

    if (lastTl) lastTl.kill()

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } })
    lastTl = tl

    tl.fromTo(".menu-links h2", { x: 100 }, { x: 0, stagger: 0.05, duration: 1.2 })
    tl.fromTo(".link-button", { alpha: 0 }, { alpha: 1 }, "-=0.9")
    tl.fromTo(
        ".link-number",
        { alpha: 0, x: "-100%" },
        { alpha: 1, x: "0%", stagger: 0.05 },
        "-=0.9"
    )
})

links.forEach((link) => {
    const line = link.querySelector(".line")
    let animation
    link.addEventListener("mouseenter", () => {
        gsap.fromTo(line, { x: "-100%" }, { x: "0%", ease: "power2.out", duration: 0.4 })
        image = createImage()
        animation = showRandomImage()
    })
    link.addEventListener("mouseleave", () => {
        gsap.fromTo(line, { x: "0%" }, { x: "100%", ease: "power2.out", duration: 0.4 })
        if (animation) animation.progress(1)
        hideImage()
    })
})

linkButton.addEventListener("mouseenter", () => {
    linkButtonChars.forEach((char) => {
        const tl = gsap.timeline({
            defaults: { duration: 0.3, ease: "power2.out" },
        })
        tl.to(char, { y: Math.random() * -22, rotate: (Math.random() - 0.5) * 90 })
        tl.to(char, { y: 0, rotate: 0 })
    })
})

function splitDomText(element) {
    const text = element.textContent
    element.innerHTML = ""
    text.split("").map((char) => {
        const span = document.createElement("span")
        span.textContent = char
        span.style.display = "inline-block"
        element.appendChild(span)
    })
}

function showRandomImage() {
    gsap.fromTo(
        image,
        { rotate: (Math.random() - 0.5) * 20, y: "100%" },
        { rotate: (Math.random() - 0.5) * 70, y: "-10%", ease: "power4.out", duration: 1.5 }
    )
    const alphaAnimation = gsap.fromTo(image, { alpha: 0 }, { alpha: 0.5, ease: "power4.out" })
    return alphaAnimation
}

function hideImage() {
    gsap.to(image, {
        alpha: 0,
        ease: "power4.out",
    })
    const imageToRemove = image
    gsap.to(image, {
        backgroundSize: "125%",
        ease: "power4.out",
        onComplete: () => {
            imageToRemove.remove()
        },
    })
}

function getRandomImage() {
    const newRandom = Math.floor(Math.random() * images.length)
    if (lastRandom === newRandom) lastRandom = Math.floor(Math.random() * images.length)
    else lastRandom = newRandom
    return images[lastRandom]
}

function createImage() {
    const imageUrl = getRandomImage()
    const element = document.createElement("div")
    element.classList.add("link-image")
    element.style.backgroundImage = imageUrl
    menuLinks.prepend(element)
    return element
}
