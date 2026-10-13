const whatsappNumber = import.meta.env.PUBLIC_WHATSAPP_NUMBER || '628123456789';

export function createProductWhatsAppUrl(productName: string, productCode: string): string {
  const message = `Halo Azka Meubel, saya tertarik dengan produk ${productName} (ID Produk: ${productCode}). Saya ingin menanyakan ketersediaan dan detail produk.`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

export function createContactWhatsAppUrl(name: string, phone: string, message: string): string {
  const fullMessage = `Halo Azka Meubel, saya ${name}. Nomor WhatsApp saya ${phone}. Saya ingin menanyakan: ${message}`;
  const encodedMessage = encodeURIComponent(fullMessage);
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
}

export function getWhatsAppNumber(): string {
  return whatsappNumber;
}
