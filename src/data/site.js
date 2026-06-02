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
  email: 'veer81351@gmail.com',
  location: 'Gujarat, India',

  // WhatsApp — primary commission channel.
  // Use international format, digits only (no + or spaces). e.g. India: 91 followed by the 10-digit number.
  whatsapp: '919978134660',
  whatsappMessage:
    "Hi Veer! I saw your portfolio and I'd like to order a custom sketch. Could you share details?",

  // Social links — the homes you want to grow. Remove any you don't use.
  socials: [
    { label: 'Instagram', handle: '@veerart_0224', url: 'https://instagram.com/veerart_0224' },
  ],
}

// Build a wa.me URL with a prefilled message — open in a new tab from any CTA.
export const waUrl = (message = site.whatsappMessage) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`
