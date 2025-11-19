import { e as createComponent$1, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_nOWAxk6x.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_C0i8Mrwe.mjs';
import { ssr, ssrHydrationKey, ssrAttribute, escape, createComponent } from 'solid-js/web';
import { createSignal, createMemo, Show } from 'solid-js';
import { b as validateCvv, c as validateExpiry, a as validateCard, v as validateName, f as formatCardInput, d as formatExpiryInput } from '../chunks/validators_BBVUDfCN.mjs';
export { renderers } from '../renderers.mjs';

var _tmpl$$5 = ["<div", ' class="form-row"><label', ' class="form-label">', "</label><input", ' class="input"', "><!--$-->", "<!--/--></div>"], _tmpl$2$4 = ["<div", ' class="error" role="alert">', "</div>"];
const TextField = (p) => ssr(_tmpl$$5, ssrHydrationKey(), ssrAttribute("for", escape(p.id, true), false), escape(p.label), ssrAttribute("id", escape(p.id, true), false), ssrAttribute("value", escape(p.value, true), false) + ssrAttribute("inputmode", escape(p.inputMode, true) ?? escape(void 0, true), false) + ssrAttribute("placeholder", escape(p.placeholder, true), false), p.error ? ssr(_tmpl$2$4, ssrHydrationKey(), escape(p.error)) : escape(null));

var _tmpl$$4 = ["<div", ' class="form-row"><label class="form-label" for="card">Card number</label><input id="card" class="input large-input"', ' inputmode="numeric"><!--$-->', "<!--/--></div>"], _tmpl$2$3 = ["<div", ' class="error">', "</div>"];
const CardField = (p) => ssr(_tmpl$$4, ssrHydrationKey(), ssrAttribute("value", escape(p.value, true), false), p.error ? ssr(_tmpl$2$3, ssrHydrationKey(), escape(p.error)) : escape(null));

var _tmpl$$3 = ["<div", ' class="form-row"><label class="form-label" for="expiry">Expiry (MM/YY)</label><input id="expiry" class="input"', ' inputmode="numeric"><!--$-->', "<!--/--></div>"], _tmpl$2$2 = ["<div", ' class="error">', "</div>"];
const ExpiryField = (p) => ssr(_tmpl$$3, ssrHydrationKey(), ssrAttribute("value", escape(p.value, true), false), p.error ? ssr(_tmpl$2$2, ssrHydrationKey(), escape(p.error)) : escape(null));

function isValidationClear(validation) {
  return Object.values(validation).every((v) => v === "");
}

var _tmpl$$2 = ["<div", ' class="form-row"><label class="form-label" for="cvv">CVV</label><input id="cvv" class="input" inputmode="numeric" maxlength="4"', "><!--$-->", "<!--/--></div>"], _tmpl$2$1 = ["<div", ' class="error">', "</div>"];
const CvvField = (p) => ssr(_tmpl$$2, ssrHydrationKey(), ssrAttribute("value", escape(p.masked, true), false), p.error ? ssr(_tmpl$2$1, ssrHydrationKey(), escape(p.error)) : escape(null));

var _tmpl$$1 = ["<div", ' class="form-actions"><button class="btn pay large" type="submit"', ">", "</button></div>"];
const FormActions = (p) => ssr(_tmpl$$1, ssrHydrationKey(), ssrAttribute("disabled", p.loading || p.disabled, true) + ssrAttribute("aria-disabled", escape(p.loading, true) || escape(p.disabled, true), false), p.loading ? "Processing..." : escape(p.label) ?? "Pay ₹499");

var _tmpl$ = ["<div", ' class="error">', "</div>"], _tmpl$2 = ["<form", ' class="form" novalidate><!--$-->', "<!--/--><!--$-->", '<!--/--><div class="form-grid"><!--$-->', "<!--/--><!--$-->", "<!--/--></div><!--$-->", "<!--/--><!--$-->", "<!--/--></form>"];
function PaymentForm() {
  const [form, setForm] = createSignal({
    name: "",
    card: "",
    expiry: "",
    cvv: ""
  });
  const [actualCvv, setActualCvv] = createSignal("");
  const [maskedCvv, setMaskedCvv] = createSignal("");
  const [touched, setTouched] = createSignal({
    name: false,
    card: false,
    expiry: false,
    cvv: false
  });
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal({});
  const validation = createMemo(() => ({
    name: validateName(form().name),
    card: validateCard(form().card),
    expiry: validateExpiry(form().expiry),
    cvv: validateCvv(actualCvv())
  }));
  const isValid = createMemo(() => isValidationClear(validation()));
  return ssr(_tmpl$2, ssrHydrationKey(), escape(createComponent(TextField, {
    id: "name",
    label: "Name on card",
    get value() {
      return form().name;
    },
    onInput: (v) => {
      setForm({
        ...form(),
        name: v
      });
      setTouched({
        ...touched(),
        name: true
      });
    },
    get error() {
      return touched().name ? validation().name : "";
    }
  })), escape(createComponent(CardField, {
    get value() {
      return form().card;
    },
    onInput: (v) => {
      setForm({
        ...form(),
        card: formatCardInput(v)
      });
      setTouched({
        ...touched(),
        card: true
      });
    },
    get error() {
      return touched().card ? validation().card : "";
    }
  })), escape(createComponent(ExpiryField, {
    get value() {
      return form().expiry;
    },
    onInput: (v) => {
      setForm({
        ...form(),
        expiry: formatExpiryInput(v)
      });
      setTouched({
        ...touched(),
        expiry: true
      });
    },
    get error() {
      return touched().expiry ? validation().expiry : "";
    }
  })), escape(createComponent(CvvField, {
    get actual() {
      return actualCvv();
    },
    get masked() {
      return maskedCvv();
    },
    setActual: setActualCvv,
    setMasked: setMaskedCvv,
    get error() {
      return touched().cvv ? validation().cvv : "";
    }
  })), escape(createComponent(FormActions, {
    get loading() {
      return loading();
    },
    get disabled() {
      return !isValid();
    }
  })), escape(createComponent(Show, {
    get when() {
      return errors().submit;
    },
    get children() {
      return ssr(_tmpl$, ssrHydrationKey(), escape(errors().submit));
    }
  })));
}

const $$Index = createComponent$1(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Complete your payment", "headerTitle": "Complete your payment", "headerSub": "Secure payment \u2014 fast & simple" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "PaymentForm", PaymentForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/billeasymacbookpro/Documents/assignment/simulation_payment/src/components/PaymentForm", "client:component-export": "default" })} ` })}`;
}, "/Users/billeasymacbookpro/Documents/assignment/simulation_payment/src/pages/index.astro", void 0);

const $$file = "/Users/billeasymacbookpro/Documents/assignment/simulation_payment/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
