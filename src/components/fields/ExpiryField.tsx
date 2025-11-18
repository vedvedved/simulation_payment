import type { Component } from "solid-js";


type Props = { value: string; onInput: (v: string, e: Event) => void; error?: string };
const ExpiryField: Component<Props> = (p) => (
<div class="form-row">
<label class="form-label" for="expiry">Expiry (MM/YY)</label>
<input
id="expiry"
class="input"
value={p.value}
inputMode="numeric"
onInput={(e) => p.onInput((e.currentTarget as HTMLInputElement).value, e)}
/>
{p.error ? <div class="error">{p.error}</div> : null}
</div>
);
export default ExpiryField;