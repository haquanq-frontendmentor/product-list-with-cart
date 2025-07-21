## Frontend Mentor - Product list with cart solution

This is a solution to the [Product list with cart challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-list-with-cart-5MmqLVAp_d). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

<a href="">
    <img alt="Solution post" src="https://img.shields.io/badge/Frontendmentor-blue?label=Solution%20on&style=flat-square">
</a>
<a href="">
    <img alt="Live demo" src="https://img.shields.io/badge/Demo-teal?label=Live&style=flat-square">
</a>
<a href="./LICENSE"><img allt="MIT License" src="https://badgen.now.sh/badge/license/MIT"/></a>

## Table of contents

- [Project overview](#clipboard-project-overview)
- [Development workflow](#seedling-development-workflow)
- [Working in this repository](#astronaut-working-in-this-repository)

## :clipboard: Project overview

### Challenge requirements

- Add items to the cart and remove them
- Increase/decrease the number of items in the cart
- See an order confirmation modal when they click "Confirm Order"
- Reset their selections when they click "Start New Order"
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Implemented features

Features

- [x] Manage cart of products, confirm current order

Accessibility

- [x] Site is responsive to different screen size
- [x] Interactive elements have clear indicator when focused/hovered

### Preview

![](./docs/design/desktop-design-empty.jpg)

## :seedling: Development workflow

### Approach

Site built with mobile-first workflow to prioritize mobile devices, made accessible using [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/).

### Tools

- **PostCSS**: use SASS-like features in vanilla CSS, interpolation and minification.
- **JavaScript**: add interactivity for components, handle application logic.
- **Vite**: fast development server, production build and easy configuration.
- **Prettier**: code formatter to maintain consistent coding style.
- **Stylelint**: lint for CSS coding convention mistakes.
- **Husky & lint-staged**: manage git hooks (primary used for pre-commit hook: linting, formatting).

### Deployment

Deployed on github page using Github Actions (manually triggered).

## :astronaut: Working in this repository

### Presequisites

Having these tools installed:

- Git (prefer lastest LTS version)
- NodeJS (prefer latest LTS version)

### Clone this project to your machine

Open new terminal, run the following command:

```
git clone https://github.com/haquanq/fm-product-list-with-cart.git
```

Then, run `npm install` to install all dependencies.

```
npm install
```

### Development workflow

In terminal, run `npm run dev` to start development server:

```
npm run dev
```
