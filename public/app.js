'use strict';

// stateobject
const epiQuotes = {
  quotes: [
    {
    source: {
      firstName: String,
      lastName: String
    },
    quote: String,
  }
  ]
}

// stateModifier functions
//function to add app.get responses to statobject
function addQuotes(data) {
  epiQuotes.quotes = data;
}

// function to 


// render functions
// send data to DOM
function renderQuotes(responses) {
  let source = epiQuotes.quotes[i].sourceName
  let quote = epiQuotes.quotes[i].quote
  let html = `	<section>
		<p>${quote}  and ${source}</p>
		<button> more</button>
	</section>`
}


// event listeners