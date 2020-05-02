# TextInput Component Validation

```text
@startuml

title Activity Diagram \n


(*) --> "User focuses on text input"

if "Is first interaction with input" then
  -r->[yes] "Don't validate on value change"

else
  -->[no] "Was input invalid before"
  if "" then
    --> [yes] "Validate on value change"
    --> (*)
  else
    --> [no] "Don't validate on value change"
    --> (*)

endif

@enduml
```
