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
  epiQuotes.quotes = data;
;
  insertQuotesToTemplate(epiQuotes);
}

// render functions
// send data to DOM
function insertQuotesToTemplate(epiQuotes) {
  let quotes = epiQuotes.quotes;
  let quote= quotes.quote
  quotes.forEach(function (item) {
    let quote= item.quote;
    let source= item.source;
    let html = `
    <section class = "quote">
	  	<p> ${quote} and ${source}</p>
		  <button> more</button>
	  </section>`;
  console.log(html);
  $(".all-quotes").append(html);
    return html; 
   
  })
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
  $.getJSON('http://localhost:8080/quotes', opts, addQuotesToState);
}

// submitted quotes are added to database
const postQuotes = () => {
  $('#quote-form').submit(function (event) {
    event.preventDefault();
    let inputQuote = $('#input-quote').val();
    let inputSource = $('$quote-source').val();
    let url = 'localhost:8080/quotes';

    console.log(inputQuote )
    // $.post(
    //   url,
    //   { quote: inputQuote, sourceName: inputsource }
    //   //, [, success ] [, dataType ] 
    // );
    //call render function to confirm addition of quote
    //change view to confirm entry
  });
};

//show form to DOM
const addQuotesForm = () => {
  $('.add-quotes').on('click', function (event) {
    event.preventDefault();

    // $('#quote-form').toggleClass('hidden');
    let inputForm = `  
    <form action='/#' id="quote-form">
      <fieldset >
        <label for="input-quote">Quote:</label>
        <input type="text" id="input-quote" required placeholder="An eye for an eye...">
        <label for "quote-source"> Source: </label>
        <input type="text" id = "quote-source" placeholder= "Mahatama Ghandi">
        <label for "quote-source"> Tag </label>
        <input type="text" id = "quote-tag" placeholder= "inspirational">
			 <button class="button" type="submit">Submit Quote</button>
      </fieldset>
  </form>`;
    epiQuotes.views.addQuote = true;
    epiQuotes.views.confirmAdd = epiQuotes.views.displayquotes = epiQuotes.views.start = false;
    $('.all-quotes').html(inputForm);
  });
}

const findQuotes = () => {
  $('.find-quotes').on('click', function (event) {
    event.preventDefault();
    const opts = {};
    $.getJSON('http://localhost:8080/quotes', opts, addQuotesToState);
  });
};

// $.getJSON('http://localhost:8080/quotes', {}, addQuotesToState);


$(document).ready(
  findQuotes(),
  addQuotesForm(),
  postQuotes(),
  // $('.find-quotes').on('click', function (event) {
  //   event.preventDefault();
  //   console.log('help please');
  // })

);

