import type { Component } from "solid-js";


type Props = { value: string; onInput: (v: string, e: Event) => void; error?: string };
const CardField: Component<Props> = (p) => (
<div class="form-row">
<label class="form-label" for="card">Card number</label>
<input
id="card"
class="input large-input"
value={p.value}
inputMode="numeric"
onInput={(e) => p.onInput((e.currentTarget as HTMLInputElement).value, e)}
/>
{p.error ? <div class="error">{p.error}</div> : null}
</div>
);
export default CardField;