// Independent of rendering and physics; keyboard events always reach the game.
export class StudentSequence
{
    constructor()
    {
        this.sequence = [ 'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA' ]
        this.reset()
    }

    reset()
    {
        this.pending = []
    }

    push(code)
    {
        this.pending.push(code)

        // Keep the longest suffix that is also a sequence prefix.
        while(this.pending.length && !this.pending.every((key, index) => key === this.sequence[index]))
            this.pending.shift()

        if(this.pending.length !== this.sequence.length)
            return false

        this.reset()
        return true
    }
}

export class StudentAchievement
{
    constructor(game)
    {
        this.game = game
        this.sequence = new StudentSequence()
        this.controller = new AbortController()
        const options = { signal: this.controller.signal }

        document.addEventListener('keydown', (event) =>
        {
            if(this.blocksInput(event))
            {
                this.sequence.reset()
                return
            }

            if(event.repeat)
                return

            if(this.sequence.push(event.code))
                this.game.modals.open('student-achievement')
        }, options)

        // Do not carry partial codes across focus changes or overlays.
        this.reset = () => this.sequence.reset()
        document.addEventListener('focusin', this.reset, options)
        window.addEventListener('blur', this.reset, options)
        this.game.modals.events.on('open', this.reset)
        this.game.menu.events.on('open', this.reset)
    }

    blocksInput(event)
    {
        const isEditable = (element) => element?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"])')
        return !!(
            event.isComposing || event.ctrlKey || event.metaKey || event.altKey ||
            isEditable(document.activeElement) ||
            (event.composedPath?.() || [ event.target ]).some(isEditable) ||
            this.game.modals.current ||
            this.game.menu.state !== this.game.menu.constructor.CLOSED ||
            !(this.game.inputs.filters.has('wandering') || this.game.inputs.filters.has('racing'))
        )
    }

    destroy()
    {
        this.controller.abort()
        this.game.modals.events.off('open', this.reset)
        this.game.menu.events.off('open', this.reset)
        this.sequence.reset()
    }
}
