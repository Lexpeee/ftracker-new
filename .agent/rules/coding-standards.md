---
trigger: always_on
---

# Codebase
- Don't import built in React functions as a whole. Destructure the functions needed instead.
- Avoid using "use client" directives within page.tsx files. Create a separate client page within the page.tsx files and place them right beside each directory named ClientPage.tsx. Have them be named as ClientPage with no either prefixes or suffixes.

# Design
- Follow the 8 point grid system when adding margins and paddings

# Forms
- use react-hook-form library and avoid having many useStates when dealing with forms. 
- Wrap each inputs with a <Controller/> component provided by the react-hook-form library.
- add clear error handlers