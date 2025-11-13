import { e as createComponent$1, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_nOWAxk6x.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_PdenlSjW.mjs';
import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from 'solid-js/web';
import { createSignal, createMemo, Show } from 'solid-js';
import { b as validateCvv, c as validateExpiry, a as validateCard, v as validateName } from '../chunks/validators_B1dPmZkV.mjs';
export { renderers } from '../renderers.mjs';

var _tmpl$ = ["<div", ' id="err-name" class="error" role="alert">', "</div>"], _tmpl$2 = ["<div", ' id="err-card" class="error" role="alert">', "</div>"], _tmpl$3 = ["<div", ' id="err-expiry" class="error" role="alert">', "</div>"], _tmpl$4 = ["<div", ' id="err-cvv" class="error" role="alert">', "</div>"], _tmpl$5 = ["<div", ' class="error" role="alert">', "</div>"], _tmpl$6 = ["<form", ' class="form" novalidate', "><fieldset", ' class="fieldset"><div class="form-row" id="row-name"><label for="name" class="form-label">Name on card</label><input id="name" class="input large-input"', ' type="text"', ' placeholder="Full name" autocomplete="cc-name"><!--$-->', '<!--/--></div><div class="form-row" id="row-card"><label for="card" class="form-label">Card number</label><input id="card" class="input large-input"', ' inputmode="numeric" type="text"', ' placeholder="1234 5678 9012 3456" autocomplete="cc-number"><!--$-->', '<!--/--></div><div class="form-grid"><div class="form-row" id="row-expiry"><label for="expiry" class="form-label">Expiry (MM/YY)</label><input id="expiry" class="input"', ' inputmode="numeric" type="text"', ' placeholder="MM/YY" autocomplete="cc-exp"><!--$-->', '<!--/--></div><div class="form-row" id="row-cvv"><label for="cvv" class="form-label">CVV</label><input id="cvv" class="input"', ' inputmode="numeric" type="text"', ' placeholder="•••" autocomplete="cc-csc" maxlength="4"><!--$-->', '<!--/--></div></div><div class="form-actions"><button class="btn pay large" type="submit"', ">", "</button></div></fieldset><!--$-->", "<!--/--></form>"];
function PaymentForm() {
  const [form, setForm] = createSignal({
    name: "",
    card: "",
    expiry: "",
    cvv: ""
  });
  const [errors, setErrors] = createSignal({});
  const [loading, setLoading] = createSignal(false);
  const [touched, setTouched] = createSignal({
    name: false,
    card: false,
    expiry: false,
    cvv: false
  });
  const [actualCvv, setActualCvv] = createSignal("");
  const [maskedCvv, setMaskedCvv] = createSignal("");
  const validation = createMemo(() => ({
    name: validateName(form().name),
    card: validateCard(form().card),
    expiry: validateExpiry(form().expiry),
    cvv: validateCvv(actualCvv())
    // Validate against actual CVV
  }));
  const isValid = createMemo(() => Object.values(validation()).every((v) => !v));
  return ssr(_tmpl$6, ssrHydrationKey(), ssrAttribute("aria-busy", escape(loading(), true), false), ssrAttribute("disabled", loading(), true), ssrAttribute("aria-invalid", !!validation().name, false) + ssrAttribute("aria-describedby", validation().name ? "err-name" : escape(void 0, true), false), ssrAttribute("value", escape(form().name, true), false), escape(createComponent(Show, {
    get when() {
      return touched().name && validation().name;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(validation().name));
    }
  })), ssrAttribute("aria-invalid", !!validation().card, false) + ssrAttribute("aria-describedby", validation().card ? "err-card" : escape(void 0, true), false), ssrAttribute("value", escape(form().card, true), false), escape(createComponent(Show, {
    get when() {
      return touched().card && validation().card;
    },
    get children() {
      return ssr(_tmpl$2, ssrHydrationKey(), escape(validation().card));
    }
  })), ssrAttribute("aria-invalid", !!validation().expiry, false) + ssrAttribute("aria-describedby", validation().expiry ? "err-expiry" : escape(void 0, true), false), ssrAttribute("value", escape(form().expiry, true), false), escape(createComponent(Show, {
    get when() {
      return touched().expiry && validation().expiry;
    },
    get children() {
      return ssr(_tmpl$3, ssrHydrationKey(), escape(validation().expiry));
    }
  })), ssrAttribute("aria-invalid", !!validation().cvv, false) + ssrAttribute("aria-describedby", validation().cvv ? "err-cvv" : escape(void 0, true), false), ssrAttribute("value", escape(maskedCvv(), true), false), escape(createComponent(Show, {
    get when() {
      return touched().cvv && validation().cvv;
    },
    get children() {
      return ssr(_tmpl$4, ssrHydrationKey(), escape(validation().cvv));
    }
  })), ssrAttribute("disabled", loading() || !isValid(), true), loading() ? "Processing..." : "Pay ₹499", escape(createComponent(Show, {
    get when() {
      return errors().submit;
    },
    get children() {
      return ssr(_tmpl$5, ssrHydrationKey(), escape(errors().submit));
    }
  })));
}

const $$Index = createComponent$1(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Complete your payment", "headerTitle": "Complete your payment", "headerSub": "Secure payment \u2014 fast & simple" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "PaymentForm", PaymentForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/hp/Desktop/AstroSolid/simulation_payment/src/components/PaymentForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/hp/Desktop/AstroSolid/simulation_payment/src/pages/index.astro", void 0);

const $$file = "C:/Users/hp/Desktop/AstroSolid/simulation_payment/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
