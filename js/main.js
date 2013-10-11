(function() {
  $(function() {
    var $cmDataFixture, $datafixtureCodeMirror, $jsonCodeMirror, $outputCodeMirror, cmDataFixture, cmOutput, updateOutput, updateUI;

    $cmDataFixture = $(".cm-datafixture");
    cmDataFixture = CodeMirror($("#datafixture")[0], {
      value: window.templateDataFixture,
      mode: {
        name: "javascript"
      },
      lineNumbers: true,
      theme: "lesser-dark",
      lineNumbers: true,
      tabSize: 2,
      smartIndent: false
    });
    cmOutput = CodeMirror($("#output")[0], {
      value: "<output></output>",
      mode: {
        name: "javascript"
      },
      theme: "lesser-dark",
      lineNumbers: true,
      tabSize: 2,
      smartIndent: false,
      readOnly: true
    });
    $datafixtureCodeMirror = $("#datafixture .CodeMirror");
    $jsonCodeMirror = $("#json .CodeMirror");
    $outputCodeMirror = $("#output .CodeMirror");
    updateOutput = function(doc, changeObj) {
      var e, json, output;

      $cmDataFixture.removeClass("is-invalid");
      try {
        json = JSON.parse(cmDataFixture.getValue());
      } catch (_error) {
        e = _error;
        $cmDataFixture.addClass("is-invalid");
        cmOutput.setValue("Invalid JSON:\n" + e.message + "\n\nVerify your JSON Feed through:\nhttp://www.jslint.com/");
        return false;
      }
      try {
        output = DataFixture.generate(json);
        return cmOutput.setValue(JSON.stringify(output, null, "  "));
      } catch (_error) {
        e = _error;
        $cmDataFixture.addClass("is-invalid");
        return cmOutput.setValue("Mustache error:\n" + e.message);
      }
    };
    updateUI = function() {
      var offset, offsetWindowHeight, windowsHeight;

      offsetWindowHeight = $(".footer-container").outerHeight(true) + 50;
      if (!($(window).width() > 954)) {
        $datafixtureCodeMirror.css("height", "");
        $jsonCodeMirror.css("height", "");
        $outputCodeMirror.css("height", "");
        return;
      }
      windowsHeight = $(window).height();
      offset = $("#datafixture").offset();
      $datafixtureCodeMirror.height(windowsHeight - offset.top - offsetWindowHeight);
      $jsonCodeMirror.height(windowsHeight - offset.top - offsetWindowHeight);
      return $outputCodeMirror.height(windowsHeight - offset.top - offsetWindowHeight);
    };
    cmDataFixture.on("change", updateOutput);
    $(window).resize(updateUI);
    updateOutput();
    return updateUI();
  });

  window.templateDataFixture = '{\n\
  "number": 1,\n\
  "number_range": "1...10000",\n\
  "number_range_decimal": "1...10000:2",\n\
  "array":["some","value",3,"random"],\n\
  "ABC": "ABC:5",\n\
  "lorem": "lorem",\n\
  "plorem": "plorem:1...10:1...2",\n\
  "concat": "1|-|ABC:4|-|lorem:1...3",\n\
  "GUID": "GUID",\n\
  "obj": {\n\
    "#": "1...3",\n\
    "name": "lorem:1..3",\n\
    "GUID": "GUID",\n\
    "random_hour": "0...24|:|0...59|:|0...59",\n\
    "inner_object": {\n\
        "#":"1...2",\n\
        "GUID": "GUID"\n\
    }\n\
  }\n\
}';

  window.templateJson = "{\n    \"contacts\": [ \n      { \"first-name\" : \"Aenean\",\n        \"last-name\" : \"Nullam\",\n        \"phone\" : \"(965)420-5608\"\n      },\n      { \"first-name\" : \"Aenean\",\n        \"last-name\" : \"Erat\",\n        \"phone\" : \"(699)917-1169\"\n      },\n      { \"first-name\" : \"Aenean\",\n        \"last-name\" : \"Volutpat\",\n        \"phone\" : \"(443)531-9176\"\n      }\n    ]\n}";

}).call(this);
