# Aman Sharma — Personal Portfolio Website

Professional responsive personal portfolio built with separate HTML, CSS and JavaScript files.

## Project structure

```text
aman-portfolio/
├── index.html
├── contact.php
├── 404.html
├── robots.txt
├── sitemap.xml
├── manifest.webmanifest
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
└── assets/
    └── images/
        ├── aman.jpg
        └── favicon.svg
```

## Main features

- Fully responsive desktop / tablet / mobile layout
- Light and dark theme
- Mobile navigation
- Active section navigation
- Scroll progress indicator
- Reveal animations with reduced-motion support
- About, Education, Skills, Projects, Certifications and Contact sections
- Contact form with PHP endpoint and spam honeypot
- SEO metadata, Open Graph, Person schema, sitemap and robots.txt
- 404 page
- Accessible labels, keyboard support and semantic HTML

## Contact form

`contact.php` uses PHP `mail()`. Your hosting provider must support PHP mail delivery. If it does not, replace the endpoint with a transactional email service or contact-form provider.

## Deployment

Upload the contents of this folder to the document root for `amansharma.com.np` (often `public_html`). Enable HTTPS/SSL and test the contact form after deployment.

## Social and contact links
The site includes icon-based links for LinkedIn, GitHub, Instagram, Facebook, email, both phone numbers, the portfolio domain, and project repositories. Brand icons are embedded as inline SVG symbols, so no external icon library is required.
