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
 Select
 

 

 

 

 

 

 
 Open this example in a new tab : select 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "sort" > 
 Sort by
 </ label > 
 < select class = "govuk-select" id = "sort" name = "sort" > 
 < option value = "published" > Recently published </ option > 
 < option value = "updated" selected > Recently updated </ option > 
 < option value = "views" > Most views </ option > 
 < option value = "comments" > Most comments </ option > 
 </ select > 
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
 
 
 
 

 id 
 string 
 
 ID for the select box. Defaults to the value of name .
 
 
 

 name 
 string 
 
 Required. 
 Name property for the select.
 
 
 

 items 
 array 
 
 Required. 
 The items within the select component.
 See macro options for items .
 
 
 

 value 
 string 
 
 Value for the option which should be selected. Use this as an alternative to setting the selected option on each individual item.
 
 
 

 disabled 
 boolean 
 
 If true , select box will be disabled. Use the disabled option on each individual item to only disable certain options.
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 
 
 

 label 
 object 
 
 Required. 
 The label used by the select component.
 See macro options for label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the select component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the select component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the select component.
 See macro options for form Group .
 
 
 

 classes 
 string 
 
 Classes to add to the select.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the select.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 value 
 string 
 
 Value for the option. If this is omitted, the value is taken from the text content of the option element.
 
 
 

 text 
 string 
 
 Required. 
 Text for the option item.
 
 
 

 selected 
 boolean 
 
 Whether the option should be selected when the page loads. Takes precedence over the top-level value option.
 
 
 

 disabled 
 boolean 
 
 Sets the option item as disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the option.
 
 
 
 
 
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
 
 
 

 before Input 
 object 
 
 Content to add before the select used by the select component.
 See macro options for form Group before Input .
 
 
 

 after Input 
 object 
 
 Content to add after the select used by the select component.
 See macro options for form Group after Input .
 
 
 
 
 
 Options for form Group before Input object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before the select. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before the select. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Input object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after the select. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after the select. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the label. If html is provided, the text option will be ignored.
 
 
 

 for 
 string 
 
 The value of the for attribute, the ID of the input the label is associated with.
 
 
 

 is Page Heading 
 boolean 
 
 Whether the label also acts as the heading for the page.
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/select/macro.njk" import govukSelect %} 

 {{ govukSelect ({
 id : "sort" ,
 name : "sort" ,
 label : {
 text : "Sort by" 
 },
 items : [
 {
 value : "published" ,
 text : "Recently published" 
 },
 {
 value : "updated" ,
 text : "Recently updated" ,
 selected : true 
 },
 {
 value : "views" ,
 text : "Most views" 
 },
 {
 value : "comments" ,
 text : "Most comments" 
 }
 ]
}) }} 
 
 
 

## When to use this component

The select component should only be used as a last resort in public-facing services because research shows that some users find selects very difficult to use. 

## When not to use this component

The select component allows users to choose an option from a long list. Before using the select component, try asking users questions which will allow you to present them with fewer options. 

Asking questions means you’re less likely to need to use the select component, and can consider using a different solution, such as a Radios component . 

## How it works

If you use the component for settings, you can make an option pre-selected by default when users first see it. 

If you use the component for questions, you should not pre-select any of the options in case it influences users’ answers. 

There are 2 ways to use the select component. You can use HTML or, if you’re using Nunjucks or the GOV.UK Prototype Kit , you can use the Nunjucks macro. 

 

 

 
 Open this example in a new tab : select second 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "sort" > 
 Sort by
 </ label > 
 < select class = "govuk-select" id = "sort" name = "sort" > 
 < option value = "published" > Recently published </ option > 
 < option value = "updated" selected > Recently updated </ option > 
 < option value = "views" > Most views </ option > 
 < option value = "comments" > Most comments </ option > 
 </ select > 
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
 
 
 
 

 id 
 string 
 
 ID for the select box. Defaults to the value of name .
 
 
 

 name 
 string 
 
 Required. 
 Name property for the select.
 
 
 

 items 
 array 
 
 Required. 
 The items within the select component.
 See macro options for items .
 
 
 

 value 
 string 
 
 Value for the option which should be selected. Use this as an alternative to setting the selected option on each individual item.
 
 
 

 disabled 
 boolean 
 
 If true , select box will be disabled. Use the disabled option on each individual item to only disable certain options.
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 
 
 

 label 
 object 
 
 Required. 
 The label used by the select component.
 See macro options for label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the select component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the select component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the select component.
 See macro options for form Group .
 
 
 

 classes 
 string 
 
 Classes to add to the select.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the select.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 value 
 string 
 
 Value for the option. If this is omitted, the value is taken from the text content of the option element.
 
 
 

 text 
 string 
 
 Required. 
 Text for the option item.
 
 
 

 selected 
 boolean 
 
 Whether the option should be selected when the page loads. Takes precedence over the top-level value option.
 
 
 

 disabled 
 boolean 
 
 Sets the option item as disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the option.
 
 
 
 
 
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
 
 
 

 before Input 
 object 
 
 Content to add before the select used by the select component.
 See macro options for form Group before Input .
 
 
 

 after Input 
 object 
 
 Content to add after the select used by the select component.
 See macro options for form Group after Input .
 
 
 
 
 
 Options for form Group before Input object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before the select. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before the select. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Input object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after the select. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after the select. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the label. If html is provided, the text option will be ignored.
 
 
 

 for 
 string 
 
 The value of the for attribute, the ID of the input the label is associated with.
 
 
 

 is Page Heading 
 boolean 
 
 Whether the label also acts as the heading for the page.
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/select/macro.njk" import govukSelect %} 

 {{ govukSelect ({
 id : "sort" ,
 name : "sort" ,
 label : {
 text : "Sort by" 
 },
 items : [
 {
 value : "published" ,
 text : "Recently published" 
 },
 {
 value : "updated" ,
 text : "Recently updated" ,
 selected : true 
 },
 {
 value : "views" ,
 text : "Most views" 
 },
 {
 value : "comments" ,
 text : "Most comments" 
 }
 ]
}) }} 
 
 
 

### Select with hint

You can add hint text to help the user understand the options and choose one of them. 

Keep hint text to a single short sentence, without any full stops. 

Do not use links in hint text. While screen readers will read out the link text, they usually do not tell users the text is a link. 

 

 

 
 Open this example in a new tab : select with hint – select 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group" > 
 < label class = "govuk-label" for = "location" > 
 Choose location
 </ label > 
 < div id = "location-hint" class = "govuk-hint" > 
 This can be different to where you went before
 </ div > 
 < select class = "govuk-select" id = "location" name = "location" aria-describedby = "location-hint" > 
 < option value = "choose" selected > Choose location </ option > 
 < option value = "eastmidlands" > East Midlands </ option > 
 < option value = "eastofengland" > East of England </ option > 
 < option value = "london" > London </ option > 
 < option value = "northeast" > North East </ option > 
 < option value = "northwest" > North West </ option > 
 < option value = "southeast" > South East </ option > 
 < option value = "southwest" > South West </ option > 
 < option value = "westmidlands" > West Midlands </ option > 
 < option value = "yorkshire" > Yorkshire and the Humber </ option > 
 </ select > 
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
 
 
 
 

 id 
 string 
 
 ID for the select box. Defaults to the value of name .
 
 
 

 name 
 string 
 
 Required. 
 Name property for the select.
 
 
 

 items 
 array 
 
 Required. 
 The items within the select component.
 See macro options for items .
 
 
 

 value 
 string 
 
 Value for the option which should be selected. Use this as an alternative to setting the selected option on each individual item.
 
 
 

 disabled 
 boolean 
 
 If true , select box will be disabled. Use the disabled option on each individual item to only disable certain options.
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 
 
 

 label 
 object 
 
 Required. 
 The label used by the select component.
 See macro options for label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the select component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the select component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the select component.
 See macro options for form Group .
 
 
 

 classes 
 string 
 
 Classes to add to the select.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the select.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 value 
 string 
 
 Value for the option. If this is omitted, the value is taken from the text content of the option element.
 
 
 

 text 
 string 
 
 Required. 
 Text for the option item.
 
 
 

 selected 
 boolean 
 
 Whether the option should be selected when the page loads. Takes precedence over the top-level value option.
 
 
 

 disabled 
 boolean 
 
 Sets the option item as disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the option.
 
 
 
 
 
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
 
 
 

 before Input 
 object 
 
 Content to add before the select used by the select component.
 See macro options for form Group before Input .
 
 
 

 after Input 
 object 
 
 Content to add after the select used by the select component.
 See macro options for form Group after Input .
 
 
 
 
 
 Options for form Group before Input object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before the select. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before the select. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Input object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after the select. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after the select. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the label. If html is provided, the text option will be ignored.
 
 
 

 for 
 string 
 
 The value of the for attribute, the ID of the input the label is associated with.
 
 
 

 is Page Heading 
 boolean 
 
 Whether the label also acts as the heading for the page.
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/select/macro.njk" import govukSelect %} 

 {{ govukSelect ({
 id : "location" ,
 name : "location" ,
 label : {
 text : "Choose location" 
 },
 hint : {
 text : "This can be different to where you went before" 
 },
 items : [
 {
 value : "choose" ,
 text : "Choose location" ,
 selected : true 
 },
 {
 value : "eastmidlands" ,
 text : "East Midlands" 
 },
 {
 value : "eastofengland" ,
 text : "East of England" 
 },
 {
 value : "london" ,
 text : "London" 
 },
 {
 value : "northeast" ,
 text : "North East" 
 },
 {
 value : "northwest" ,
 text : "North West" 
 },
 {
 value : "southeast" ,
 text : "South East" 
 },
 {
 value : "southwest" ,
 text : "South West" 
 },
 {
 value : "westmidlands" ,
 text : "West Midlands" 
 },
 {
 value : "yorkshire" ,
 text : "Yorkshire and the Humber" 
 }
 ]
}) }} 
 
 
 

### Error messages

Display an error message if the user has not selected an option. 

Style error messages as shown in the example: 

 

 

 
 Open this example in a new tab : select with error – select 
 
 
 
 
 
 
 
 HTML 
 
 Nunjucks 
 
 
 HTML 
 

 

 < div class = "govuk-form-group govuk-form-group--error" > 
 < label class = "govuk-label" for = "location" > 
 Choose location
 </ label > 
 < div id = "location-hint" class = "govuk-hint" > 
 This can be different to where you went before
 </ div > 
 < p id = "location-error" class = "govuk-error-message" > 
 < span class = "govuk-visually-hidden" > Error: </ span > Select a location
 </ p > 
 < select class = "govuk-select govuk-select--error" id = "location" name = "location" aria-describedby = "location-hint location-error" > 
 < option value = "choose" selected > Choose location </ option > 
 < option value = "eastmidlands" > East Midlands </ option > 
 < option value = "eastofengland" > East of England </ option > 
 < option value = "london" > London </ option > 
 < option value = "northeast" > North East </ option > 
 < option value = "northwest" > North West </ option > 
 < option value = "southeast" > South East </ option > 
 < option value = "southwest" > South West </ option > 
 < option value = "westmidlands" > West Midlands </ option > 
 < option value = "yorkshire" > Yorkshire and the Humber </ option > 
 </ select > 
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
 
 
 
 

 id 
 string 
 
 ID for the select box. Defaults to the value of name .
 
 
 

 name 
 string 
 
 Required. 
 Name property for the select.
 
 
 

 items 
 array 
 
 Required. 
 The items within the select component.
 See macro options for items .
 
 
 

 value 
 string 
 
 Value for the option which should be selected. Use this as an alternative to setting the selected option on each individual item.
 
 
 

 disabled 
 boolean 
 
 If true , select box will be disabled. Use the disabled option on each individual item to only disable certain options.
 
 
 

 described By 
 string 
 
 One or more element IDs to add to the aria-describedby attribute, used to provide additional descriptive information for screenreader users.
 
 
 

 label 
 object 
 
 Required. 
 The label used by the select component.
 See macro options for label .
 
 
 

 hint 
 object 
 
 Can be used to add a hint to the select component.
 See macro options for hint .
 
 
 

 error Message 
 object 
 
 Can be used to add an error message to the select component. The error message component will not display if you use a falsy value for errorMessage , for example false or null .
 See macro options for error Message .
 
 
 

 form Group 
 object 
 
 Additional options for the form group containing the select component.
 See macro options for form Group .
 
 
 

 classes 
 string 
 
 Classes to add to the select.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the select.
 
 
 
 
 
 Options for items array objects 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 value 
 string 
 
 Value for the option. If this is omitted, the value is taken from the text content of the option element.
 
 
 

 text 
 string 
 
 Required. 
 Text for the option item.
 
 
 

 selected 
 boolean 
 
 Whether the option should be selected when the page loads. Takes precedence over the top-level value option.
 
 
 

 disabled 
 boolean 
 
 Sets the option item as disabled.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the option.
 
 
 
 
 
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
 
 
 

 before Input 
 object 
 
 Content to add before the select used by the select component.
 See macro options for form Group before Input .
 
 
 

 after Input 
 object 
 
 Content to add after the select used by the select component.
 See macro options for form Group after Input .
 
 
 
 
 
 Options for form Group before Input object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add before the select. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add before the select. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for form Group after Input object 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 Text to add after the select. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 HTML to add after the select. If html is provided, the text option will be ignored.
 
 
 
 
 
 Options for label component 
 
 

 Name 
 Type 
 Description 
 
 
 
 

 text 
 string 
 
 Required. 
 If html is set, this is not required. Text to use within the label. If html is provided, the text option will be ignored.
 
 
 

 html 
 string 
 
 Required. 
 If text is set, this is not required. HTML to use within the label. If html is provided, the text option will be ignored.
 
 
 

 for 
 string 
 
 The value of the for attribute, the ID of the input the label is associated with.
 
 
 

 is Page Heading 
 boolean 
 
 Whether the label also acts as the heading for the page.
 
 
 

 classes 
 string 
 
 Classes to add to the label tag.
 
 
 

 attributes 
 object 
 
 HTML attributes (for example data attributes) to add to the label tag.
 
 
 
 
 
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
 
 
 
 
 

 {% from "govuk/components/select/macro.njk" import govukSelect %} 

 {{ govukSelect ({
 id : "location" ,
 name : "location" ,
 label : {
 text : "Choose location" 
 },
 hint : {
 text : "This can be different to where you went before" 
 },
 errorMessage : {
 text : "Select a location" 
 },
 items : [
 {
 value : "choose" ,
 text : "Choose location" ,
 selected : true 
 },
 {
 value : "eastmidlands" ,
 text : "East Midlands" 
 },
 {
 value : "eastofengland" ,
 text : "East of England" 
 },
 {
 value : "london" ,
 text : "London" 
 },
 {
 value : "northeast" ,
 text : "North East" 
 },
 {
 value : "northwest" ,
 text : "North West" 
 },
 {
 value : "southeast" ,
 text : "South East" 
 },
 {
 value : "southwest" ,
 text : "South West" 
 },
 {
 value : "westmidlands" ,
 text : "West Midlands" 
 },
 {
 value : "yorkshire" ,
 text : "Yorkshire and the Humber" 
 }
 ]
}) }} 
 
 
 

### Avoid adding functionality to allow selecting multiple options

The select component does not support selecting multiple options, as there’s a history of poor usability and assistive technology support for <select multiple> . If you need to ask the user to pick more than one item from a list, it’s almost always better to use another method, such as a list of checkboxes. 

## Research on this component

User research has shown that some users struggle with selects. 

### Known issues and gaps

Research shows that users can struggle with selects, particularly when users have: 
 

been unable to close the select 

tried to type into the select 

confused focused items with selected items 

tried to pinch zoom select options on smaller devices 

not understood that they can scroll down to see more items, or how to 
 

For more detail watch this video with examples of users struggling with selects . 

This blog shows an example where a text input is used over a select for asking a user for a date. 

 

 

 

## Help improve this component

 

 To help make sure that this page is useful, relevant and up to date, you can:
 
 
 

 take part in the
 
 ‘Select’ discussion on GitHub
 
 and share your research
 
 

 propose a change on GitHub 
 – read more about
 
 how to propose changes in GitHub
 
 
 

 

## Need help?

 

 If you’ve got a question about the GOV.UK Design System, contact the team .
 
 
 
 

 
 Back to top
