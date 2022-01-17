# Crypto order-book

This project is example of how to run a simple React application, which shows a live crypto order book.

### Main features:
- High performant UI, supports around 50-60 Fps depends on the device
- Support switching markets.
- Support sorting in the order book.
- Using React hooks only.

### About the state management:
- A better option would be to pick some state management and to set the updates with batch like redux-batch. But it has some disadvantages:
    1. You still need a cached version of the order-book before the re-render.
    2. You have a lot of boilerplating code which can be good for large projects and large teams. but not for a small short project.
- Using React.Context or useState can make things a bit simplify. The only issue that can happen- it is a bit difficult to control the side effects, while Redux has Sagas for that.
- Using pure component with React functional components will improve loading time a bit.

### Things to improve
Feel free to contribute:
- Adding more tests. Especially for components.
- Improving the Ci/Cd, splitting to Git Actions, adding e2e tests with Cypress.
- Improving CSS styling: split the App.css to each component and maybe use SCSS/Sass, also some CSS touches can be nice.
- Converting the useFetch socket to a Context instead if the project becomes more complex.
- Convert to Next.js to improve performance, support SEO and more security to the API.


### How to run?
Make sure you have npm installed.
1. install `npm i`
2. start `npm start`

### Vercel app
You can find a live version of the app:
https://order-book-react.vercel.app
