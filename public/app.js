'use strict';

// stateobject
const epiQuotes = {
  quotes: [
  ],
  views: {
    start: true,
    displayQuotes: false,
    addQuote: false,
    confirmAdd: false
  }
};

// stateModifier functions
//function to add app.get responses to statobject
function addQuotesToState(data) {
  console.log(data);
  epiQuotes.quotes = data;
}


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

function switchViews() {
  if (epiQuotes.views.start) {
    renderHomePage;
  }
  else if (epiQuotes.views.displayquotes) {
    renderQuotes;
  } else if (epiQuotes.views.addQuote) {
    renderAddQuoteForm;
  } else if (epiQuotes.views.confirmAdd) {
    renderConfirmAdd;
  }
}


// event listeners

// $('.button').on('click', getQuotes);


function getQuotes(e) {
  const opts = {};

  $.getJSON('http://localhost:8080/quotes', opts, addQuotes);
}

// submitted quotes are added to database
// $('#quote-form').submit(function (event) {
//   event.preventDefault();
//   let inputQuote = $('#input-quote').val();
//   let inputSource = $('$quote-source').val();
//   let url = 'localhost:8080/quotes';
//   $.post(
//     url,
//     { quote: inputQuote, sourceName: inputsource }
//     //, [, success ] [, dataType ] 
//   );
//   //call render function to confirm addition of quote
// }

$('.add-quotes').on('click', 'button', function (event) {
  event.preventDefault();
  console.log('I am doing this right');
  $('#quote-form').toggleClass('hidden');
  epiQuotes.views.addQuote = true;
  epiQuotes.views.confirmAdd = epiQuotes.views.displayquotes = epiQuotes.views.start = false;
});



 // $.getJSON('http://localhost:8080/quotes', {}, addQuotesToState);




