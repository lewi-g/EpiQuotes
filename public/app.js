'use strict';

// stateobject
const epiQuotes = {
  quotes: [
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

//$('button').on ('click', getQuotes);


function getQuotes(e){
  const opts = {};

  $.getJSON('http://localhost:8080/quotes', opts, addQuotes);
}

$('#quote-form').submit(function(event) {
    event.preventDefault();
    let  quote= $('#input-quote').val();
    let sourceName = $('$quote-source').val();
    
    // api.post function is called
    ;


function addQuotes(data) {
  console.log(data);
  epiQuotes.quotes = data;
}

  $.getJSON('http://localhost:8080/quotes', {}, addQuotes);




