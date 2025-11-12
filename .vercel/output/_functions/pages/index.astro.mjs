import { e as createComponent$1, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BoSdno3s.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_DJwnb3-v.mjs';
import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from 'solid-js/web';
import { createSignal, createMemo, Show } from 'solid-js';
import { v as validateName, a as validateCard, b as validateExpiry, c as validateCvv } from '../chunks/validators_K8FygQuz.mjs';
export { renderers } from '../renderers.mjs';

var _tmpl$ = ["<div", ' class="error" role="alert">', "</div>"], _tmpl$2 = ["<form", ' class="form" novalidate><div class="form-row"><label class="form-label">Name on card</label><input class="input large-input"', ' placeholder="Full name" autocomplete="cc-name"><!--$-->', '<!--/--></div><div class="form-row"><label class="form-label">Card number</label><input class="input large-input" inputmode="numeric" placeholder="1234 5678 9012 3456"', ' autocomplete="cc-number"><!--$-->', '<!--/--></div><div class="form-grid"><div><label class="form-label">Expiry (MM/YY)</label><input class="input" inputmode="numeric" placeholder="MM/YY"', ' autocomplete="cc-exp"><!--$-->', '<!--/--></div><div><label class="form-label">CVV</label><input class="input" type="password" inputmode="numeric" placeholder="***" maxlength="4"', ' autocomplete="cc-csc"><!--$-->', '<!--/--></div></div><div class="form-actions"><button class="btn pay large" type="submit"', ">", "</button></div><!--$-->", "<!--/--></form>"];
function PaymentForm() {
  const [name, setName] = createSignal("");
  const [card, setCard] = createSignal("");
  const [expiry, setExpiry] = createSignal("");
  const [cvv, setCvv] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [fieldErrors, setFieldErrors] = createSignal({
    name: "",
    card: "",
    expiry: "",
    cvv: "",
    global: ""
  });
  const isValid = createMemo(() => {
    const eName = validateName(name());
    const eCard = validateCard(card());
    const eExp = validateExpiry(expiry());
    const eCvv = validateCvv(cvv());
    setFieldErrors({
      name: eName,
      card: eCard,
      expiry: eExp,
      cvv: eCvv,
      global: ""
    });
    return !eName && !eCard && !eExp && !eCvv;
  });
  return ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("value", escape(name(), true), false), escape(createComponent(Show, {
    get when() {
      return fieldErrors().name;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(fieldErrors().name));
    }
  })), ssrAttribute("value", escape(card(), true), false), escape(createComponent(Show, {
    get when() {
      return fieldErrors().card;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(fieldErrors().card));
    }
  })), ssrAttribute("value", escape(expiry(), true), false), escape(createComponent(Show, {
    get when() {
      return fieldErrors().expiry;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(fieldErrors().expiry));
    }
  })), ssrAttribute("value", escape(cvv(), true), false), escape(createComponent(Show, {
    get when() {
      return fieldErrors().cvv;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(fieldErrors().cvv));
    }
  })), ssrAttribute("disabled", !isValid() || loading(), true), loading() ? "Processing..." : "Pay ₹499", escape(createComponent(Show, {
    get when() {
      return fieldErrors().global;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(fieldErrors().global));
    }
  })));
}

const $$Index = createComponent$1(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Complete your payment", "headerTitle": "Complete your payment", "headerSub": "Secure payment \u2014 fast & simple" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "PaymentForm", PaymentForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/hp/Desktop/AstroSolid/simulation_payment/src/components/PaymentForm", "client:component-export": "default" })} ` })}`;
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
