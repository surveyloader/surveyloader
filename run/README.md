## Run
[surveyloader.org/run](http://surveyloader.org/run/)

"Run" runs surveys from  a survey configuration using a declarative JSON format. These configurations are hosted on the surveyloader [Firebase](https://www.firebase.com/docs/rest/api/) and can be accessed with the "name" url query. E.g. [surveyloader.org/loader/?name=example](http://surveyloader.org/loader/?name=example) loads the configuration from the [configurations/example](https://surveyloader.firebaseio.com/configurations/example.json) endpoint. The *configurations/*name** endpoint actually returns a list of configurations ordered by date of modification. By default the loader runs the latest version of a configuration, however the "v" url query can override this default.

The JSON configuration itself specifies a `table` of environmnent variables (as a JSON Object). It also specifies a `queue` of survey modules for the loader to run (as a JSON Array). Each element in `queue` is a JSON Object which must specify a module `type` and any parameter values that the loader should assign to the module. Modules can access environment variables through a `$` syntax. E.g. to access `foo: "bar"` from `table` specify `$foo` as a module parameter value (`$foo` evaluates to `"bar"`).

### Basic example
*configuration.json*:
```
{
  table: {
    message: "Hello world?"
  },
  queue: [
    {
      type: "Dialog",
      text: "$message"
    }
  ]
}
```
Imagine a **Dialog** module which accepts a `text` parameter to display along with "Yes" and "No" buttons. In this example the loader would run the **Dialog** module supplying its `text` parameter with the value `"Hello world?"`. The loader exposes a `push` function to each survey module which pushes the modules response values to `table` and advances the survey to the next module in `queue`. In this instance if a respondent clicks "Yes" the loader would push something like `dialogResponse: "Yes"` onto `table` and conclude the survey.