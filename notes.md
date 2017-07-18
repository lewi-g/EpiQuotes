project requirements:
* CRUD operations 

represent different schemas for users and quotes


APP.GET
show some information: (quote, source, date, upvotes) when user requests
show more information: (submitted, tag)

get quotes by tag



APP.POST
require quote, date, source (anonymous if blank)

APP.PUT
find quote by id
edit tag, source

APP.DELETE
find quote by id
delete quote record


Mongo: operator?
child schema






npm modules:
mongo mongoose express morgan body-parser 
chai chai-http mocha faker

To connect using the mongo shell:
mongo ds157549.mlab.com:57549/epiquotes -u dev -p devdev


random string found in models
dc725bd48bd7bfde095e0fad46d56797d0314e3d