import type { Component } from "solid-js";


export type TextFieldInputMode = "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";


type Props = {
id: string;
label: string;
value: string;
onInput: (value: string, e: Event) => void;
placeholder?: string;
error?: string;
inputMode?: TextFieldInputMode;
};


const TextField: Component<Props> = (p) => (
<div class="form-row">
<label for={p.id} class="form-label">{p.label}</label>
<input
id={p.id}
class="input"
value={p.value}
inputMode={p.inputMode ?? undefined}
placeholder={p.placeholder}
onInput={(e) => p.onInput((e.currentTarget as HTMLInputElement).value, e)}
/>
{p.error ? <div class="error" role="alert">{p.error}</div> : null}
</div>
);


export default TextField;