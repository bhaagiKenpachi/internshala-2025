
'use client';


export type LineStyle = 'solid' | 'dashed';

export type InputsState = {
  length: number;
  maType: 'SMA';
  source: 'close';
  multiplier: number;
  offset: number;
};

export type StyleState = {
  basis: { visible: boolean; color: string; width: number; style: LineStyle };
  upper: { visible: boolean; color: string; width: number; style: LineStyle };
  lower: { visible: boolean; color: string; width: number; style: LineStyle };
  fill: { visible: boolean; opacity: number };
};

export function BollingerSettings(props: {
  inputs: InputsState;
  style: StyleState;
  onInputsChange: (s: InputsState) => void;
  onStyleChange: (s: StyleState) => void;
}) {
  const { inputs, style, onInputsChange, onStyleChange } = props;

  return (
    <div>
      <h2 className="font-semibold mb-3">Settings</h2>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <button className="tab" data-active>Inputs</button>
          <button className="tab" data-active={false}>Style</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="label col-span-2">Length
            <input className="input mt-1" type="number" min={1} value={inputs.length}
              onChange={e => onInputsChange({ ...inputs, length: Number(e.target.value) || 1 })}/>
          </label>

          <label className="label col-span-2">Basic MA Type
                          <select className="input mt-1" value={inputs.maType} onChange={() => {}} disabled>
              <option value="SMA">SMA</option>
            </select>
          </label>

          <label className="label col-span-2">Source
                          <select className="input mt-1" value={inputs.source} onChange={() => {}} disabled>
              <option value="close">Close</option>
            </select>
          </label>

          <label className="label">StdDev (multiplier)
            <input className="input mt-1" type="number" step="0.1" value={inputs.multiplier}
              onChange={e => onInputsChange({ ...inputs, multiplier: Number(e.target.value) || 0 })}/>
          </label>

          <label className="label">Offset
            <input className="input mt-1" type="number" step="1" value={inputs.offset}
              onChange={e => onInputsChange({ ...inputs, offset: Math.trunc(Number(e.target.value) || 0) })}/>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex gap-2 mb-2">
          <button className="tab" data-active={false}>Inputs</button>
          <button className="tab" data-active>Style</button>
        </div>

        <div className="space-y-4">
          {(['basis','upper','lower'] as const).map((key) => (
            <div key={key} className="grid grid-cols-2 gap-3">
              <div className="col-span-2 font-medium capitalize">{key} band</div>
              <label className="label">
                <input type="checkbox" className="mr-2"
                  checked={style[key].visible}
                  onChange={e => onStyleChange({ ...style, [key]: { ...style[key], visible: e.target.checked } })}
                />
                Visible
              </label>
              <label className="label">Color
                <input className="input mt-1" type="color" value={style[key].color}
                  onChange={e => onStyleChange({ ...style, [key]: { ...style[key], color: e.target.value } })}/>
              </label>
              <label className="label">Line width
                <input className="input mt-1" type="number" min={1} max={4} value={style[key].width}
                  onChange={e => onStyleChange({ ...style, [key]: { ...style[key], width: Number(e.target.value) || 1 } })}/>
              </label>
              <label className="label">Line style
                <select className="input mt-1" value={style[key].style}
                  onChange={e => onStyleChange({ ...style, [key]: { ...style[key], style: e.target.value as LineStyle } })}>
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                </select>
              </label>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 font-medium">Background fill</div>
            <label className="label">
              <input type="checkbox" className="mr-2"
                checked={style.fill.visible}
                onChange={e => onStyleChange({ ...style, fill: { ...style.fill, visible: e.target.checked } })}
              />
              Visible
            </label>
            <label className="label">Opacity
              <input className="input mt-1" type="number" step="0.01" min={0} max={1} value={style.fill.opacity}
                onChange={e => onStyleChange({ ...style, fill: { ...style.fill, opacity: Math.max(0, Math.min(1, Number(e.target.value) || 0)) } })}/>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
