# Forbes Water — Website Content Review

**Prepared for:** Forbes Water
**Purpose:** Review the website and identify the placeholder content that needs to be replaced with your real information before launch.
**Status:** Draft website for review — running locally, not yet live.

---

## 1. Website Overview

The Forbes Water website has been built as a modern, fast marketing site covering all **20 pages** — Home, About, Services (with 8 individual service pages), Industries (with 5 individual industry pages), Sustainability, Projects, and Contact.

- The **front-end** (what visitors see) has been fully developed and matches the approved design.
- All **text and images** are managed through **Strapi CMS**, a content management system. This means you can update wording, swap photos, and add content yourself later — without needing a developer to change the code.

The website is complete and working. What it currently contains is **placeholder content** — realistic sample text, stock photos, and example figures used so the design could be reviewed. This report lists that placeholder content page by page so you can see exactly what needs to be replaced with your real details.

---

## 2. How to Use This Report

Go through it **page by page**. For each page, we list what is placeholder and what we need from you. Use the checklist in Section 6 to track what you provide.

Three things appear on nearly every page and are worth noting once:

| Item | Currently showing | What we need |
|---|---|---|
| **Phone** | `1300 000 000` *(placeholder)* | Your real phone number |
| **Email** | `enquiries@forbeswater.com.au` *(placeholder)* | Your real enquiries email |
| **ABN** | `ABN 00 000 000 000` *(placeholder)* | Your real ABN |
| **Photos** | Stock photography throughout | Your real site/team photography (optional but recommended) |
| **Statistics** | e.g. 18+ years, 340+ sites, 32%, 1.2GL | Confirm or correct each figure |

> **Note on address:** The current design shows coverage as *"Servicing all Australian states & territories"* but does **not** include a physical street address. If you'd like a business address shown, please let us know and we'll add it.

---

## 3. Placeholder Content — Page by Page

### Home — `/`
| Section | Placeholder content | Action needed |
|---|---|---|
| Hero image | Stock photo (field operations) | Replace with real photo (optional) |
| Hero statistics | **18+** years · **340+** sites · **100%** independent | Confirm figures |
| Testimonial | Sample quote from *"Operations Manager · Regional mining operation"* — marked *representative client feedback* | Provide a real client quote & attribution |
| Testimonial stats | **32%** cost reduction · **1.2GL** recycled · **Zero** breaches · **24h** response | Confirm figures |
| Projects preview | Shows 3 sample projects (see Projects page) | See Projects |

### About — `/about`
| Section | Placeholder content | Action needed |
|---|---|---|
| Story text | Sample company story ("Built in the field, not the boardroom") | Confirm or provide your real story |
| Story image | Stock photo (team on site) | Replace with real team photo (optional) |
| **Team members** | 3 placeholder people — **[Principal Name]**, **[Engineer Name]**, **[Scientist Name]** — each with a placeholder job title and a sample bio | Provide **real names, titles, bios, and photos** |
| "18+ years" reference | In intro text | Confirm figure |

### Services — `/services`
| Section | Placeholder content | Action needed |
|---|---|---|
| 8 service pages | Titles and descriptions are drafted from the approved content | Review wording for each |
| Service images | Each of the 8 services uses a stock photo | Replace with real photos (optional) |

The 8 services are: Industrial Water Treatment · Drinking Water Quality · Wastewater Solutions · Water Recycling & Reuse · Groundwater & Bore Monitoring · Water Testing & Compliance · Process Optimisation · Sustainable Water Management.

> Each service page has its own hero, overview, outcomes, and process steps — all editable text, all currently drafted sample copy for you to review.

### Industries — `/industries`
| Section | Placeholder content | Action needed |
|---|---|---|
| 5 industry pages | Mining · Agriculture · Commercial & Industrial · Government & Municipal · Hospitality & Facilities | Review wording for each |
| Industry images | Each of the 5 industries uses a stock photo | Replace with real photos (optional) |
| Industry statistics | Each industry page shows a sample stat | Confirm figures |

### Sustainability — `/sustainability`
| Section | Placeholder content | Action needed |
|---|---|---|
| Impact figures | Sample metrics, explicitly marked *"representative examples for design review — final metrics to be confirmed"* | Provide real figures |
| Body text | Drafted sample copy | Review wording |

### Projects — `/projects`
All **6 case studies are sample examples**, marked *"representative examples … to be replaced with approved client projects."* Each uses a stock photo and invented result figures:

| Case study | Sector | Sample results |
|---|---|---|
| Process water recycling scheme, WA goldfields | Mining | 1.2GL/yr displaced · 2.1yr payback |
| Regional drinking water scheme upgrade | Government | 100% compliance · 4 communities |
| Trade waste reduction, food manufacturer | Industrial | −58% BOD load · $310k/yr saved |
| Legionella management program, hotel group | Hospitality | 9 properties · zero detections |
| Bore field rehabilitation, irrigated cropping | Agriculture | +64% yield · 3wk ahead of season |
| Cooling system optimisation, manufacturing campus | Industrial | −27% water use · −35% chemical spend |

**Action needed:** Provide your real projects — titles, descriptions, result figures, and photos. Or tell us which sample projects to keep/remove.

### Contact — `/contact`
| Section | Placeholder content | Action needed |
|---|---|---|
| Phone / Email / ABN | Placeholders (see Section 2) | Provide real details |
| Enquiry form | Fully working; submissions are saved | Confirm which email should receive enquiry notifications |
| Industry dropdown | Mining · Agriculture · Commercial & Industrial · Government & Municipal · Hospitality & Facilities · Other | Confirm this list |

### Footer (all pages)
| Item | Placeholder content | Action needed |
|---|---|---|
| Phone, email, ABN | Placeholders | Provide real details |
| Copyright | © 2026 Forbes Water Pty Ltd | Confirm legal entity name |

---

## 4. Managed Through Strapi CMS

**Strapi CMS is already integrated.** Every page listed above is content-managed, which means you (or your team) will be able to:

- ✅ Update any text
- ✅ Replace existing images with your own
- ✅ Upload new images
- ✅ Add, edit, or remove items such as team members, projects, services, and industries

**Content areas managed through Strapi:**

- Home, About, Services, Industries, Sustainability, Projects, and Contact pages
- All 8 individual service pages
- All 5 individual industry pages
- Team members, project case studies, contact details, navigation menu, and footer

**Fixed by design (not editable):** the overall layout, colours, brand styling, icons, and page structure are part of the approved design and stay consistent across the site. Content changes; the design stays intact.

---

## 5. Current Review Environment

- The website is **running locally and is not yet deployed to a live server.**
- To let you review it, we will expose the local site (running on port 3000) using **ngrok**, which creates a **temporary public link** you can open in any browser. This link is for review only and will change/expire.
- **Strapi (the admin panel) is not publicly accessible yet**, because the project has not been deployed. Once the site is hosted on a live server, you will also be able to log in to Strapi — with the appropriate credentials and permissions — to manage content yourself.

---

## 6. Summary — Action Items for the Client

Please provide the following so we can replace the placeholder content before launch:

- [ ] **Contact details** — real phone number, enquiries email, ABN
- [ ] **Business address** — if you want one displayed (none shown currently)
- [ ] **Team** — real names, job titles, bios, and photos (3 people)
- [ ] **Projects** — real case studies with results and photos (or confirm which samples to keep)
- [ ] **Statistics** — confirm or correct all figures (18+, 340+, 32%, 1.2GL, 24h, etc.)
- [ ] **Testimonial** — a real client quote and attribution
- [ ] **Photography** — real photos for the home, about, service, industry, and project sections (optional; stock images used meanwhile)
- [ ] **Copy review** — read through each page's wording and note any changes
- [ ] **Enquiry notifications** — confirm which email address should receive contact-form submissions

Once we have these, we'll load your real content into the CMS and prepare the site for deployment to a live server.

---

*This document reviews the current draft of the Forbes Water website. All placeholder content is intentional and clearly marked, pending your final content.*
