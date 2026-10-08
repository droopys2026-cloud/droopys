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
 Checkboxes
 

 

 

 
Let users select one or more options by using the checkboxes component. 

 

 

 
 Open this example in a new tab : checkboxes 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "waste-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Which types of waste do you transport?
 </ h1 > 
 </ legend > 
 < div id = "waste-hint" class = "govuk-hint" > 
 Select all that apply
 </ div > 
 < div class = "govuk-checkboxes" data-module = "govuk-checkboxes" > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste" name = "waste" type = "checkbox" value = "carcasses" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste" > 
 Waste from animal carcasses
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste-2" name = "waste" type = "checkbox" value = "mines" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste-2" > 
 Waste from mines or quarries
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste-3" name = "waste" type = "checkbox" value = "farm" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste-3" > 
 Farm or agricultural waste
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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

 {{ govukCheckboxes ({
 name : "waste" ,
 fieldset : {
 legend : {
 text : "Which types of waste do you transport?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "Select all that apply" 
 },
 items : [
 {
 value : "carcasses" ,
 text : "Waste from animal carcasses" 
 },
 {
 value : "mines" ,
 text : "Waste from mines or quarries" 
 },
 {
 value : "farm" ,
 text : "Farm or agricultural waste" 
 }
 ]
}) }} 
 
 
 

## When to use this component

Use the checkboxes component when you need to help users: 
 

select multiple options from a list 

toggle a single option on or off 
 

## When not to use this component

Do not use the checkboxes component if users can only choose one option from a selection. In this case, use the Radios component . 

## How it works

Always position checkboxes to the left of their labels. This makes them easier to find, especially for users of screen magnifiers. 

Unlike with radios, users can select multiple options from a list of checkboxes. Do not assume that users will know how many options they can select based on the visual difference between radios and checkboxes alone. 

If needed, add a hint explaining this, for example, ‘Select all that apply’. 

Do not pre-select checkbox options as this makes it more likely that users will: 
 

not realise they’ve missed a question 

submit the wrong answer 
 

Order checkbox options alphabetically by default. 

In some cases, it can be helpful to order them from most-to-least common options. For example, you could order options for ‘What is your nationality?’ based on population size. 

Group checkboxes together in a <fieldset> with a <legend> that describes them, as shown in the examples on this page. This is usually a question, like ‘How would you like to be contacted?’. 

### If you’re asking one question on the page

If you’re asking just one question per page as recommended, you can set the contents of the <legend> as the page heading. This is good practice as it means that users of screen readers will only hear the contents once. 

Read more about why and how to set legends as headings . 

There are 2 ways to use the checkboxes component. You can use HTML or, if you’re using Nunjucks or the GOV.UK Prototype Kit , you can use the Nunjucks macro. 

 

 

 
 Open this example in a new tab : checkboxes second 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "waste-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Which types of waste do you transport?
 </ h1 > 
 </ legend > 
 < div id = "waste-hint" class = "govuk-hint" > 
 Select all that apply
 </ div > 
 < div class = "govuk-checkboxes" data-module = "govuk-checkboxes" > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste" name = "waste" type = "checkbox" value = "carcasses" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste" > 
 Waste from animal carcasses
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste-2" name = "waste" type = "checkbox" value = "mines" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste-2" > 
 Waste from mines or quarries
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste-3" name = "waste" type = "checkbox" value = "farm" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste-3" > 
 Farm or agricultural waste
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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

 {{ govukCheckboxes ({
 name : "waste" ,
 fieldset : {
 legend : {
 text : "Which types of waste do you transport?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "Select all that apply" 
 },
 items : [
 {
 value : "carcasses" ,
 text : "Waste from animal carcasses" 
 },
 {
 value : "mines" ,
 text : "Waste from mines or quarries" 
 },
 {
 value : "farm" ,
 text : "Farm or agricultural waste" 
 }
 ]
}) }} 
 
 
 

### If you’re asking more than one question on the page

If you’re asking more than one question on the page, do not set the contents of the <legend> as the page heading. Read more about asking multiple questions on Question pages . 

 

 

 
 Open this example in a new tab : checkboxes without a heading – checkboxes 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "waste-hint" > 
 < legend class = "govuk-fieldset__legend" > 
 Which types of waste do you transport?
 </ legend > 
 < div id = "waste-hint" class = "govuk-hint" > 
 Select all that apply
 </ div > 
 < div class = "govuk-checkboxes" data-module = "govuk-checkboxes" > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste" name = "waste" type = "checkbox" value = "carcasses" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste" > 
 Waste from animal carcasses
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste-2" name = "waste" type = "checkbox" value = "mines" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste-2" > 
 Waste from mines or quarries
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "waste-3" name = "waste" type = "checkbox" value = "farm" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "waste-3" > 
 Farm or agricultural waste
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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

 {{ govukCheckboxes ({
 name : "waste" ,
 fieldset : {
 legend : {
 text : "Which types of waste do you transport?" 
 }
 },
 hint : {
 text : "Select all that apply" 
 },
 items : [
 {
 value : "carcasses" ,
 text : "Waste from animal carcasses" 
 },
 {
 value : "mines" ,
 text : "Waste from mines or quarries" 
 },
 {
 value : "farm" ,
 text : "Farm or agricultural waste" 
 }
 ]
}) }} 
 
 
 

### Checkbox items with hints

You can add hints to checkbox items to provide additional information about the options. 

Keep each hint to a single short sentence, without any full stops. Screen readers will read out the entire text when users interact with an item. This could frustrate users if the text is long. 

Do not use links in hint text. While screen readers will read out the link text when describing the item, they usually do not tell users the text is a link. 

 

 

 
 Open this example in a new tab : checkbox items with hint – checkboxes 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "nationality-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 What is your nationality?
 </ h1 > 
 </ legend > 
 < div id = "nationality-hint" class = "govuk-hint" > 
 If you have dual nationality, select all options that are relevant to you.
 </ div > 
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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

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
 text : "If you have dual nationality, select all options that are relevant to you." 
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
 
 
 

### Add an option for ‘none’

When ‘none’ would be a valid answer, give users the option to check a box to say none of the other options apply to them – without this option, users would have to leave all of the boxes unchecked. Giving users this option also makes sure they do not skip the question by accident. 

Remember to start by asking one question per page in your service . You might be able to remove the need for a ‘none’ option by asking the user a better question or filtering them out with a ‘filter question’ beforehand. The GOV.UK Service Manual has guidance on designing good questions . 

Show the ‘none’ option last. Separate it from the other options using a divider. The text is usually the word ‘or’. 

Write a label that repeats the key part of the question. 

For example, for the question ‘Will you be travelling to any of these countries?’, say ‘No, I will not be travelling to any of these countries.’ 

To enable some JavaScript that unchecks all other checkboxes when the user clicks ‘None’, add the exclusive behaviour to the ‘none’ checkbox. 

 

 

 
 Open this example in a new tab : checkboxes with ‘none’ option – checkboxes 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "countries-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Will you be travelling to any of these countries?
 </ h1 > 
 </ legend > 
 < div id = "countries-hint" class = "govuk-hint" > 
 Select all countries that apply
 </ div > 
 < div class = "govuk-checkboxes" data-module = "govuk-checkboxes" > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "countries" name = "countries" type = "checkbox" value = "france" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "countries" > 
 France
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "countries-2" name = "countries" type = "checkbox" value = "portugal" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "countries-2" > 
 Portugal
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "countries-3" name = "countries" type = "checkbox" value = "spain" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "countries-3" > 
 Spain
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__divider" > or </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "countries-5" name = "countries" type = "checkbox" value = "none" data-behaviour = "exclusive" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "countries-5" > 
 No, I will not be travelling to any of these countries
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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

 {{ govukCheckboxes ({
 name : "countries" ,
 fieldset : {
 legend : {
 text : "Will you be travelling to any of these countries?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "Select all countries that apply" 
 },
 items : [
 {
 value : "france" ,
 text : "France" 
 },
 {
 value : "portugal" ,
 text : "Portugal" 
 },
 {
 value : "spain" ,
 text : "Spain" 
 },
 {
 divider : "or" 
 },
 {
 value : "none" ,
 text : "No, I will not be travelling to any of these countries" ,
 behaviour : "exclusive" 
 }
 ]
}) }} 
 
 
 
If JavaScript is unavailable, and a user selects both the ‘none’ checkbox and another checkbox, display an error message. 

 

 

 
 Open this example in a new tab : checkboxes with ‘none’ option showing an error – checkboxes 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group govuk-form-group--error" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "countries-error" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 Will you be travelling to any of these countries?
 </ h1 > 
 </ legend > 
 < p id = "countries-error" class = "govuk-error-message" > 
 < span class = "govuk-visually-hidden" > Error: </ span > Select countries you will be travelling to, or select ‘No, I will not be travelling to any of these countries’
 </ p > 
 < div class = "govuk-checkboxes" data-module = "govuk-checkboxes" > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "countries" name = "countries" type = "checkbox" value = "france" checked > 
 < label class = "govuk-label govuk-checkboxes__label" for = "countries" > 
 France
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "countries-2" name = "countries" type = "checkbox" value = "portugal" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "countries-2" > 
 Portugal
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "countries-3" name = "countries" type = "checkbox" value = "spain" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "countries-3" > 
 Spain
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__divider" > or </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "countries-5" name = "countries" type = "checkbox" value = "none" checked data-behaviour = "exclusive" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "countries-5" > 
 No, I will not be travelling to any of these countries
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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

 {{ govukCheckboxes ({
 name : "countries" ,
 fieldset : {
 legend : {
 text : "Will you be travelling to any of these countries?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 errorMessage : {
 text : "Select countries you will be travelling to, or select ‘No, I will not be travelling to any of these countries’" 
 },
 items : [
 {
 value : "france" ,
 text : "France" ,
 checked : true 
 },
 {
 value : "portugal" ,
 text : "Portugal" 
 },
 {
 value : "spain" ,
 text : "Spain" 
 },
 {
 divider : "or" 
 },
 {
 value : "none" ,
 text : "No, I will not be travelling to any of these countries" ,
 checked : true ,
 behaviour : "exclusive" 
 }
 ]
}) }} 
 
 
 

### Conditionally revealing a related question

You can ask the user a related question when they select a particular checkbox, so they only see the question when it’s relevant to them. 

This might make 2 related questions easier to answer by grouping them on the same page. For example, you could reveal a phone number input when the user selects the ‘Contact me by phone’ option. 

 

 

 
 Open this example in a new tab : checkboxes with conditionally revealing content – checkboxes 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" aria-describedby = "contact-hint" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--l" > 
 < h1 class = "govuk-fieldset__heading" > 
 How would you like to be contacted?
 </ h1 > 
 </ legend > 
 < div id = "contact-hint" class = "govuk-hint" > 
 Select all options that are relevant to you
 </ div > 
 < div class = "govuk-checkboxes" data-module = "govuk-checkboxes" > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "contact" name = "contact" type = "checkbox" value = "email" data-aria-controls = "conditional-contact" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "contact" > 
 Email
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden" id = "conditional-contact" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "contact-by-email" > 
 Email address
 </ label > 
 < input class = "govuk-input govuk-!-width-one-third" id = "contact-by-email" name = "contactByEmail" type = "email" spellcheck = "false" autocomplete = "email" > 
 </ div > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "contact-2" name = "contact" type = "checkbox" value = "phone" data-aria-controls = "conditional-contact-2" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "contact-2" > 
 Phone
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden" id = "conditional-contact-2" > 
 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "contact-by-phone" > 
 Phone number
 </ label > 
 < input class = "govuk-input govuk-!-width-one-third" id = "contact-by-phone" name = "contactByPhone" type = "tel" autocomplete = "tel" > 
 </ div > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "contact-3" name = "contact" type = "checkbox" value = "text message" data-aria-controls = "conditional-contact-3" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "contact-3" > 
 Text message
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__conditional govuk-checkboxes__conditional--hidden" id = "conditional-contact-3" > 
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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 
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

 {{ govukCheckboxes ({
 name : "contact" ,
 fieldset : {
 legend : {
 text : "How would you like to be contacted?" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--l" 
 }
 },
 hint : {
 text : "Select all options that are relevant to you" 
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
 value : "text message" ,
 text : "Text message" ,
 conditional : {
 html : textHtml
 }
 }
 ]
}) }} 
 
 
 
Keep it simple. If the related question is complicated or has more than one part, show it on the next page in the process instead. 

You should only conditionally reveal questions - do not show or hide anything that is not a question. 

#### Known issues

Users are not always notified when a conditionally revealed question is shown or hidden. This fails WCAG 2.2 success criterion 4.1.2 Name, Role, Value . 

However, we found that screen reader users did not have difficulty answering a conditionally revealed question - as long as it’s kept simple. It confused our test users when we conditionally revealed complicated questions to them. 

We’ll keep looking for opportunities to learn more about how conditionally revealed questions should be used in services . 

### Smaller checkboxes

Use standard-sized checkboxes in most cases. However, smaller checkboxes work well on pages where it’s helpful to make them less visually prominent. 

For example, on a page of search results, the main user need is to see the results. Using smaller checkboxes lets users see and change search filters without distracting them from the main content. 

 

 

 
 Open this example in a new tab : small checkboxes – checkboxes 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < fieldset class = "govuk-fieldset" > 
 < legend class = "govuk-fieldset__legend govuk-fieldset__legend--m" > 
 < h1 class = "govuk-fieldset__heading" > 
 Organisation
 </ h1 > 
 </ legend > 
 < div class = "govuk-checkboxes govuk-checkboxes--small" data-module = "govuk-checkboxes" > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "organisation" name = "organisation" type = "checkbox" value = "hmrc" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "organisation" > 
 HM Revenue and Customs (HMRC)
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "organisation-2" name = "organisation" type = "checkbox" value = "employment-tribunal" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "organisation-2" > 
 Employment Tribunal
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "organisation-3" name = "organisation" type = "checkbox" value = "MOD" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "organisation-3" > 
 Ministry of Defence
 </ label > 
 </ div > 
 < div class = "govuk-checkboxes__item" > 
 < input class = "govuk-checkboxes__input" id = "organisation-4" name = "organisation" type = "checkbox" value = "DfT" > 
 < label class = "govuk-label govuk-checkboxes__label" for = "organisation-4" > 
 Department for Transport
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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

 {{ govukCheckboxes ({
 name : "organisation" ,
 classes : "govuk-checkboxes--small" ,
 fieldset : {
 legend : {
 text : "Organisation" ,
 isPageHeading : true ,
 classes : "govuk-fieldset__legend--m" 
 }
 },
 items : [
 {
 value : "hmrc" ,
 text : "HM Revenue and Customs (HMRC)" 
 },
 {
 value : "employment-tribunal" ,
 text : "Employment Tribunal" 
 },
 {
 value : "MOD" ,
 text : "Ministry of Defence" 
 },
 {
 value : "DfT" ,
 text : "Department for Transport" 
 }
 ]
}) }} 
 
 
 
Small checkboxes can work well on information dense screens in services designed for repeat use, like caseworking systems. 

In services like these, the risk that they will not be noticed is lower because users return to the screen multiple times. 

### Error messages

Error messages should be styled like this: 

 

 

 
 Open this example in a new tab : checkbox items with error – checkboxes 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

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
 
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the input aria-describedby attribute without a fieldset, used to provide additional descriptive information for screenreader users.
 
 
 

 fieldset 
 object 
 
 Can be used to add a fieldset to the checkboxes component.
 See macro options for fieldset .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the checkboxes component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the checkboxes component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the checkboxes component.
 See macro options for form Group .
 
 
 

 id Prefix 
 string 
 
 Optional prefix. This is used to prefix the id attribute for each checkbox item input, hint and error message, separated by - . Defaults to the name option value.
 
 
 

 name 
 string 
 
 Required. 
 Name attribute for all checkbox items.
 
 
 

 items 
 array 
 
 Required. 
 The checkbox items within the checkboxes component.
 See macro options for items .
 
 
 

 values 
 array 
 
 Array of values for checkboxes which should be checked when the page loads. Use this as an alternative to setting the checked option on each individual item.
 
 
 

 classes 
 string 
 
 Classes to add to the checkboxes container.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkboxes container.
 
 
 
 
 
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
 
 Content to add before all checkbox items within the checkboxes component.
 See macro options for form Group before Inputs .
 
 
 

 after Inputs 
 object 
 
 Content to add after all checkbox items within the checkboxes component.
 See macro options for form Group after Inputs .
 
 
 
 
 
 Options for form Group before Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Inputs object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after all checkbox items. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within each checkbox item label. If html is provided, the text option will be ignored.
 
 
 

 id 
 string 
 
 Specific ID attribute for the checkbox item. If omitted, then component global idPrefix option will be applied.
 
 
 

 name 
 string 
 
 Specific name for the checkbox item. If omitted, then component global name string will be applied.
 
 
 

 value 
 string 
 
 Required. 
 Value for the checkbox input.
 
 
 

 label 
 object 
 
 Subset of options for the label used by each checkbox item within the checkboxes component.
 See macro options for items label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to each checkbox item within the checkboxes component.
 See macro options for hint .
 
 
 

 divider 
 string 
 
 Divider text to separate checkbox items, for example the text "or" .
 
 
 

 checked 
 boolean 
 
 Whether the checkbox should be checked when the page loads. Takes precedence over the top-level values option.
 
 
 

 conditional 
 object 
 
 Provide additional content to reveal when the checkbox is checked.
 See macro options for items conditional .
 
 
 

 behaviour 
 string 
 
 If set to "exclusive" , implements a ‘None of these’ type behaviour via JavaScript when checkboxes are clicked.
 
 
 

 disabled 
 boolean 
 
 If true , checkbox will be disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the checkbox input tag.
 
 
 
 
 
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
 The HTML to reveal when the checkbox is checked.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/checkboxes/macro.njk" import govukCheckboxes %} 

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
 
 
 
Make sure errors follow the guidance in the Error message component and have specific error messages for specific error states. 

#### If nothing is selected and the question has options in it

Say ‘Select if [whatever it is]’.

For example, ‘Select if you are British, Irish or a citizen of a different country’. 

#### If nothing is selected and the question does not have options in it

Say ‘Select [whatever it is]’.

For example, ‘Select your nationality or nationalities’. 

#### If users check both a ‘none’ checkbox and another checkbox

Say: 

Select [option label text] or select ‘[none of the above label text]’ 
For example: 

Select countries you will be travelling to, or select ‘No, I will not be travelling to any of these countries’ 

## Research on this component

If you’ve done any user research involving conditionally revealed questions, particularly with users of assistive technologies, tell us what you’ve learned by adding a comment to the discussion about this component . 

Read a blog post about an update to the radios and checkboxes components in 2016 . 

 

 

 

## Help improve this component

 

 To help make sure that this page is useful, relevant and up to date, you can:
 
 
 

 take part in the
 
 ‘Checkboxes’ discussion on GitHub
 
 and share your research
 
 

 propose a change on GitHub 
 – read more about
 
 how to propose changes in GitHub
 
 
 

 

## Need help?

 

 If you’ve got a question about the GOV.UK Design System, contact the team .
 
 
 
 

 
 Back to top
