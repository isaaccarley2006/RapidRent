import React from 'react'
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title?: string
  description?: string
  canonical?: string
  noindex?: boolean
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  canonical,
  noindex 
}) => {
  const isStaging = import.meta.env.VITE_APP_ENV === 'staging'
  const baseUrl = isStaging ? 'https://staging.rentview.co.uk' : 'https://rentview.co.uk'
  
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={`${baseUrl}${canonical}`} />}
      {(noindex || isStaging) && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}