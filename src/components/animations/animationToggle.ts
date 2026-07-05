// Pause/play control for the looping diagram figures.
//
// The animations themselves are pure CSS loops. This script only flips a class
// on the figure, which sets the `--anim-play` custom property that every
// animated element reads via `animation-play-state: var(--anim-play)`.
//
// Visitors who prefer reduced motion get the figure paused on its resolved
// (data-loaded) frame - the CSS handles that and hides the control - so here we
// just start those figures in the paused state for consistency.

const setup = () => {
  const figures = document.querySelectorAll<HTMLElement>('figure[data-anim]')

  figures.forEach((figure) => {
    if (figure.dataset.animInit) return
    figure.dataset.animInit = 'true'

    const button = figure.querySelector<HTMLButtonElement>('.anim-toggle')
    if (!button) return

    const icon = button.querySelector<HTMLElement>('.anim-toggle-icon')
    const text = button.querySelector<HTMLElement>('.anim-toggle-text')

    let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const render = () => {
      figure.classList.toggle('is-paused', paused)
      if (icon) icon.textContent = paused ? '▶' : '⏸'
      if (text) text.textContent = paused ? 'Play' : 'Pause'
      button.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation')
    }

    button.addEventListener('click', () => {
      paused = !paused
      render()
    })

    render()
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setup)
} else {
  setup()
}
