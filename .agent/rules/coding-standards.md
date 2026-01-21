---
trigger: always_on
---

- Don't import built in React functions as a whole. Destructure the functions needed instead.
- Avoid using "use client" directives within page.tsx files. Create a separate client page within the page.tsx files and place them right beside each directory named ClientPage.tsx. Have them be named as ClientPage with no either prefixes or suffixes. 