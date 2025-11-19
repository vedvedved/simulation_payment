import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_nOWAxk6x.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_C0i8Mrwe.mjs';
import { ssr, ssrHydrationKey, escape } from 'solid-js/web';
export { renderers } from '../renderers.mjs';

var _tmpl$ = ["<div", ' class="receipt" role="region" aria-labelledby="receipt-title"><h2 id="receipt-title" class="receipt-title">Payment Completed</h2><div class="receipt-details"><p><strong>Transaction ID:</strong> <!--$-->', "<!--/--></p><p><strong>Name:</strong> <!--$-->", "<!--/--></p><p><strong>Card:</strong> <!--$-->", "<!--/--></p><p><strong>Amount:</strong> <!--$-->", "<!--/--></p><p><strong>Date:</strong> <!--$-->", '<!--/--></p></div><a class="btn primary large" href="/">Make another payment</a></div>'];
const Receipt = (p) => ssr(_tmpl$, ssrHydrationKey(), escape(p.id), escape(p.name), escape(p.maskedCard), escape(p.amount), escape(new Date(p.date).toLocaleString()));

const $$Astro = createAstro();
const $$Receipt = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Receipt;
  const url = new URL(Astro2.request.url);
  const tx = url.searchParams.get("tx");
  let record = null;
  let fetchError = null;
  if (tx) {
    try {
      const base = url.origin;
      const res = await fetch(`${base}/api/payment/${encodeURIComponent(tx)}`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        record = await res.json();
      } else if (res.status === 404) {
        fetchError = "Transaction not found.";
      } else {
        fetchError = `Server returned ${res.status}`;
      }
    } catch (err) {
      console.error("Receipt fetch error:", err);
      fetchError = "Unable to fetch receipt.";
    }
  } else {
    fetchError = "Transaction id (tx) missing from URL.";
  }
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": record ? "Payment Completed" : "Receipt", "headerTitle": record ? "Payment Completed" : "Receipt", "headerSub": record ? "Thank you \u2014 your transaction was successful." : "Transaction details" }, { "default": async ($$result2) => renderTemplate`${record ? renderTemplate`<!-- Render Receipt component as a client island so it can be interactive if needed -->
    ${renderComponent($$result2, "ReceiptComponent", Receipt, { "id": record.id, "name": record.name, "maskedCard": record.maskedCard, "amount": record.amount, "date": record.date, "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/billeasymacbookpro/Documents/assignment/simulation_payment/src/components/Receipt", "client:component-export": "default" })}` : renderTemplate`${maybeRenderHead()}<div class="receipt"> <p class="hint">${fetchError ?? "Transaction not found."}</p> <a class="btn primary large" href="/">Back to payment</a> </div>`}` })}`;
}, "/Users/billeasymacbookpro/Documents/assignment/simulation_payment/src/pages/receipt.astro", void 0);

const $$file = "/Users/billeasymacbookpro/Documents/assignment/simulation_payment/src/pages/receipt.astro";
const $$url = "/receipt";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Receipt,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
