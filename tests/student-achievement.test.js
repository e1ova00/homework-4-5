import { test } from 'node:test'
import assert from 'node:assert/strict'
import { StudentSequence, StudentAchievement } from '../sources/Game/StudentAchievement.js'

const code = [ 'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA' ]

test('exact code succeeds repeatedly; wrong, partial, WASD and Q codes do not', () =>
{
    const sequence = new StudentSequence()
    for(const keys of [ code.slice(0, 9), [ 'KeyX', ...code.slice(1) ], code.map((key) => key === 'ArrowUp' ? 'KeyW' : key), [ ...code.slice(0, 9), 'KeyQ' ] ])
    {
        sequence.reset()
        assert.equal(keys.some((key) => sequence.push(key)), false)
    }
    sequence.reset()
    for(let repeat = 0; repeat < 3; repeat++)
        assert.deepEqual(code.map((key) => sequence.push(key)), [ ...Array(9).fill(false), true ])
})

test('wrong input resets and an overlapping prefix is recovered', () =>
{
    const sequence = new StudentSequence()
    for(const key of [ 'ArrowUp', 'ArrowDown', 'KeyX' ])
        assert.equal(sequence.push(key), false)
    assert.equal([ 'ArrowUp', ...code ].filter((key) => sequence.push(key)).length, 1)
})

test('listener guards, repeat handling, propagation, overlays and cleanup', () =>
{
    const originalDocument = globalThis.document
    const originalWindow = globalThis.window
    globalThis.document = new EventTarget()
    globalThis.window = new EventTarget()
    const hooks = new Map()
    const events = { on: (name, fn) => hooks.set(fn, name), off: (name, fn) => hooks.delete(fn) }
    class Menu { static CLOSED = 3 }
    const menu = new Menu()
    menu.state = Menu.CLOSED
    menu.events = events
    let opened = 0
    const game = { menu, modals: { current: null, events, open: () => opened++ }, inputs: { filters: new Set([ 'wandering' ]) } }
    const achievement = new StudentAchievement(game)
    let received = 0
    const observer = () => received++
    document.addEventListener('keydown', observer)
    const press = (key, properties = {}) =>
    {
        const event = new Event('keydown', { cancelable: true })
        Object.assign(event, { code: key, ...properties })
        document.dispatchEvent(event)
        assert.equal(event.defaultPrevented, false)
    }
    try
    {
        code.forEach((key) => { press(key); press(key, { repeat: true }) })
        assert.equal(opened, 1)
        assert.equal(received, 20)
        for(const tag of [ 'input', 'textarea', 'select', 'contenteditable' ])
        {
            document.activeElement = { closest: () => tag }
            code.forEach((key) => press(key))
            assert.equal(opened, 1)
        }
        document.activeElement = null
        game.modals.current = {}
        code.forEach((key) => press(key))
        game.modals.current = null
        menu.state = 1
        code.forEach((key) => press(key))
        menu.state = Menu.CLOSED
        game.inputs.filters = new Set([ 'intro' ])
        code.forEach((key) => press(key))
        game.inputs.filters = new Set([ 'wandering' ])
        code.forEach((key) => press(key, { isComposing: true }))
        assert.equal(opened, 1)
        code.slice(0, 5).forEach((key) => press(key))
        window.dispatchEvent(new Event('blur'))
        code.slice(5).forEach((key) => press(key))
        assert.equal(opened, 1)
        code.forEach((key) => press(key))
        assert.equal(opened, 2)
        achievement.destroy()
        code.forEach((key) => press(key))
        assert.equal(opened, 2)
        assert.equal(hooks.size, 0)
    }
    finally
    {
        achievement.destroy()
        document.removeEventListener('keydown', observer)
        globalThis.document = originalDocument
        globalThis.window = originalWindow
    }
})
