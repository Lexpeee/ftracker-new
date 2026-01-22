---
trigger: always_on
---

# Codebase
- when adding libraries to package.json, run an install script
- when naming functions, use a specific name for function, avoid broad names like 'onSubmit', 'onButtonClick'
- Don't ask user to run dev
- Don't import built in React functions as a whole. Destructure the functions needed instead.
- Avoid using "use client" directives within page.tsx files. Create a separate client page within the page.tsx files and place them right beside each directory named ClientPage.tsx. Have them be named as ClientPage with no either prefixes or suffixes.wut" section
- apply as little comments as possible, considering the function and the state names are already readable and comprehensible

# File Layout
- file imports (important)
- main component callback (important)
  - states and functions in this space
  - the return
- other code that is included in this file (validations, custom css stylings)


# Design
- Follow the 8 point grid system when adding margins and paddings

# Forms
- use react-hook-form library and avoid having many useStates when dealing with forms. 
- Wrap each inputs with a <Controller/> component provided by the react-hook-form library.
- add clear error handlers