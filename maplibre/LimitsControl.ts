// Bouton de carte « Limites du territoire », inspiré de l'observatoire vélo de Montpellier
// (https://github.com/TFCx/observatoire-velo-montpellier).
export default class LimitsControl {
  _btn!: HTMLButtonElement;
  _container!: HTMLDivElement;
  _onClick: () => void;
  _title: string;

  constructor({ onClick, title }: { onClick: () => void; title: string }) {
    this._onClick = onClick;
    this._title = title;
  }

  onAdd() {
    this._btn = document.createElement('button');
    this._btn.className = 'maplibregl-limits maplibregl-ctrl-icon';
    this._btn.type = 'button';
    this._btn.title = this._title;
    this._btn.setAttribute('aria-label', this._title);
    this._btn.onclick = () => this._onClick();

    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl-group maplibregl-ctrl';
    this._container.appendChild(this._btn);

    return this._container;
  }

  setActive(isActive: boolean) {
    if (!this._btn) return;
    this._btn.classList.toggle('maplibregl-limits--active', isActive);
    this._btn.setAttribute('aria-pressed', String(isActive));
  }

  onRemove() {
    if (this._container && this._container.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}
