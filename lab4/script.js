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

    $("#result").hide();
    $("#calcForm").fadeOut(400);
    $("#flightGallery").fadeIn(500);

    let flightTime = $("#flight").val();
    let mode = $("input[name='distanceMode']:checked").val();
    let driveTime = mode === "manual" ? parseInt($("#drive").val()) || 0 : 0;

    let earlyTime = {
      small: 60,
      medium: 90,
      large: 120,
      veryLarge: 150,
    }[$("#airportSize").val()];

    let riskTolerance = parseInt($("#riskTolerance").val()) || 60;
    earlyTime = Math.max(earlyTime, riskTolerance);

    let totalExtra = driveTime + earlyTime;
    if ($("#tsa").is(":checked")) totalExtra -= 15;
    if ($("#checkedBag").is(":checked")) totalExtra += 15;
    if ($("#ada").is(":checked")) totalExtra += 10;
    totalExtra += parseInt($("#eatTime").val()) || 0;
    totalExtra += parseInt($("#parkingTime").val()) || 0;

    let [hours, minutes] = flightTime.split(":").map(Number);
    let flightDate = new Date();
    flightDate.setHours(hours, minutes, 0);
    let leaveDate = new Date(flightDate.getTime() - totalExtra * 60000);
    let leaveTimeStr = leaveDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    let current = 0;
    const imgs = $("#flightGallery .gallery-img");
    const interval = setInterval(() => {
      imgs.removeClass("active");
      current = (current + 1) % imgs.length;
      imgs.eq(current).addClass("active");
    }, 1200);

    setTimeout(() => {
      clearInterval(interval);
      $("#flightGallery").fadeOut(700, function () {
        $("#result")
          .hide()
          .text(`You should leave at: ${leaveTimeStr}`)
          .slideDown(800, function () {
            $("html, body").animate(
              { scrollTop: $("#result").offset().top - 50 },
              800
            );
          });
        $("#calcForm").fadeIn(500);
      });
    }, 4500);
  });
});
