import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_nOWAxk6x.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_PdenlSjW.mjs';
import { ssr, ssrHydrationKey, escape } from 'solid-js/web';
export { renderers } from '../renderers.mjs';

var _tmpl$ = ["<div", ' class="receipt"><h2 class="receipt-title">Payment Completed</h2><div class="receipt-details"><div class="receipt-row"><strong>Transaction ID:</strong> <!--$-->', '<!--/--></div><div class="receipt-row"><strong>Name:</strong> <!--$-->', '<!--/--></div><div class="receipt-row"><strong>Card:</strong> <!--$-->', '<!--/--></div><div class="receipt-row"><strong>Amount:</strong> <!--$-->', '<!--/--></div><div class="receipt-row"><strong>Date:</strong> <!--$-->', '<!--/--></div></div><a class="btn primary large receipt-btn" href="/">Make another payment</a></div>'];
const Receipt = (props) => {
  return ssr(_tmpl$, ssrHydrationKey(), escape(props.id), escape(props.name), escape(props.maskedCard), escape(props.amount), escape(new Date(props.date).toLocaleString()));
};

const $$Astro = createAstro();
const $$Receipt = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Receipt;
  const url = new URL(Astro2.request.url);
  const tx = url.searchParams.get("tx");
  let record = null;
  if (tx) {
    try {
      const base = new URL(Astro2.request.url).origin;
      const res = await fetch(`${base}/api/payment/${encodeURIComponent(tx)}`);
      if (res.ok) {
        record = await res.json();
      } else {
        record = null;
      }
    } catch {
      record = null;
    }
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": record ? "Payment Completed" : "Receipt", "headerTitle": record ? "Payment Completed" : "Receipt", "headerSub": record ? "Thank you \u2014 your transaction was successful." : "No transaction found." }, { "default": async ($$result2) => renderTemplate`${record ? renderTemplate`${renderComponent($$result2, "ReceiptComponent", Receipt, { "id": record.id, "name": record.name, "maskedCard": record.maskedCard, "amount": record.amount, "date": record.date, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/hp/Desktop/AstroSolid/simulation_payment/src/components/Receipt", "client:component-export": "default" })}` : renderTemplate`${maybeRenderHead()}<div class="receipt"> <p class="hint">Transaction ID missing or not found.</p> <a class="btn primary large" href="/">Back to payment</a> </div>`}` })}`;
}, "C:/Users/hp/Desktop/AstroSolid/simulation_payment/src/pages/receipt.astro", void 0);

const $$file = "C:/Users/hp/Desktop/AstroSolid/simulation_payment/src/pages/receipt.astro";
const $$url = "/receipt";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Receipt,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
