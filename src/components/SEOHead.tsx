import React, { useEffect } from 'react';
import { updateSEO } from '../utils/seo';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

const SEOHead: React.FC<SEOHeadProps> = (props) => {
  useEffect(() => {
    updateSEO(props);
  }, [props]);

  return null; // This component doesn't render anything
};

export default SEOHead;