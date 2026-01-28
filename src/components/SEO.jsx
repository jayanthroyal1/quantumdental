import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, canonical, schema }) {
    const siteTitle = 'Quantum Dentistry';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || "Experience the future of dental care with Quantum Dentistry. Advanced digital dentistry services in Hyderabad."} />
            <meta name="keywords" content={keywords || "dentist, digital dentistry, hyderabad, dental clinic, dental implants, smile design, best dentist near me, dental clinic near me, dentist in hyderabad, best dental clinic in hyderabad, teeth whitening, root canal treatment, braces treatment, invisible braces, pediatric dentist, dental implants cost, kids dentist near me, pediatric dental clinic, child dental specialist, best dentist for kids, RCT specialist near me, Invisalign treatment near me, invisible braces near me, top dentist in Hyderabad, top dentist in Ameerpet, dental clinic Hyderabad,  smile makeover, cosmetic dentist, orthodontist near me, emergency dentist near me, tooth extraction, teeth cleaning near me, gum treatment, dental crown, wisdom tooth removal, oral surgeon near me, dental x-ray, best dental implants clinic, full mouth rehabilitation, dental checkup near me"} />
            {canonical && <link rel="canonical" href={canonical} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || "Experience the future of dental care with Quantum Dentistry."} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || "Experience the future of dental care with Quantum Dentistry."} />

            {/* Schema.org JSON-LD */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
}
