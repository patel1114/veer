/* ============================================================
   Site-wide details — edit these to personalise the portfolio.
   Anything marked TODO is a placeholder to replace with Veer's
   real information.
   ============================================================ */

export const site = {
  name: 'Veer',
  role: 'Sketch Artist',
  // The big editorial line in the hero. Keep it short and evocative.
  tagline: 'Memories, drawn by hand.',
  intro:
    'Hyper-real graphite & charcoal art — lifelike portraits, family keepsakes and devotional drawings, each one made entirely by hand.',

  // Contact — replace with real values.
  email: 'hello@veerart.in', // TODO: Veer's real email
  location: 'Gujarat, India', // TODO: Veer's city

  // WhatsApp — primary commission channel.
  // Use international format, digits only (no + or spaces). e.g. India: 91 followed by the 10-digit number.
  whatsapp: '919999999999', // TODO: Veer's real WhatsApp number
  whatsappMessage:
    "Hi Veer! I saw your portfolio and I'd like to order a custom sketch. Could you share details?",

  // Social links — the homes you want to grow. Remove any you don't use.
  socials: [
    { label: 'Instagram', handle: '@veer.sketches', url: 'https://instagram.com/' }, // TODO: real handle
    { label: 'Behance', handle: 'veer', url: 'https://behance.net/' }, // TODO
    { label: 'Pinterest', handle: 'veer', url: 'https://pinterest.com/' }, // TODO
  ],
}

// Build a wa.me URL with a prefilled message — open in a new tab from any CTA.
export const waUrl = (message = site.whatsappMessage) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
