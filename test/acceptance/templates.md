- Templates
  - This is a template
    template:: This is a template
    template-including-parent:: true
    - with
    - some
    - children
  - {{renderer :template-button, This is a template, :title " + This is a template", :action append}}
  - {{renderer :template-button, This is a template, :title " + This is the template as a button", :action append}}
