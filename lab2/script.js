$(document).ready(function () {
  // Toggle manual input
  $("input[name='distanceMode']").on("change", function () {
    if ($(this).val() === "manual") {
      $("#manualInputs").slideDown();
    } else {
      $("#manualInputs").slideUp();
    }
  });

  // International flight placeholder
  $("#international").on("change", function() {
    if ($(this).is(":checked")) {
      alert("International flight detection not yet implemented. Please continue with manual settings.");
      $(this).prop("checked", false);
    }
  });

  // Risk tolerance slider display
  $("#riskTolerance").on("input", function() {
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

    // Map airport size to default early arrival minutes
    let earlyTime = 0;
    switch($("#airportSize").val()) {
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

    // Add risk tolerance adjustment
    let riskTolerance = parseInt($("#riskTolerance").val()) || 60;
    earlyTime = Math.max(earlyTime, riskTolerance); // ensure at least risk tolerance minutes

    // Extra airport factors
    let totalExtra = 0;
    if ($("#tsa").is(":checked")) totalExtra -= 15; // TSA PreCheck
    if ($("#checkedBag").is(":checked")) totalExtra += 15; // Checked bag
    if ($("#ada").is(":checked")) totalExtra += 10; // ADA assistance

    totalExtra += parseInt($("#eatTime").val()) || 0; // Eating
    totalExtra += parseInt($("#parkingTime").val()) || 0; // Parking
    totalExtra += driveTime + earlyTime; // Drive + early arrival

    // Flight time conversion
    let [hours, minutes] = flightTime.split(":").map(Number);
    let flightDate = new Date();
    flightDate.setHours(hours, minutes, 0);

    // Calculate leave time
    let leaveDate = new Date(flightDate.getTime());
    leaveDate.setMinutes(flightDate.getMinutes() - totalExtra);

    let leaveTimeStr = leaveDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    // Show result
    $("#result")
      .hide()
      .text(`You should leave at: ${leaveTimeStr}`)
      .fadeIn(800);
  });
});
