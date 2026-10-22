# NeuraBot AI Solutions

NeuraBot AI Solutions is a fictional five-page business website for an AI solutions and chatbot services studio. The site presents a dark navy, electric blue, and purple visual system with a responsive layout, shared navigation, accessible interaction patterns, and a practical, editorial tech tone.

## Pages

- `index.html` — Home page with hero CTA, services preview, principles, stats, testimonials, and a final CTA.
- `about.html` — Company story, mission, vision, team, technology stack, and timeline.
- `services.html` — Six AI service offerings plus Signal, Build, and Scale pricing plans.
- `portfolio.html` — Eight filterable case-study cards with a keyboard-friendly lightbox preview.
- `contact.html` — Contact form with client-side validation, contact details, map placeholder, and FAQ accordion.

## Structure

```text
.
├── index.html
├── about.html
├── services.html
├── portfolio.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
├── manus-routes.json
└── README.md
```

All behavior is implemented in `js/script.js` with vanilla JavaScript: mobile navigation, active-page state, scroll reveals, animated counters, a demo chatbot, portfolio filtering, lightbox interactions, form validation, FAQ accordion behavior, service preselection, and back-to-top controls.

## Run locally

Because this is a static site, it can be opened directly in a browser. For the most reliable local experience, serve the project directory with any static HTTP server:

```bash
python3 -m http.server 3000
```

Then open <http://localhost:3000> and use the navigation to explore the pages. External Unsplash image URLs and Google Fonts require an internet connection.

## Notes

The contact form is a front-end demo: valid submissions show an inline success state and do not send data to a server. The map is a styled placeholder linked to Google Maps directions, and the chatbot uses predefined local replies for services, pricing, and contact questions.
