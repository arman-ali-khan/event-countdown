export const shareToFacebook = (url: string, title: string) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
};

export const shareToTwitter = (url: string, title: string) => {
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
};

export const shareToWhatsApp = (url: string, title: string) => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  window.open(whatsappUrl, '_blank');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};