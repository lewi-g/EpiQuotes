'use strict';

// stateobject
const epiQuotes = {
  quotes: [
  ],
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

// stateModifier functions
const originalState = $(".all-quotes").clone();


function addLogInToState(data) {
  epiQuotes.quotes = data;
  insertQuotesToTemplate(epiQuotes);
}

// render functions
// send data to DOM
function insertLogInToTemplate(epiQuotes) {
    let html = `
    <section class = "quote">
      <p>"${quote}"</p>
      <p>-${source}</p>
      <p>made: ${date}</p>
      <p>${tag}</p>
      <button> &#9660;&#9660;&#9660;</button>
    </section>`;
  $(".all-quotes").append(html);
    return html; 
}

function renderLogIn(state)/* find data from state*/ {
  $('.all-quotes').html(insertLogInToTemplate);
}//END OF USER LOGIN

//function to add app.get responses to statobject
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
  let quote= quotes.quote
  quotes.forEach(function (item) {
    let quote= item.quote;
    let source= item.source;
    let date= item.date;
    let tag= item.tag;
    let html = `
    <section class = "quote">
      <p>"${quote}"</p>
      <p>-${source}</p>
      <p>made: ${date}</p>
      <p>${tag}</p>
		  <button> &#9660;&#9660;&#9660;</button>
	  </section>`;
  $(".all-quotes").append(html);
    return html;  
  })
}

function insertTagsToTemplate(epiQuotes) {
  // $(".all-quotes").empty();
  let quotes = epiQuotes.quotes;
  let quote= quotes.quote
  quotes.forEach(function (item) {
    let quote= item.quote;
    let source= item.source;
    let date= item.date;
    let tag= item.tag;
    let html = `
    <section class = "quote">
      <p>"${quote}"</p>
      <p>-${source}</p>
      <p>made: ${date}</p>
      <p>${tag}</p>
      <button> &#9660;&#9660;&#9660;</button>
    </section>`;
  // $(".all-quotes").clear();
  $(".all-quotes").append(html);
    return html;  
  })
}

function renderQuotes(state)/* find data from state*/ {
  $('.all-quotes').html(insertQuotesToTemplate);
}

function renderQuotes(state)/* find data from state*/ {
  $('.all-quotes').html(insertTagsToTemplate);
}

function insertConfirmUserToTemplate(epiQuotes) {
    let html = `
    <section class = "confirm">
      <p>You have signed up for EpiQuotes!</p>
      <button id = "reset"value="Refresh Page" onClick="window.location.reload()">ok</button>
    </section>`;
  $(".all-quotes").append(html);
    return html; 
}


function insertConfirmQuoteToTemplate(epiQuotes) {
    let html = `
    <section class = "confirm">
      <p>You added a quote!</p>
      <button id = "reset"value="Refresh Page" onClick="window.location.reload()">ok</button>
    </section>`;
  $(".all-quotes").append(html);
    return html; 
}

function renderConfirmUserAdd(state) {
  $('.user-post').html(insertConfirmUserToTemplate);
}

function renderConfirmQuoteAdd(state) {
  $('.all-quotes').html(insertConfirmQuoteToTemplate);
}

function switchViews() {
  if (epiQuotes.views.start) {
    renderHomePage;
  }
  else if (epiQuotes.views.displayquotes) {
    renderQuotes;
  } else if (epiQuotes.views.tag){
    renderTags;
  }else if (epiQuotes.views.addQuote) {
    renderAddQuoteForm;
  } else if (epiQuotes.views.confirmAdd) {
    renderConfirmQuoteAdd;
  }
}

// event listeners
// submitted quotes are added to database
const postQuotes = () => {
  $('.all-quotes').submit(function (event) {
    event.preventDefault();
    let inputQuote = $('#input-quote').val();
    let inputSource = $('#quote-source').val();
    let inputTag = $('#quote-tag').val();
    let sendInfo = {
      quote: inputQuote,
      source: inputSource,
      tag: inputTag
    }
    let url = '/quotes';
    $.ajax({
          type: "POST",
          data: JSON.stringify(sendInfo),
          url: url,
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          traditional: true,
          success: function (data) {
           }
       });
      epiQuotes.views.addQuote = false;
      epiQuotes.views.confirmAdd = true;
      renderConfirmQuoteAdd();
  });
};
 // <input type="text" id = "quote-tag" placeholder= "inspirational">
//show form to DOM
const addQuotesForm = () => {
  $('.add-quotes').on('click', function (event) {
    event.preventDefault();
    const validTags = ['funny', 'inspirational', 'pop-culture', 'life', 'relationships'];
    let inputForm = `  
    <form action='/quotes' method="post" id="quote-form">
      <fieldset >
        <label for="input-quote">Quote:</label>
        <input type="text" name = "quote" id="input-quote" required placeholder="An eye for an eye...">
        <label for = "quote-source"> Source: </label>
        <input type="text" id = "quote-source" placeholder= "Mahatama Ghandi">
        
        <label for ="tag-source"> Tag: </label>
        <select id="quote-tag">
                <option value="funny">funny</option>
                <option value="inspirational">inspirational</option>
                <option value="pop-culture">pop-culture</option>
                <option value="life">life</option>
                <option value="relationships">relationships</option>
          </select>

			 <button class="button" from="quote-form" type="submit">Submit Quote</button>
      </fieldset>
  </form>`;
    epiQuotes.views.addQuote = true;
    epiQuotes.views.confirmAdd = epiQuotes.views.displayquotes = epiQuotes.views.start = false;
    $('.all-quotes').html(inputForm);
  });
}

const postUser = () => {
   $('.user-post').submit(function (event) {
    event.preventDefault();
    let inputUser = $('#input-username').val();
    console.log(inputUser);
    let inputPassword = $('#input-password').val();
    let inputEmail = $('#input-email').val();

    let sendInfo = {
      username: inputUser,
      password: inputPassword,
      email: inputEmail
    }

    let url = '/users';
    $.ajax({
          type: "POST",
          data: JSON.stringify(sendInfo),
          url: url,
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          traditional: true,
          success: function (data) {

           }
       });
      epiQuotes.views.addQuote = false;
      epiQuotes.views.confirmAdd = true;
      renderConfirmUserAdd();
  });
};

const userPostForm = () => {
  $('.createuser').on('click', function (event) {
    event.preventDefault();
    $('.all-quotes').addClass('hidden');
    let inputForm = `  
    <form id="user-form">
      <fieldset >
        <label for="input-username">Username:</label>
        <input type="text" name = "quote" id="input-username" required placeholder="username">
        <label for = "input-password">Password:</label>
        <input type="password" id = "input-password" placeholder= "password">
        <label for ="input-email"> Email: </label>
        <input type="email" id = "input-email" placeholder= "email">
        
       <button class="button" form="user-form" id = "user-submit" type="submit">create user</button>
      </fieldset>
  </form>`;
    epiQuotes.views.addQuote = true;
    epiQuotes.views.confirmAdd = epiQuotes.views.displayquotes = epiQuotes.views.start = false;
    $('.user-post').html(inputForm);
  });
}

const findTags = () => {
  $('.find-tags-search').on('click', function (event) {
    event.preventDefault();
    // $(".all-quotes").detach();
    let inputTag = $('#list-tags').val();
    console.log(inputTag);
    const opts = {};
    $.getJSON(`/quotes/tag/?tag=${inputTag}`, opts, addTagsToState);
  });
};

const findQuotes = () => {
  $('.find-quotes').on('click', function (event) {
    event.preventDefault();
    const opts = {};
    $.getJSON('/quotes', opts, addQuotesToState);
  });
};


$(document).ready(
  findTags(),
  findQuotes(),
  addQuotesForm(),
  postQuotes(),
  postUser(),
  userPostForm(),
  // resetToHome(),
);