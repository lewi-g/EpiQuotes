'use strict';

// state Object
const epiQuotes = {
  quotes: [],
  views: {
    start: true,
    displayQuotes: false,
    addQuote: false,
    confirmAdd: false,
    login: false,
    tag: false,
    createUser: false
  },
  validTags: ['funny', 'inspirational', 'pop-culture', 'life', 'relationships']
};

// state Modifier functions
const originalState = $('.all-quotes').clone();

function addLogInToState(data) {
  epiQuotes.quotes = data;
  insertQuotesToTemplate(epiQuotes);
}

// render functions
// send data to DOM


//function to add app.get responses to stateobject
function addQuotesToState(data) {
  epiQuotes.quotes = data;
  insertQuotesToTemplate(epiQuotes);
}

function addTagsToState(data) {
  epiQuotes.quotes = data;
  insertTagsToTemplate(epiQuotes);
}

// render functions
// send data to DOM
function insertQuotesToTemplate(epiQuotes) {
  let quotes = epiQuotes.quotes;
  // let quote = quotes.quote; DELETE?
  $('.quote').addClass('hidden');
  quotes.forEach(function(item) {
    let {quote, source, tag} = item;
    let html = (
      `<section class = "quote">
        <p>"${quote}"</p>
        <p>-${source}</p>
        <p class= "quote-tag-style">${tag}</p>
      </section>`
    );
    $('.all-quotes').append(html);
    return html;
  });
}

function insertTagsToTemplate(epiQuotes) {
  let quotes = epiQuotes.quotes;
  // let quote = quotes.quote; DELETE?
  $('.quote').addClass('hidden');
  quotes.forEach(function(item) {
    let quote = item.quote;
    let source = item.source;
    let date = item.date;
    let tag = item.tag;
    let html = `
    <section class = "quote">
      <p>"${quote}"</p>
      <p>-${source}</p>
      <p class= "quote-tag-style">${tag}</p>
    </section>`;
    $('.all-quotes').append(html);
    return html;
  });
}

function renderQuotes(state) /* find data from state*/ {
  $('.all-quotes').html(insertQuotesToTemplate);
}

function insertConfirmQuoteToTemplate(epiQuotes) {
  let html = `
    <section class = "confirm">
      <p>You added a quote!</p>
      <button id = "reset"value="Refresh Page" onClick="window.location.reload()">ok</button>
    </section>`;
  $('.all-quotes').append(html);
  return html;
}

function renderConfirmQuoteAdd(state) {
  $('.all-quotes').html(insertConfirmQuoteToTemplate);
}

// event listeners
// submitted quotes are added to database
const postQuotes = () => {
  $('.all-quotes').submit(function(event) {
    event.preventDefault();
    let inputQuote = $('#input-quote').val();
    let inputSource = $('#quote-source').val();
    let inputTag = $('#quote-tag').val();
    let sendInfo = {
      quote: inputQuote,
      source: inputSource,
      tag: inputTag
    };
    let url = '/quotes';
    $.ajax({
      type: 'POST',
      data: JSON.stringify(sendInfo),
      url: url,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      traditional: true,
      success: function(data) {}
    });
    epiQuotes.views.addQuote = false;
    epiQuotes.views.confirmAdd = true;
    renderConfirmQuoteAdd();
  });
};

//show form to DOM
const addQuotesForm = () => {
  $('.add-quotes').on('click', function(event) {
    event.preventDefault();
    let inputForm = `  
    <button class = "reset-button" value="Refresh Page" onClick="window.location.reload()">Go Back</button>
    <form action='/quotes' method="post" id="quote-form">
      <fieldset >
        <div>
          <label class="quote-label" for="input-quote">Quote:</label>
          <textarea type="text" rows="4" name="quote" id="input-quote" required placeholder="An eye for an eye..."></textarea>
        </div>
        <div>
          <label for="quote-source"> Source: </label>
          <input type="text" id = "quote-source" placeholder= "Mahatama Ghandi">
        <div>
        <div>
          <label for="quote-tag"> Tag: </label>
          <select id="quote-tag">
            <option value="funny">funny</option>
            <option value="inspirational">inspirational</option>
            <option value="pop-culture">pop-culture</option>
            <option value="life">life</option>
            <option value="relationships">relationships</option>
          </select>
        </div>
			 <button class="button buffer" from="quote-form" type="submit">Submit Quote</button>
      </fieldset>
    </form>`;
    epiQuotes.views.addQuote = true;
    epiQuotes.views.confirmAdd = epiQuotes.views.displayquotes = epiQuotes.views.start = false;
    $('.all-quotes').html(inputForm);
  });
};

const findTags = () => {
  $('.find-tags-search').on('click', function(event) {
    event.preventDefault();
    let inputTag = $('#list-tags').val();
    const opts = {};
    $.getJSON(`/quotes/tag/?tag=${inputTag}`, opts, addTagsToState);
  });
};

const findQuotes = () => {
  $('.find-quotes').on('click', function(event) {
    event.preventDefault();
    const opts = {};
    $.getJSON('/quotes', opts, addQuotesToState);
  });
};

$(document).ready(
  findTags(),
  findQuotes(),
  addQuotesForm(),
  postQuotes()
);
