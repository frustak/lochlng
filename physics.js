import Matter from "matter-js"

const sprites = new Array(15).fill(null).map((_, i) => `/objects/${i + 1}.svg`)

// module aliases
const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Body = Matter.Body

// create an engine
const engine = Engine.create()

// create a renderer
const render = Render.create({
    engine: engine,
    canvas: document.querySelector(".physics-target"),
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        background: "transparent",
        wireframeBackground: "transparent",
        wireframes: false,
    },
})

// walls
const wallSize = 100
const roof = Bodies.rectangle(0, -wallSize / 2 - 1, window.innerWidth * 20, wallSize, {
    isStatic: true,
})
const wall = Bodies.rectangle(-wallSize / 2 - 1, 0, wallSize, window.innerHeight * 20, {
    isStatic: true,
})
Composite.add(engine.world, [roof, wall])

window.addEventListener("resize", () => {
    render.canvas.width = window.innerWidth
    render.canvas.height = window.innerHeight
})

// run the renderer
Render.run(render)

// create runner
const runner = Runner.create()

// run the engine
Runner.run(runner, engine)

export function spawn() {
    // create objects
    for (const sprite of sprites) {
        const size = Math.max(Math.random() + 0.3, 0.7)
        const position = Math.random() - 0.5

        const body = Bodies.circle(
            window.innerWidth + 100 + (Math.random() * window.innerWidth) / 2,
            window.innerHeight / 2 + position * 300,
            30 * size + window.innerWidth / 100,
            {
                render: {
                    sprite: {
                        texture: sprite,
                        xScale: 0.75 * size,
                        yScale: 0.75 * size,
                    },
                },
            }
        )
        // add all of the bodies to the world
        Composite.add(engine.world, [body])
        Body.applyForce(body, body.position, {
            x: -1.4 * size * Math.max(Math.random(), 0.5),
            y: -0.25 * size * Math.max(Math.random(), 0.5),
        })
    }
}
