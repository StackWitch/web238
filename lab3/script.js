$(document).ready(function () {
  $("input[name='distanceMode']").on("change", function () {
    if ($(this).val() === "manual") {
      $("#manualInputs").slideDown();
    } else {
      $("#manualInputs").slideUp();
    }
  });

  $("#international").on("change", function () {
    if ($(this).is(":checked")) {
      alert("International flight detection not yet implemented. Please continue with manual settings.");
      $(this).prop("checked", false);
    }
  });

  $("#riskTolerance").on("input", function () {
    $("#riskValue").text($(this).val() + " minutes");
  });

  $("#calcForm").on("submit", function (e) {
    e.preventDefault();

    let flightTime = $("#flight").val();
    let mode = $("input[name='distanceMode']:checked").val();

    let driveTime = 0;
    if (mode === "manual") {
      driveTime = parseInt($("#drive").val()) || 0;
    } else {
      alert("Automatic calculation not yet implemented. Please enter manually.");
      return;
    }

    let earlyTime = 0;
    switch ($("#airportSize").val()) {
      case "small":
        earlyTime = 60;
        break;
      case "medium":
        earlyTime = 90;
        break;
      case "large":
        earlyTime = 120;
        break;
      case "veryLarge":
        earlyTime = 150;
        break;
    }


    let riskTolerance = parseInt($("#riskTolerance").val()) || 60;
    earlyTime = Math.max(earlyTime, riskTolerance);
    let totalExtra = 0;
    if ($("#tsa").is(":checked")) totalExtra -= 15;
    if ($("#checkedBag").is(":checked")) totalExtra += 15;
    if ($("#ada").is(":checked")) totalExtra += 10;

    totalExtra += parseInt($("#eatTime").val()) || 0;
    totalExtra += parseInt($("#parkingTime").val()) || 0;
    totalExtra += driveTime + earlyTime;

    let [hours, minutes] = flightTime.split(":").map(Number);
    let flightDate = new Date();
    flightDate.setHours(hours, minutes, 0);

    let leaveDate = new Date(flightDate.getTime());
    leaveDate.setMinutes(flightDate.getMinutes() - totalExtra);

    let leaveTimeStr = leaveDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    $("#result")
      .hide()
      .text(`You should leave at: ${leaveTimeStr}`)
      .slideDown(600, function () {
        let $this = $(this);

        $this.addClass("flash");

        void $this[0].offsetWidth;

        setTimeout(() => {
          $this.removeClass("flash");
        }, 500);
      });

  });
});
