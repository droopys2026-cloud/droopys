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
 Radios
 

 

 

 

 

 

 
 Open this example in a new tab : radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Where do you live?
 </ h1 > 
 </ legend > 
 < div class = "govuk-radios" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive" name = "whereDoYouLive" type = "radio" value = "england" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive" > 
 England
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-2" name = "whereDoYouLive" type = "radio" value = "scotland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-2" > 
 Scotland
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-3" name = "whereDoYouLive" type = "radio" value = "wales" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-3" > 
 Wales
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-4" name = "whereDoYouLive" type = "radio" value = "northern-ireland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-4" > 
 Northern Ireland
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 

 {{ govukRadios ({
 name : "whereDoYouLive" ,
 fieldset : {
 legend : {
 text : "Where do you live?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 items : [
 {
 value : "england" ,
 text : "England" 
 },
 {
 value : "scotland" ,
 text : "Scotland" 
 },
 {
 value : "wales" ,
 text : "Wales" 
 },
 {
 value : "northern-ireland" ,
 text : "Northern Ireland" 
 }
 ]
}) }} 
 
 
 

## When to use this component

Use the radios component when users can only select one option from a list. 

## When not to use this component

Do not use the radios component if users might need to select more than one option. In this case, you should use the Checkboxes component instead. 

## How it works

Always position radios to the left of their labels. This makes them easier to find, especially for users of screen magnifiers. 

Unlike with checkboxes, users can only select one option from a list of radios. Do not assume that users will know how many options they can select based on the visual difference between radios and checkboxes alone. 

If needed, add a hint explaining this, for example, ‘Select one option’. 

Do not pre-select radio options as this makes it more likely that users will: 
 

not realise they’ve missed a question 

submit the wrong answer 
 

Users cannot go back to having no option selected once they have selected one, without refreshing their browser window. Therefore, you should include ‘None of the above’ or ‘I do not know’ if they are valid options. 

Order radio options alphabetically by default. 

In some cases, it can be helpful to order them from most-to-least common options. For example, you could order options for ‘Where do you live?’ based on population size. 

However you should do this with extreme caution as it can reinforce bias in your service. If in doubt, order alphabetically. 

Group radios together in a <fieldset> with a <legend> that describes them, as shown in the examples on this page. This is usually a question, like ‘Where do you live?’. 

### If you’re asking one question on the page

If you are asking just one question per page in your service as recommended, you can set the contents of the <legend> as the page heading. This is good practice as it means that users of screen readers will only hear the contents once. 

Read more about why and how to set legends as headings . 

There are 2 ways to use the radios component. You can use HTML or, if you are using Nunjucks or the GOV.UK Prototype Kit , you can use the Nunjucks macro. 

 

 

 
 Open this example in a new tab : radios second 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Where do you live?
 </ h1 > 
 </ legend > 
 < div class = "govuk-radios" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive" name = "whereDoYouLive" type = "radio" value = "england" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive" > 
 England
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-2" name = "whereDoYouLive" type = "radio" value = "scotland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-2" > 
 Scotland
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-3" name = "whereDoYouLive" type = "radio" value = "wales" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-3" > 
 Wales
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-4" name = "whereDoYouLive" type = "radio" value = "northern-ireland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-4" > 
 Northern Ireland
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 

 {{ govukRadios ({
 name : "whereDoYouLive" ,
 fieldset : {
 legend : {
 text : "Where do you live?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 items : [
 {
 value : "england" ,
 text : "England" 
 },
 {
 value : "scotland" ,
 text : "Scotland" 
 },
 {
 value : "wales" ,
 text : "Wales" 
 },
 {
 value : "northern-ireland" ,
 text : "Northern Ireland" 
 }
 ]
}) }} 
 
 
 

### If you’re asking more than one question on the page

If you’re asking more than one question on the page, do not set the contents of the <legend> as the page heading. Read more about asking multiple questions on Question pages . 

 

 

 
 Open this example in a new tab : radios without a heading – radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" > 
 < legend class = "govuk-fieldset__legend" > 
 Where do you live?
 </ legend > 
 < div class = "govuk-radios" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive" name = "whereDoYouLive" type = "radio" value = "england" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive" > 
 England
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-2" name = "whereDoYouLive" type = "radio" value = "scotland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-2" > 
 Scotland
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-3" name = "whereDoYouLive" type = "radio" value = "wales" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-3" > 
 Wales
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-4" name = "whereDoYouLive" type = "radio" value = "northern-ireland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-4" > 
 Northern Ireland
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 

 {{ govukRadios ({
 name : "whereDoYouLive" ,
 fieldset : {
 legend : {
 text : "Where do you live?" 
 }
 },
 items : [
 {
 value : "england" ,
 text : "England" 
 },
 {
 value : "scotland" ,
 text : "Scotland" 
 },
 {
 value : "wales" ,
 text : "Wales" 
 },
 {
 value : "northern-ireland" ,
 text : "Northern Ireland" 
 }
 ]
}) }} 
 
 
 

### Inline radios

In some cases, you can choose to display radios ‘inline’ beside one another (horizontally). 

Only use inline radios when: 
 

the question only has two options 

both options are short 
 

Remember that on small screens such as mobile devices, the radios will still be ‘stacked’ on top of one another (vertically). 

 

 

 
 Open this example in a new tab : inline radios – radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "changedName-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Have you changed your name?
 </ h1 > 
 </ legend > 
 < div id = "changedName-hint" class = "govuk-hint" > 
 This includes changing your last name or spelling your name differently
 </ div > 
 < div class = "govuk-radios govuk-radios--inline" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "changedName" name = "changedName" type = "radio" value = "yes" > 
 < label class = "govuk-label govuk-radios__label" for = "changedName" > 
 Yes
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "changedName-2" name = "changedName" type = "radio" value = "no" > 
 < label class = "govuk-label govuk-radios__label" for = "changedName-2" > 
 No
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 

 {{ govukRadios ({
 classes : "govuk-radios--inline" ,
 name : "changedName" ,
 fieldset : {
 legend : {
 text : "Have you changed your name?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "This includes changing your last name or spelling your name differently" 
 },
 items : [
 {
 value : "yes" ,
 text : "Yes" 
 },
 {
 value : "no" ,
 text : "No" 
 }
 ]
}) }} 
 
 
 

### Radio items with hints

You can add hints to radio items to provide additional information about the options. 

Keep each hint to a single short sentence, without any full stops. Screen readers will read out the entire text when users interact with an item. This could frustrate users if the text is long. 

Do not use links in hint text. While screen readers will read out the link text when describing the item, they usually do not tell users the text is a link. 

 

 

 
 Open this example in a new tab : radio items with hint – radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "signIn-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 How do you want to sign in?
 </ h1 > 
 </ legend > 
 < div id = "signIn-hint" class = "govuk-hint" > 
 You’ll need an account to prove your identity and complete your Self Assessment
 </ div > 
 < div class = "govuk-radios" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "signIn" name = "signIn" type = "radio" value = "government-gateway" aria-describedby = "signIn-item-hint" > 
 < label class = "govuk-label govuk-radios__label" for = "signIn" > 
 Sign in with Government Gateway
 </ label > 
 < div id = "signIn-item-hint" class = "govuk-hint govuk-radios__hint" > 
 You’ll have a user ID if you’ve registered for Self Assessment or filed a tax return online before
 </ div > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "signIn-2" name = "signIn" type = "radio" value = "govuk-one-login" aria-describedby = "signIn-2-item-hint" > 
 < label class = "govuk-label govuk-radios__label" for = "signIn-2" > 
 Sign in with GOV.UK One Login
 </ label > 
 < div id = "signIn-2-item-hint" class = "govuk-hint govuk-radios__hint" > 
 If you don’t have a GOV.UK One Login, you can create one
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 

 {{ govukRadios ({
 name : "signIn" ,
 fieldset : {
 legend : {
 text : "How do you want to sign in?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "You’ll need an account to prove your identity and complete your Self Assessment" 
 },
 items : [
 {
 value : "government-gateway" ,
 text : "Sign in with Government Gateway" ,
 hint : {
 text : "You’ll have a user ID if you’ve registered for Self Assessment or filed a tax return online before" 
 }
 },
 {
 value : "govuk-one-login" ,
 text : "Sign in with GOV.UK One Login" ,
 hint : {
 text : "If you don’t have a GOV.UK One Login, you can create one" 
 }
 }
 ]
}) }} 
 
 
 

### Radio items with a text divider

If one or more of your radio options is different from the others, it can help users if you separate them using a text divider. The text is usually the word ‘or’. 

 

 

 
 Open this example in a new tab : radios with a text divider – radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Where do you live?
 </ h1 > 
 </ legend > 
 < div class = "govuk-radios" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive" name = "whereDoYouLive" type = "radio" value = "england" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive" > 
 England
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-2" name = "whereDoYouLive" type = "radio" value = "scotland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-2" > 
 Scotland
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-3" name = "whereDoYouLive" type = "radio" value = "wales" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-3" > 
 Wales
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-4" name = "whereDoYouLive" type = "radio" value = "northern-ireland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-4" > 
 Northern Ireland
 </ label > 
 </ div > 
 < div class = "govuk-radios__divider" > or </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-6" name = "whereDoYouLive" type = "radio" value = "abroad" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-6" > 
 I am a British citizen living abroad
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 

 {{ govukRadios ({
 name : "whereDoYouLive" ,
 fieldset : {
 legend : {
 text : "Where do you live?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 items : [
 {
 value : "england" ,
 text : "England" 
 },
 {
 value : "scotland" ,
 text : "Scotland" 
 },
 {
 value : "wales" ,
 text : "Wales" 
 },
 {
 value : "northern-ireland" ,
 text : "Northern Ireland" 
 },
 {
 divider : "or" 
 },
 {
 value : "abroad" ,
 text : "I am a British citizen living abroad" 
 }
 ]
}) }} 
 
 
 

### Conditionally revealing a related question

You can ask the user a related question when they select a particular radio option, so they only see the question when it’s relevant to them. 

This might make two related questions easier to answer by grouping them on the same page. For example, you could reveal a phone number input when the user selects the ‘Contact me by phone’ option. 

 

 

 
 Open this example in a new tab : radios with conditionally revealing content – radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "contact-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 How would you prefer to be contacted?
 </ h1 > 
 </ legend > 
 < div id = "contact-hint" class = "govuk-hint" > 
 Select one option
 </ div > 
 < div class = "govuk-radios" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "contact" name = "contact" type = "radio" value = "email" data-aria-controls = "conditional-contact" > 
 < label class = "govuk-label govuk-radios__label" for = "contact" > 
 Email
 </ label > 
 </ div > 
 < div class = "govuk-radios__conditional govuk-radios__conditional--hidden" id = "conditional-contact" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "contact-by-email" > 
 Email address
 </ label > 
 < input class = "govuk-input govuk-!-width-one-third" id = "contact-by-email" name = "contactByEmail" type = "email" spellcheck = "false" autocomplete = "email" > 
 </ div > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "contact-2" name = "contact" type = "radio" value = "phone" data-aria-controls = "conditional-contact-2" > 
 < label class = "govuk-label govuk-radios__label" for = "contact-2" > 
 Phone
 </ label > 
 </ div > 
 < div class = "govuk-radios__conditional govuk-radios__conditional--hidden" id = "conditional-contact-2" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "contact-by-phone" > 
 Phone number
 </ label > 
 < input class = "govuk-input govuk-!-width-one-third" id = "contact-by-phone" name = "contactByPhone" type = "tel" autocomplete = "tel" > 
 </ div > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "contact-3" name = "contact" type = "radio" value = "text" data-aria-controls = "conditional-contact-3" > 
 < label class = "govuk-label govuk-radios__label" for = "contact-3" > 
 Text message
 </ label > 
 </ div > 
 < div class = "govuk-radios__conditional govuk-radios__conditional--hidden" id = "conditional-contact-3" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "contact-by-text" > 
 Mobile phone number
 </ label > 
 < input class = "govuk-input govuk-!-width-one-third" id = "contact-by-text" name = "contactByText" type = "tel" autocomplete = "tel" > 
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 
 {% from "govuk/components/input/macro.njk" import govukInput %} 

 {% set emailHtml %} 
 {{ govukInput ({
 id : "contact-by-email" ,
 name : "contactByEmail" ,
 type : "email" ,
 autocomplete : "email" ,
 spellcheck : false ,
 classes : "govuk-!-width-one-third" ,
 label : {
 text : "Email address" 
 }
}) }} 
 {% endset -%} 

 {% set phoneHtml %} 
 {{ govukInput ({
 id : "contact-by-phone" ,
 name : "contactByPhone" ,
 type : "tel" ,
 autocomplete : "tel" ,
 classes : "govuk-!-width-one-third" ,
 label : {
 text : "Phone number" 
 }
}) }} 
 {% endset -%} 

 {% set textHtml %} 
 {{ govukInput ({
 id : "contact-by-text" ,
 name : "contactByText" ,
 type : "tel" ,
 autocomplete : "tel" ,
 classes : "govuk-!-width-one-third" ,
 label : {
 text : "Mobile phone number" 
 }
}) }} 
 {% endset -%} 

 {{ govukRadios ({
 name : "contact" ,
 fieldset : {
 legend : {
 text : "How would you prefer to be contacted?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "Select one option" 
 },
 items : [
 {
 value : "email" ,
 text : "Email" ,
 conditional : {
 html : emailHtml
 }
 },
 {
 value : "phone" ,
 text : "Phone" ,
 conditional : {
 html : phoneHtml
 }
 },
 {
 value : "text" ,
 text : "Text message" ,
 conditional : {
 html : textHtml
 }
 }
 ]
}) }} 
 
 
 
Keep it simple. If the related question is complicated or has more than one part, show it on the next page in the process instead. 

Do not conditionally reveal questions to inline radios, such as ‘yes’ and ‘no’ options placed next to each other. 

Conditionally reveal questions only - do not show or hide anything that is not a question. 

#### Known issues

Users are not always notified when a conditionally revealed question is shown or hidden. This fails WCAG 2.2 success criterion 4.1.2 Name, role, value . 

However, we found that screen reader users did not have difficulty answering a conditionally revealed question - as long it’s kept simple. Users we tested with did get confused when complicated questions were conditionally revealed to them, particularly questions with more than one part. 

We’ll keep looking for opportunities to learn more about how conditionally revealed questions be used in services . 

### Smaller radios

Use standard-sized radios in nearly all cases. However, smaller versions work well on pages where it’s helpful to make them less visually prominent. 

For example, on a page of search results, the primary user need is to see the results. Using smaller radios lets users see and change search filters without distracting them from the main content. 

 

 

 
 Open this example in a new tab : small radios – radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--m" > 
 < h1 class = "govuk-fieldset__heading" > 
 Filter
 </ h1 > 
 </ legend > 
 < div class = "govuk-radios govuk-radios--small" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "changedName" name = "changedName" type = "radio" value = "month" > 
 < label class = "govuk-label govuk-radios__label" for = "changedName" > 
 Monthly
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "changedName-2" name = "changedName" type = "radio" value = "year" > 
 < label class = "govuk-label govuk-radios__label" for = "changedName-2" > 
 Yearly
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 

 {{ govukRadios ({
 classes : "govuk-radios--small" ,
 name : "changedName" ,
 fieldset : {
 legend : {
 text : "Filter" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--m" 
 }
 },
 items : [
 {
 value : "month" ,
 text : "Monthly" 
 },
 {
 value : "year" ,
 text : "Yearly" 
 }
 ]
}) }} 
 
 
 
Small radios can work well on information dense screens in services designed for repeat use, like caseworking systems. 

In services like these, the risk that they will not be noticed is lower because users return to the screen multiple times. 

### Error messages

Display an error message if the user has not: 
 

selected any radios 

answered a conditionally revealed question 
 

Error messages should be styled like this: 

 

 

 
 Open this example in a new tab : inline radios with error – radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group govuk-form-group--error" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "whereDoYouLive-error" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Where do you live?
 </ h1 > 
 </ legend > 
 < p id = "whereDoYouLive-error" class = "govuk-error-message" > 
 < span class = "govuk-visually-hidden" > Error: </ span > Select the country where you live
 </ p > 
 < div class = "govuk-radios" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive" name = "whereDoYouLive" type = "radio" value = "england" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive" > 
 England
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-2" name = "whereDoYouLive" type = "radio" value = "scotland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-2" > 
 Scotland
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-3" name = "whereDoYouLive" type = "radio" value = "wales" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-3" > 
 Wales
 </ label > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "whereDoYouLive-4" name = "whereDoYouLive" type = "radio" value = "northern-ireland" > 
 < label class = "govuk-label govuk-radios__label" for = "whereDoYouLive-4" > 
 Northern Ireland
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 

 {{ govukRadios ({
 name : "whereDoYouLive" ,
 fieldset : {
 legend : {
 text : "Where do you live?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 items : [
 {
 value : "england" ,
 text : "England" 
 },
 {
 value : "scotland" ,
 text : "Scotland" 
 },
 {
 value : "wales" ,
 text : "Wales" 
 },
 {
 value : "northern-ireland" ,
 text : "Northern Ireland" 
 }
 ],
 errorMessage : {
 text : "Select the country where you live" 
 }
}) }} 
 
 
 
Make sure errors follow the guidance in the Error message component and have specific error messages for specific error states. 

#### If it’s a ‘yes’ or ‘no’ question

Say ‘Select yes if [whatever it is is true]’. For example, ‘Select yes if Sarah normally lives with you’. 

#### If there are two options which are not ‘yes’ and ‘no’

Say ‘Select if [whatever it is]’. For example, ‘Select if you are employed or self-employed’. 

#### If there are more than two options

Say ‘Select [whatever it is]’. For example, ‘Select the day of the week you pay your rent’. 

#### If it’s a conditionally revealed question

Include an Error message component that is clearly related to the initial question. 

 

 

 
 Open this example in a new tab : radios with conditionally revealing content showing an error – radios 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "contact-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 How would you prefer to be contacted?
 </ h1 > 
 </ legend > 
 < div id = "contact-hint" class = "govuk-hint" > 
 Select one option
 </ div > 
 < div class = "govuk-radios" data-module = "govuk-radios" > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "contact" name = "contact" type = "radio" value = "email" checked data-aria-controls = "conditional-contact" > 
 < label class = "govuk-label govuk-radios__label" for = "contact" > 
 Email
 </ label > 
 </ div > 
 < div class = "govuk-radios__conditional" id = "conditional-contact" > 
 < div class = "govuk-form-group govuk-form-group--error" > 
 < label class = "govuk-label" for = "contact-by-email" > 
 Email address
 </ label > 
 < p id = "contact-by-email-error" class = "govuk-error-message" > 
 < span class = "govuk-visually-hidden" > Error: </ span > Email address cannot be blank
 </ p > 
 < input class = "govuk-input govuk-!-width-one-half govuk-input--error" id = "contact-by-email" name = "contactByEmail" type = "email" spellcheck = "false" aria-describedby = "contact-by-email-error" autocomplete = "email" > 
 </ div > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "contact-2" name = "contact" type = "radio" value = "phone" data-aria-controls = "conditional-contact-2" > 
 < label class = "govuk-label govuk-radios__label" for = "contact-2" > 
 Phone
 </ label > 
 </ div > 
 < div class = "govuk-radios__conditional govuk-radios__conditional--hidden" id = "conditional-contact-2" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "contact-by-phone" > 
 Phone number
 </ label > 
 < input class = "govuk-input govuk-!-width-one-third" id = "contact-by-phone" name = "contactByPhone" type = "tel" autocomplete = "tel" > 
 </ div > 
 </ div > 
 < div class = "govuk-radios__item" > 
 < input class = "govuk-radios__input" id = "contact-3" name = "contact" type = "radio" value = "text" data-aria-controls = "conditional-contact-3" > 
 < label class = "govuk-label govuk-radios__label" for = "contact-3" > 
 Text message
 </ label > 
 </ div > 
 < div class = "govuk-radios__conditional govuk-radios__conditional--hidden" id = "conditional-contact-3" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "contact-by-text" > 
 Mobile phone number
 </ label > 
 < input class = "govuk-input govuk-!-width-one-third" id = "contact-by-text" name = "contactByText" type = "tel" autocomplete = "tel" > 
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
 
 
 
 

 fieldset 
 object 
 
 The fieldset used by the radios component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the radios component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the radios component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the radios component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each radio input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for the radio items.
 
 
 

 items 
 array 
 
 Required. 
 The radio items within the radios component.
 See macro options for items .
 
 
 

 value 
 string 
 
 The value for the radio which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the radio container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio container.
 
 
 
 
 
 Options for form Group object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the form group (for example to show error state for the whole group).
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the form group.
 
 
 

 before Inputs 
 object 
 
 Content to add before all radio items within the radios component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all radio items within the radios component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all radio items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all radio items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each radio item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the radio item. If omitted, then idPrefix string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the radio input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each radio item within the radios component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each radio item within the radios component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate radio items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the radio should be checked when the page loads. Takes precedence over the top-level value option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the radio is checked.
 See macro options for items conditional .
 
 
 

 disabled 
 boolean 
 
 If true , radio will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the radio input tag.
 
 
 
 
 
 Options for items label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
 Options for items conditional object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 html 
 string 
 
 Required. 
 The HTML to reveal when the radio is checked.
 
 
 
 
 
 Options for hint component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the hint. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Optional ID attribute to add to the hint span tag.
 
 
 

 classes 
 string 
 
 Classes to add to the hint span tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the hint span tag.
 
 
 
 
 

 {% from "govuk/components/radios/macro.njk" import govukRadios %} 
 {% from "govuk/components/input/macro.njk" import govukInput %} 

 {% set emailHtml %} 
 {{ govukInput ({
 id : "contact-by-email" ,
 name : "contactByEmail" ,
 type : "email" ,
 autocomplete : "email" ,
 spellcheck : false ,
 classes : "govuk-!-width-one-half" ,
 label : {
 text : "Email address" 
 },
 errorMessage : {
 text : "Email address cannot be blank" 
 }
}) }} 
 {% endset -%} 

 {% set phoneHtml %} 
 {{ govukInput ({
 id : "contact-by-phone" ,
 name : "contactByPhone" ,
 type : "tel" ,
 autocomplete : "tel" ,
 classes : "govuk-!-width-one-third" ,
 label : {
 text : "Phone number" 
 }
}) }} 
 {% endset -%} 

 {% set textHtml %} 
 {{ govukInput ({
 id : "contact-by-text" ,
 name : "contactByText" ,
 type : "tel" ,
 autocomplete : "tel" ,
 classes : "govuk-!-width-one-third" ,
 label : {
 text : "Mobile phone number" 
 }
}) }} 
 {% endset -%} 

 {{ govukRadios ({
 name : "contact" ,
 fieldset : {
 legend : {
 text : "How would you prefer to be contacted?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "Select one option" 
 },
 items : [
 {
 value : "email" ,
 text : "Email" ,
 checked : true ,
 conditional : {
 html : emailHtml
 }
 },
 {
 value : "phone" ,
 text : "Phone" ,
 conditional : {
 html : phoneHtml
 }
 },
 {
 value : "text" ,
 text : "Text message" ,
 conditional : {
 html : textHtml
 }
 }
 ]
}) }} 
 
 
 

## Research on this component

If you’ve done any user research involving conditionally revealed questions, particularly with users of assistive technologies, tell us what you’ve learned by adding a comment to the discussion about this component . 

Read a blog post about an update to the radios and checkboxes components in 2016 . 

 

 

 

## Help improve this component

 

 To help make sure that this page is useful, relevant and up to date, you can:
 
 
 

 take part in the
 
 ‘Radios’ discussion on GitHub
 
 and share your research
 
 

 propose a change on GitHub 
 – read more about
 
 how to propose changes in GitHub
 
 
 

 

## Need help?

 

 If you’ve got a question about the GOV.UK Design System, contact the team .
 
 
 
 

 
 Back to top
