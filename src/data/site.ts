// Business details in one place. RedFine is a demo brand: there is no real address or phone number.
// To send WhatsApp messages to a real business, put its number here in international format without "+"
// (e.g. "9665XXXXXXXX"). While it is empty, WhatsApp links open in share mode and the visitor picks the chat.
export const SITE = {
  whatsappNumber: '',
};

export function whatsappLink(message: string) {
  const text = encodeURIComponent(message);
  return SITE.whatsappNumber ? `https://wa.me/${SITE.whatsappNumber}?text=${text}` : `https://wa.me/?text=${text}`;
}

// Photos are served by Unsplash's image CDN, which picks AVIF or WebP for the browser (auto=format) and
// resizes on request, so each photo gets a responsive srcset.
export function unsplash(id: string, width = 800) {
  return `https://images.unsplash.com/${id}?q=75&w=${width}&auto=format&fit=crop`;
}

export function unsplashSrcSet(id: string, widths = [480, 800, 1200, 1600]) {
  return widths.map((w) => `${unsplash(id, w)} ${w}w`).join(', ');
}
