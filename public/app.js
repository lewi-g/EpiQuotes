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
    createUser: false
  },
  validTags: ['funny', 'inspirational', 'pop-culture', 'life', 'relationships']
};

// stateModifier functions
//USER LOGIN
function addLogInToState(data) {
  epiQuotes.quotes = data;
;
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
  console.log(html);
  $(".all-quotes").append(html);
    return html; 
}


function renderLogIn(state)/* find data from state*/ {
  $('.all-quotes').html(insertLogInToTemplate);
}//END OF USER LOGIN




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
    let date= item.date;
    let tag= item.tag;

    console.log(item);
    let html = `
    <section class = "quote">
      <p>"${quote}"</p>
      <p>-${source}</p>
      <p>made: ${date}</p>
      <p>${tag}</p>
		  <button> &#9660;&#9660;&#9660;</button>
	  </section>`;
  console.log(html);
  $(".all-quotes").append(html);
    return html; 
   
  })
}

function renderQuotes(state)/* find data from state*/ {
  $('.all-quotes').html(insertQuotesToTemplate);
}

function insertConfirmToTemplate(epiQuotes) {
  // <section class = "quote">
  //     <p>"${quote}"</p>
  //     <p>-${source}</p>
  //     <p>made: ${date}</p>
  //     <p>${tag}</p>
  //     <button> &#9660;&#9660;&#9660;</button>
  //   </section>
    let html = `
    <section class = "confirm">
    <p>You added a quote!</p>
    <button>ok</button>
    </section>`;
  console.log(html);
  $(".all-quotes").append(html);
    return html; 
}

function renderConfirmAdd(state) {
  $('.all-quotes').html(insertConfirmToTemplate);
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
  $('.all-quotes').submit(function (event) {
    // $('#quote-form').submit(function (event) {
    event.preventDefault();
    let inputQuote = $('#input-quote').val();
    console.log('input quote --- ' + inputQuote);
    let inputSource = $('#quote-source').val();
    console.log('input source --- ' + inputSource);
    let inputTag = $('#quote-tag').val();
    console.log('tag source --- ' + inputTag);

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
               console.log('quote was added');
           }
       });
      epiQuotes.views.addQuote = false;
      epiQuotes.views.confirmAdd = true;
      renderConfirmAdd();
  });
};

function postQuoteSuccess() {
  alert('successfully added quote');
}


//show form to DOM
const addQuotesForm = () => {
  $('.add-quotes').on('click', function (event) {
    event.preventDefault();
    const validTags = ['funny', 'inspirational', 'pop-culture', 'life', 'relationships'];
    


    let inputForm = `  
    <form action='http://localhost:8080/quotes' method="post" id="quote-form">
      <fieldset >
        <label for="input-quote">Quote:</label>
        <input type="text" name = "quote" id="input-quote" required placeholder="An eye for an eye...">
        <label for = "quote-source"> Source: </label>
        <input type="text" id = "quote-source" placeholder= "Mahatama Ghandi">
        <label for ="tag-source"> Tag: </label>
        <input type="text" id = "quote-tag" placeholder= "inspirational">
        
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
  // $('.user-post').on('click', function (event) {
    console.log('event happened');
    // $('#quote-form').submit(function (event) {
    event.preventDefault();
    let inputUser = $('#input-username').val();
    console.log('input user --- ' + inputUser);
    let inputPassword = $('#input-password').val();
    console.log('pass --- ' + inputPassword);
    let inputEmail = $('#input-email').val();
    console.log('email --- ' + inputEmail);

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
               console.log('post was added');
           }
       });
      epiQuotes.views.addQuote = false;
      epiQuotes.views.confirmAdd = true;
      renderConfirmAdd();
  });
};

const userPostForm = () => {
  $('.createuser').on('click', function (event) {
    event.preventDefault();

    let inputForm = `  
    <form action='http://localhost:8080/users' method="post" id="user-form">
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
    // epiQuotes.views.addQuote = true;
    // epiQuotes.views.confirmAdd = epiQuotes.views.displayquotes = epiQuotes.views.start = false;
    $('.user-post').html(inputForm);
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
  postUser(),
  userPostForm(),
  // $('.find-quotes').on('click', function (event) {
  //   event.preventDefault();
  //   console.log('help please');
  // })

);

