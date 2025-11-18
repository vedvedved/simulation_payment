import type { Component } from "solid-js";


type Props = { loading: boolean; disabled?: boolean; label?: string };
const FormActions: Component<Props> = (p) => (
<div class="form-actions">
<button class="btn pay large" type="submit" disabled={p.loading || p.disabled} aria-disabled={p.loading || p.disabled}>
{p.loading ? "Processing..." : (p.label ?? "Pay ₹499")}
</button>
</div>
);
export default FormActions;