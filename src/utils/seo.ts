interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export const updateSEO = (data: SEOData) => {
  // Update document title
  document.title = data.title;

  // Helper function to update or create meta tag
  const updateMetaTag = (selector: string, content: string) => {
    let element = document.querySelector(selector) as HTMLMetaElement;
    if (element) {
      element.content = content;
    } else {
      element = document.createElement('meta');
      if (selector.startsWith('[name=')) {
        element.name = selector.slice(6, -2);
      } else if (selector.startsWith('[property=')) {
        element.setAttribute('property', selector.slice(10, -2));
      }
      element.content = content;
      document.head.appendChild(element);
    }
  };

  // Update basic meta tags
  updateMetaTag('[name="description"]', data.description);
  
  if (data.keywords) {
    updateMetaTag('[name="keywords"]', data.keywords);
  }

  // Update Open Graph tags
  updateMetaTag('[property="og:title"]', data.title);
  updateMetaTag('[property="og:description"]', data.description);
  updateMetaTag('[property="og:type"]', data.ogType || 'website');
  updateMetaTag('[property="og:url"]', window.location.href);
  
  if (data.ogImage) {
    updateMetaTag('[property="og:image"]', data.ogImage);
    updateMetaTag('[property="og:image:alt"]', data.title);
  }

  // Update Twitter Card tags
  updateMetaTag('[name="twitter:card"]', 'summary_large_image');
  updateMetaTag('[name="twitter:title"]', data.title);
  updateMetaTag('[name="twitter:description"]', data.description);
  
  if (data.ogImage) {
    updateMetaTag('[name="twitter:image"]', data.ogImage);
  }

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (canonical) {
    canonical.href = data.canonicalUrl || window.location.href;
  } else {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = data.canonicalUrl || window.location.href;
    document.head.appendChild(canonical);
  }

  // Handle robots meta tag for noIndex
  if (data.noIndex) {
    updateMetaTag('[name="robots"]', 'noindex, nofollow');
  } else {
    updateMetaTag('[name="robots"]', 'index, follow');
  }
};

export const getDefaultOGImage = () => {
  return `${window.location.origin}/og-default.jpg`;
};

export const generateEventOGImage = (eventTitle: string, eventDate: string) => {
  // In a real application, you might generate dynamic OG images
  // For now, return a default image
  return getDefaultOGImage();
};