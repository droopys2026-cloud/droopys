## 
 Cookies on GOV.UK Design System
 

 

 
We’d like to use analytics cookies so we can understand how you use the Design System and make improvements. 
 
We also use essential cookies to remember if you’ve accepted analytics cookies. 
 
 
 

 

 
 Accept analytics cookies
 
 
 Reject analytics cookies
 
 View cookies 
 

 
 

 

 

 

 
You’ve accepted analytics cookies. You can change your cookie settings at any time. 
 
 
 

 

 
 Hide cookie message
 
 

 
 

 

 

 

 
You’ve rejected analytics cookies. You can change your cookie settings at any time. 
 
 
 

 

 
 Hide cookie message
 
 

 
 

 
 

 Skip to main content 

 

 
 

 

 

 
 
 
 Design System
 
 
 
 

 Search Design system 
 Sitemap 
 
 
 

 

 

 

 

 

 

 

 

 

 

 
 
 

 

 

 

 

 
 
 
 

 

 
 

# 
 Error summary
 

 

 

 
Use this component at the top of a page to summarise any errors a user has made. 

When a user makes an error, you must show both an error summary and an Error message component next to each answer that contains an error. 

 

 

 
 Open this example in a new tab : error summary 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-error-summary" data-module = "govuk-error-summary" > 
 < div role = "alert" > 
 < h2 class = "govuk-error-summary__title" > 
 There is a problem
 </ h2 > 
 < div class = "govuk-error-summary__body" > 
 < ul class = "govuk-list govuk-error-summary__list" > 
 < li > 
 < a href = "#" > Enter your full name </ a > 
 </ li > 
 < li > 
 < a href = "#" > The date your passport was issued must be in the past </ a > 
 </ li > 
 </ ul > 
 </ div > 
 </ div > 
 </ div > 
 
 
 
 Nunjucks 

 
 
 
 Nunjucks macro options 
 
 
 

 

 Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.
 
 

 Some options are required for the macro to work; these are marked as “Required” in the option description. Deprecated options are marked as “Deprecated”.
 
 

 If you’re using Nunjucks macros in production with “html” options, or ones ending with “html”, you must sanitise the HTML to protect against cross-site scripting exploits .
 
 
 Primary options 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 title Text 
 string 
 
 Required. 
 If titleHtml is set, this is not required. Text to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 title Html 
 string 
 
 Required. 
 If titleText is set, this is not required. HTML to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 description Text 
 string 
 
 Text to use for the description of the errors. If you set descriptionHtml , the component will ignore descriptionText .
 
 
 

 description Html 
 string 
 
 HTML to use for the description of the errors. If you set this option, the component will ignore descriptionText .
 
 
 

 caller 
 nunjucks-block 
 
 Not strictly a parameter but Nunjucks code convention . Using a call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire error summary component in a call block.
 
 
 

 error List 
 array 
 
 A list of errors to include in the error summary.
 See macro options for error List .
 
 
 

 disable Auto Focus 
 boolean 
 
 Prevent moving focus to the error summary when the page loads.
 
 
 

 classes 
 string 
 
 Classes to add to the error-summary container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error-summary container.
 
 
 
 
 
 Options for error List array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 href 
 string 
 
 Href attribute for the error link item. If provided item will be an anchor.
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text for the error link item. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML for the error link item. If html is provided, the text option will be ignored.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error link anchor.
 
 
 
 
 

 {% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %} 

 {{ govukErrorSummary ({
 titleText : "There is a problem" ,
 errorList : [
 {
 text : "Enter your full name" ,
 href : "#" 
 },
 {
 text : "The date your passport was issued must be in the past" ,
 href : "#" 
 }
 ]
}) }} 
 
 
 

## When to use this component

Always show an error summary when there is a validation error, even if there’s only one. 

## How it works

You must: 
 

move keyboard focus to the error summary (the govuk-frontend javascript will do this for you) 

include the heading ‘There is a problem’ 

link to each of the answers that have validation errors 

make sure the error messages in the error summary are worded the same as those which appear next to the inputs with errors 
 

As well as showing an error summary, follow the Validation pattern - for example, by adding ‘Error: ’ to the beginning of the page <title> so screen readers read it out as soon as possible. 

And make your error messages clear and concise . 

There are 2 ways to use the error summary component. You can use HTML or, if you are using Nunjucks or the GOV.UK Prototype Kit , you can use the Nunjucks macro. 

 

 

 
 Open this example in a new tab : error summary second 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-error-summary" data-module = "govuk-error-summary" > 
 < div role = "alert" > 
 < h2 class = "govuk-error-summary__title" > 
 There is a problem
 </ h2 > 
 < div class = "govuk-error-summary__body" > 
 < ul class = "govuk-list govuk-error-summary__list" > 
 < li > 
 < a href = "#" > Enter your full name </ a > 
 </ li > 
 < li > 
 < a href = "#" > The date your passport was issued must be in the past </ a > 
 </ li > 
 </ ul > 
 </ div > 
 </ div > 
 </ div > 
 
 
 
 Nunjucks 

 
 
 
 Nunjucks macro options 
 
 
 

 

 Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.
 
 

 Some options are required for the macro to work; these are marked as “Required” in the option description. Deprecated options are marked as “Deprecated”.
 
 

 If you’re using Nunjucks macros in production with “html” options, or ones ending with “html”, you must sanitise the HTML to protect against cross-site scripting exploits .
 
 
 Primary options 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 title Text 
 string 
 
 Required. 
 If titleHtml is set, this is not required. Text to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 title Html 
 string 
 
 Required. 
 If titleText is set, this is not required. HTML to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 description Text 
 string 
 
 Text to use for the description of the errors. If you set descriptionHtml , the component will ignore descriptionText .
 
 
 

 description Html 
 string 
 
 HTML to use for the description of the errors. If you set this option, the component will ignore descriptionText .
 
 
 

 caller 
 nunjucks-block 
 
 Not strictly a parameter but Nunjucks code convention . Using a call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire error summary component in a call block.
 
 
 

 error List 
 array 
 
 A list of errors to include in the error summary.
 See macro options for error List .
 
 
 

 disable Auto Focus 
 boolean 
 
 Prevent moving focus to the error summary when the page loads.
 
 
 

 classes 
 string 
 
 Classes to add to the error-summary container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error-summary container.
 
 
 
 
 
 Options for error List array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 href 
 string 
 
 Href attribute for the error link item. If provided item will be an anchor.
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text for the error link item. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML for the error link item. If html is provided, the text option will be ignored.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error link anchor.
 
 
 
 
 

 {% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %} 

 {{ govukErrorSummary ({
 titleText : "There is a problem" ,
 errorList : [
 {
 text : "Enter your full name" ,
 href : "#" 
 },
 {
 text : "The date your passport was issued must be in the past" ,
 href : "#" 
 }
 ]
}) }} 
 
 
 

### Linking from the error summary to each answer

You must link the errors in the error summary to the answer they relate to. 

For questions that require a user to answer using a single field, like a file upload, select, textarea, text input or character count, link to the field. 

 

 

 
 Open this example in a new tab : linking from the error summary to an answer that uses a single field – error summary 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-error-summary" data-module = "govuk-error-summary" > 
 < div role = "alert" > 
 < h2 class = "govuk-error-summary__title" > 
 There is a problem
 </ h2 > 
 < div class = "govuk-error-summary__body" > 
 < ul class = "govuk-list govuk-error-summary__list" > 
 < li > 
 < a href = "#full-name-input" > Enter your full name </ a > 
 </ li > 
 </ ul > 
 </ div > 
 </ div > 
 </ div > 
 < h1 class = "govuk-heading-l" > Your details </ h1 > 
 < div class = "govuk-form-group govuk-form-group--error" > 
 < label class = "govuk-label" for = "full-name-input" > 
 Full name
 </ label > 
 < p id = "full-name-input-error" class = "govuk-error-message" > 
 < span class = "govuk-visually-hidden" > Error: </ span > Enter your full name
 </ p > 
 < input class = "govuk-input govuk-input--error" id = "full-name-input" name = "name" type = "text" aria-describedby = "full-name-input-error" autocomplete = "name" > 
 </ div > 
 
 
 
 Nunjucks 

 
 
 
 Nunjucks macro options 
 
 
 

 

 Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.
 
 

 Some options are required for the macro to work; these are marked as “Required” in the option description. Deprecated options are marked as “Deprecated”.
 
 

 If you’re using Nunjucks macros in production with “html” options, or ones ending with “html”, you must sanitise the HTML to protect against cross-site scripting exploits .
 
 
 Primary options 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 title Text 
 string 
 
 Required. 
 If titleHtml is set, this is not required. Text to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 title Html 
 string 
 
 Required. 
 If titleText is set, this is not required. HTML to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 description Text 
 string 
 
 Text to use for the description of the errors. If you set descriptionHtml , the component will ignore descriptionText .
 
 
 

 description Html 
 string 
 
 HTML to use for the description of the errors. If you set this option, the component will ignore descriptionText .
 
 
 

 caller 
 nunjucks-block 
 
 Not strictly a parameter but Nunjucks code convention . Using a call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire error summary component in a call block.
 
 
 

 error List 
 array 
 
 A list of errors to include in the error summary.
 See macro options for error List .
 
 
 

 disable Auto Focus 
 boolean 
 
 Prevent moving focus to the error summary when the page loads.
 
 
 

 classes 
 string 
 
 Classes to add to the error-summary container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error-summary container.
 
 
 
 
 
 Options for error List array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 href 
 string 
 
 Href attribute for the error link item. If provided item will be an anchor.
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text for the error link item. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML for the error link item. If html is provided, the text option will be ignored.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error link anchor.
 
 
 
 
 

 {% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %} 
 {% from "govuk/components/input/macro.njk" import govukInput %} 

 {{ govukErrorSummary ({
 titleText : "There is a problem" ,
 errorList : [
 {
 text : "Enter your full name" ,
 href : "#full-name-input" 
 }
 ]
}) }} 

 < h1 class = "govuk-heading-l" > Your details </ h1 > 

 {{ govukInput ({
 label : {
 text : "Full name" 
 },
 id : "full-name-input" ,
 name : "name" ,
 autocomplete : "name" ,
 errorMessage : {
 text : "Enter your full name" 
 }
}) }} 
 
 
 
When a user has to enter their answer into multiple fields, such as the day, month and year fields in the date input component, link to the first field that contains an error. 

If you do not know which field contains an error, link to the first field. 

 

 

 
 Open this example in a new tab : linking from the error summary to an answer that uses multiple fields – error summary 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-error-summary" data-module = "govuk-error-summary" > 
 < div role = "alert" > 
 < h2 class = "govuk-error-summary__title" > 
 There is a problem
 </ h2 > 
 < div class = "govuk-error-summary__body" > 
 < ul class = "govuk-list govuk-error-summary__list" > 
 < li > 
 < a href = "#passport-issued-year" > Passport issue date must include a year </ a > 
 </ li > 
 </ ul > 
 </ div > 
 </ div > 
 </ div > 
 < div class = "govuk-form-group govuk-form-group--error" > 
 < fieldset class = "govuk-fieldset" role = "group" aria-describedby = "passport-issued-error" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 When was your passport issued?
 </ h1 > 
 </ legend > 
 < p id = "passport-issued-error" class = "govuk-error-message" > 
 < span class = "govuk-visually-hidden" > Error: </ span > Passport issue date must include a year
 </ p > 
 < div class = "govuk-date-input" id = "passport-issued" > 
 < div class = "govuk-date-input__item" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label govuk-date-input__label" for = "passport-issued-day" > 
 Day
 </ label > 
 < input class = "govuk-input govuk-date-input__input govuk-input--width-2" id = "passport-issued-day" name = "passport-issued-day" type = "text" value = "5" inputmode = "numeric" > 
 </ div > 
 </ div > 
 < div class = "govuk-date-input__item" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label govuk-date-input__label" for = "passport-issued-month" > 
 Month
 </ label > 
 < input class = "govuk-input govuk-date-input__input govuk-input--width-2" id = "passport-issued-month" name = "passport-issued-month" type = "text" value = "12" inputmode = "numeric" > 
 </ div > 
 </ div > 
 < div class = "govuk-date-input__item" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label govuk-date-input__label" for = "passport-issued-year" > 
 Year
 </ label > 
 < input class = "govuk-input govuk-date-input__input govuk-input--error govuk-input--width-4" id = "passport-issued-year" name = "passport-issued-year" type = "text" inputmode = "numeric" > 
 </ div > 
 </ div > 
 </ div > 
 </ fieldset > 
 </ div > 
 
 
 
 Nunjucks 

 
 
 
 Nunjucks macro options 
 
 
 

 

 Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.
 
 

 Some options are required for the macro to work; these are marked as “Required” in the option description. Deprecated options are marked as “Deprecated”.
 
 

 If you’re using Nunjucks macros in production with “html” options, or ones ending with “html”, you must sanitise the HTML to protect against cross-site scripting exploits .
 
 
 Primary options 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 title Text 
 string 
 
 Required. 
 If titleHtml is set, this is not required. Text to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 title Html 
 string 
 
 Required. 
 If titleText is set, this is not required. HTML to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 description Text 
 string 
 
 Text to use for the description of the errors. If you set descriptionHtml , the component will ignore descriptionText .
 
 
 

 description Html 
 string 
 
 HTML to use for the description of the errors. If you set this option, the component will ignore descriptionText .
 
 
 

 caller 
 nunjucks-block 
 
 Not strictly a parameter but Nunjucks code convention . Using a call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire error summary component in a call block.
 
 
 

 error List 
 array 
 
 A list of errors to include in the error summary.
 See macro options for error List .
 
 
 

 disable Auto Focus 
 boolean 
 
 Prevent moving focus to the error summary when the page loads.
 
 
 

 classes 
 string 
 
 Classes to add to the error-summary container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error-summary container.
 
 
 
 
 
 Options for error List array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 href 
 string 
 
 Href attribute for the error link item. If provided item will be an anchor.
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text for the error link item. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML for the error link item. If html is provided, the text option will be ignored.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error link anchor.
 
 
 
 
 

 {% from "govuk/components/date-input/macro.njk" import govukDateInput %} 
 {% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %} 

 {{ govukErrorSummary ({
 titleText : "There is a problem" ,
 errorList : [
 {
 text : "Passport issue date must include a year" ,
 href : "#passport-issued-year" 
 }
 ]
}) }} 

 {{ govukDateInput ({
 fieldset : {
 legend : {
 isPageHeading : true ,
 text : "When was your passport issued?" ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 id : "passport-issued" ,
 namePrefix : "passport-issued" ,
 errorMessage : {
 text : "Passport issue date must include a year" 
 },
 values : {
 day : 5 ,
 month : 12 
 },
 year : {
 error : true 
 }
 }) 
}} 
 
 
 
For questions that require a user to select one or more options from a list using radios or checkboxes, link to the first radio or checkbox. 

 

 

 
 Open this example in a new tab : linking from the error summary to checkboxes – error summary 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-error-summary" data-module = "govuk-error-summary" > 
 < div role = "alert" > 
 < h2 class = "govuk-error-summary__title" > 
 There is a problem
 </ h2 > 
 < div class = "govuk-error-summary__body" > 
 < ul class = "govuk-list govuk-error-summary__list" > 
 < li > 
 < a href = "#nationality" > Select if you are British, Irish or a citizen of a different country </ a > 
 </ li > 
 </ ul > 
 </ div > 
 </ div > 
 </ div > 
 < div class = "govuk-form-group govuk-form-group--error" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "nationality-hint nationality-error" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 What is your nationality?
 </ h1 > 
 </ legend > 
 < div id = "nationality-hint" class = "govuk-hint" > 
 If you have dual nationality, select all options that are relevant to you
 </ div > 
 < p id = "nationality-error" class = "govuk-error-message" > 
 < span class = "govuk-visually-hidden" > Error: </ span > Select if you are British, Irish or a citizen of a different country
 </ p > 
 < div class = "govuk-checkboxes" data-module = "govuk-checkboxes" > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "nationality" name = "nationality" type = "checkbox" value = "british" aria-describedby = "nationality-item-hint" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "nationality" > 
 British
 </ label > 
 < div id = "nationality-item-hint" class = "govuk-hint govuk-checkboxes__hint" > 
 including English, Scottish, Welsh and Northern Irish
 </ div > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "nationality-2" name = "nationality" type = "checkbox" value = "irish" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "nationality-2" > 
 Irish
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "nationality-3" name = "nationality" type = "checkbox" value = "other" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "nationality-3" > 
 Citizen of another country
 </ label > 
 </ div > 
 </ div > 
 </ fieldset > 
 </ div > 
 
 
 
 Nunjucks 

 
 
 
 Nunjucks macro options 
 
 
 

 

 Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.
 
 

 Some options are required for the macro to work; these are marked as “Required” in the option description. Deprecated options are marked as “Deprecated”.
 
 

 If you’re using Nunjucks macros in production with “html” options, or ones ending with “html”, you must sanitise the HTML to protect against cross-site scripting exploits .
 
 
 Primary options 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 title Text 
 string 
 
 Required. 
 If titleHtml is set, this is not required. Text to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 title Html 
 string 
 
 Required. 
 If titleText is set, this is not required. HTML to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 description Text 
 string 
 
 Text to use for the description of the errors. If you set descriptionHtml , the component will ignore descriptionText .
 
 
 

 description Html 
 string 
 
 HTML to use for the description of the errors. If you set this option, the component will ignore descriptionText .
 
 
 

 caller 
 nunjucks-block 
 
 Not strictly a parameter but Nunjucks code convention . Using a call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire error summary component in a call block.
 
 
 

 error List 
 array 
 
 A list of errors to include in the error summary.
 See macro options for error List .
 
 
 

 disable Auto Focus 
 boolean 
 
 Prevent moving focus to the error summary when the page loads.
 
 
 

 classes 
 string 
 
 Classes to add to the error-summary container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error-summary container.
 
 
 
 
 
 Options for error List array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 href 
 string 
 
 Href attribute for the error link item. If provided item will be an anchor.
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text for the error link item. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML for the error link item. If html is provided, the text option will be ignored.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error link anchor.
 
 
 
 
 

 {% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %} 
 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

 {{ govukErrorSummary ({
 titleText : "There is a problem" ,
 errorList : [
 {
 text : "Select if you are British, Irish or a citizen of a different country" ,
 href : "#nationality" 
 }
 ]
}) }} 

 {{ govukCheckboxes ({
 name : "nationality" ,
 fieldset : {
 legend : {
 text : "What is your nationality?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "If you have dual nationality, select all options that are relevant to you" 
 },
 errorMessage : {
 text : "Select if you are British, Irish or a citizen of a different country" 
 },
 items : [
 {
 value : "british" ,
 text : "British" ,
 hint : {
 text : "including English, Scottish, Welsh and Northern Irish" 
 }
 },
 {
 value : "irish" ,
 text : "Irish" 
 },
 {
 value : "other" ,
 text : "Citizen of another country" 
 }
 ]
}) }} 
 
 
 

### Where to put the error summary

Put the error summary at the top of the main container. If your page includes breadcrumbs or a back link, place it below these, but above the <h1> . 

 

 

 
 Open this example in a new tab : full page example – error summary 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-width-container" > 
 < a href = "#" class = "govuk-back-link" > Back </ a > 
 < main class = "govuk-main-wrapper " id = "main-content" role = "main" > 
 < div class = "govuk-grid-row" > 
 < div class = "govuk-grid-column-two-thirds" > 
 < form action = "/form-handler" method = "post" novalidate > 
 < div class = "govuk-error-summary" data-module = "govuk-error-summary" > 
 < div role = "alert" > 
 < h2 class = "govuk-error-summary__title" > 
 There is a problem
 </ h2 > 
 < div class = "govuk-error-summary__body" > 
 < ul class = "govuk-list govuk-error-summary__list" > 
 < li > 
 < a href = "#passport-issued-year" > Passport issue date must include a year </ a > 
 </ li > 
 </ ul > 
 </ div > 
 </ div > 
 </ div > 
 < div class = "govuk-form-group govuk-form-group--error" > 
 < fieldset class = "govuk-fieldset" role = "group" aria-describedby = "passport-issued-error" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 When was your passport issued?
 </ h1 > 
 </ legend > 
 < p id = "passport-issued-error" class = "govuk-error-message" > 
 < span class = "govuk-visually-hidden" > Error: </ span > Passport issue date must include a year
 </ p > 
 < div class = "govuk-date-input" id = "passport-issued" > 
 < div class = "govuk-date-input__item" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label govuk-date-input__label" for = "passport-issued-day" > 
 Day
 </ label > 
 < input class = "govuk-input govuk-date-input__input govuk-input--width-2" id = "passport-issued-day" name = "passport-issued-day" type = "text" value = "5" inputmode = "numeric" > 
 </ div > 
 </ div > 
 < div class = "govuk-date-input__item" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label govuk-date-input__label" for = "passport-issued-month" > 
 Month
 </ label > 
 < input class = "govuk-input govuk-date-input__input govuk-input--width-2" id = "passport-issued-month" name = "passport-issued-month" type = "text" value = "12" inputmode = "numeric" > 
 </ div > 
 </ div > 
 < div class = "govuk-date-input__item" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label govuk-date-input__label" for = "passport-issued-year" > 
 Year
 </ label > 
 < input class = "govuk-input govuk-date-input__input govuk-input--error govuk-input--width-4" id = "passport-issued-year" name = "passport-issued-year" type = "text" inputmode = "numeric" > 
 </ div > 
 </ div > 
 </ div > 
 </ fieldset > 
 </ div > 
 < button type = "submit" class = "govuk-button" data-module = "govuk-button" > 
 Continue
 </ button > 
 </ form > 
 </ div > 
 </ div > 
 </ main > 
 </ div > 
 
 
 
 Nunjucks 

 
 
 
 Nunjucks macro options 
 
 
 

 

 Use options to customise the appearance, content and behaviour of a component when using a macro, for example, changing the text.
 
 

 Some options are required for the macro to work; these are marked as “Required” in the option description. Deprecated options are marked as “Deprecated”.
 
 

 If you’re using Nunjucks macros in production with “html” options, or ones ending with “html”, you must sanitise the HTML to protect against cross-site scripting exploits .
 
 
 Primary options 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 title Text 
 string 
 
 Required. 
 If titleHtml is set, this is not required. Text to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 title Html 
 string 
 
 Required. 
 If titleText is set, this is not required. HTML to use for the heading of the error summary block. If titleHtml is provided, titleText will be ignored.
 
 
 

 description Text 
 string 
 
 Text to use for the description of the errors. If you set descriptionHtml , the component will ignore descriptionText .
 
 
 

 description Html 
 string 
 
 HTML to use for the description of the errors. If you set this option, the component will ignore descriptionText .
 
 
 

 caller 
 nunjucks-block 
 
 Not strictly a parameter but Nunjucks code convention . Using a call block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. To use it, you will need to wrap the entire error summary component in a call block.
 
 
 

 error List 
 array 
 
 A list of errors to include in the error summary.
 See macro options for error List .
 
 
 

 disable Auto Focus 
 boolean 
 
 Prevent moving focus to the error summary when the page loads.
 
 
 

 classes 
 string 
 
 Classes to add to the error-summary container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error-summary container.
 
 
 
 
 
 Options for error List array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 href 
 string 
 
 Href attribute for the error link item. If provided item will be an anchor.
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text for the error link item. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML for the error link item. If html is provided, the text option will be ignored.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the error link anchor.
 
 
 
 
 

 {% from "govuk/components/back-link/macro.njk" import govukBackLink %} 
 {% from "govuk/components/button/macro.njk" import govukButton %} 
 {% from "govuk/components/date-input/macro.njk" import govukDateInput %} 
 {% from "govuk/components/error-summary/macro.njk" import govukErrorSummary %} 

 {% block containerStart %} 
 {{ govukBackLink ({
 text : "Back" 
 }) }} 
 {% endblock %} 

 {% block content %} 
 < div class = "govuk-grid-row" > 
 < div class = "govuk-grid-column-two-thirds" > 
 < form action = "/form-handler" method = "post" novalidate > 
 {{ govukErrorSummary ({
 titleText : "There is a problem" ,
 errorList : [
 {
 text : "Passport issue date must include a year" ,
 href : "#passport-issued-year" 
 }
 ]
 }) }} 

 {{ govukDateInput ({
 fieldset : {
 legend : {
 isPageHeading : true ,
 text : "When was your passport issued?" ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 id : "passport-issued" ,
 namePrefix : "passport-issued" ,
 errorMessage : {
 text : "Passport issue date must include a year" 
 },
 day : {
 value : 5 
 },
 month : {
 value : 12 
 },
 year : {
 error : true 
 }
 }) 
 }} 

 {{ govukButton ({
 text : "Continue" 
 }) }} 

 </ form > 
 </ div > 
 </ div > 
 {% endblock %} 
 
 
 
 

 

 

## Help improve this component

 

 To help make sure that this page is useful, relevant and up to date, you can:
 
 
 

 take part in the
 
 ‘Error summary’ discussion on GitHub
 
 and share your research
 
 

 propose a change on GitHub 
 – read more about
 
 how to propose changes in GitHub
 
 
 

 

## Need help?

 

 If you’ve got a question about the GOV.UK Design System, contact the team .
 
 
 
 

 
 Back to top
