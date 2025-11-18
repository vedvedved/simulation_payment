import type { Component } from "solid-js";
import { processCvvInput } from "../../lib/formHelpers";


type Props = { actual: string; masked: string; setActual: (s: string) => void; setMasked: (s: string) => void; error?: string };
const CvvField: Component<Props> = (p) => (
<div class="form-row">
<label class="form-label" for="cvv">CVV</label>
<input
id="cvv"
class="input"
inputMode="numeric"
maxlength={4}
value={p.masked}
onInput={(e) => {
const el = e.currentTarget as HTMLInputElement;
const res = processCvvInput(p.actual, e as unknown as InputEvent, el.value);
p.setActual(res.actual);
p.setMasked(res.masked);
}}
/>
{p.error ? <div class="error">{p.error}</div> : null}
</div>
);
export default CvvField;