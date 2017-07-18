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
  ],
  views: {
    'start': true,
    'displayQuotes': false,
    'addQuote': false,
    'confirmAdd': false
  }
};

// stateModifier functions
//function to add app.get responses to statobject
function addQuotes(data) {
  epiQuotes.quotes = data;
}

// function to 


// render functions
// send data to DOM
function insertQuotesToTemplate(responses) {
  let quotes = epiQuotes.quotes;
  quotes.forEach(function (quote) {
    let html = `
    <section class = "quote">
	  	<p>${quote}  and ${sourceName}</p>
		  <button> more</button>
	  </section>`;
    return html;
  });
}

function renderQuotes(state)/* find data from state*/ {
  $('.all-quotes').html(insertQuotesToTemplate);
}


// event listeners