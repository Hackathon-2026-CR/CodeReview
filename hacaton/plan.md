users:

name 
password
credits default: 200
groups: list [names of company he works for] default: None
price: int [how much he ask per review]  default: None
rating [from 0.1 to 5.0] default: None
code languages: list, default: None



codes:

id
title
user name
code languages: list
text to describe the code: long text
groups of code [who can review the code]
status: [waiting for review, review in process, reviwed] default: waiting for review
reviewer: default: None
price: int [how much he willing to pay for a review]


reviews: [only available to the client and the reviewer]

client name
reviewer name
text to describe the code: [from 'codes'] 
groups of code
reviewer commant 
rating of the review: [the client rate the reviewer]





<!-- list of codes: list [default empty] -->