import { e as createComponent, f as createAstro, l as renderHead, n as renderSlot, r as renderTemplate } from './astro/server_BoSdno3s.mjs';
import 'clsx';

const $$Astro = createAstro();
const $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const {
    title = "Payment Simulation UI",
    headerTitle = null,
    headerSub = null
  } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="stylesheet" href="/styles/style.css">${renderHead()}</head> <body> <main class="page"> <div class="card"> ${headerTitle ? renderTemplate`<header class="checkout-header"> <h1 class="checkout-title">${headerTitle}</h1> ${headerSub ? renderTemplate`<p class="checkout-sub">${headerSub}</p>` : null} </header>` : null} <hr class="checkout-sep"> ${renderSlot($$result, $$slots["default"])} </div> </main> </body></html>`;
}, "C:/Users/hp/Desktop/AstroSolid/simulation_payment/src/layouts/BaseLayout.astro", void 0);

export { $$BaseLayout as $ };
