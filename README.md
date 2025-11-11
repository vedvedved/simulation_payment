This code base is the simple simulation of a complete payment transaction.


## Scope of improvement identified :
1. Payment failed simulation
2. Animations could be integrated during various loading stages of payment validation, processing and confirmation.
3. Export/download receipt options
4. Testing using Vitest for unit testing and solid's testing library for integration testing could automate the testing flow and improve continuos development process.


## My learnings
index.astro is the entry point for our code. this loads the static html page for our applicaqation which will be hydrated later for interactivity wherein solid will take charge over astro.

when "proceed" is clicked, form is now visible through a state change.
form inputs : signals are now updated raectively, then the validation logic is triggered, button enabled after all validations pass. 

async call for transaction receipt made after 1.2 secs.


instead of multiple re renders via diffing algo like in react, solid actually works via creation of signals that directly changes the required part of DOM upon any change detection. So, there is no Vdom here and signals listen to changes thus ommiting the re-renders.The performance hit taken my react otherwise is efficiently tackled here.



## There are three primary UI states:

showForm — whether the payment form is visible
loading — whether payment is processing
receipt — the generated receipt (if present, payment done)

Plus, signals for each field (name, card, expiry, cvv) and errors.

## key checks

1. Pay button disabled till all user inputs provided preventing unnecessary api calls for real use case.
2. Luhn check for valid card numbers implemented. 