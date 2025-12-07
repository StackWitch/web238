$(document).ready(function() {

  const cities = [
    {name: "Paris", img: "https://picsum.photos/id/1015/400/250", fact: "Paris is called the 'City of Light'."},
    {name: "Rome", img: "https://picsum.photos/id/1016/400/250", fact: "Rome is home to the Colosseum."},
    {name: "Berlin", img: "https://picsum.photos/id/1011/400/250", fact: "Berlin has more bridges than Venice."},
    {name: "Madrid", img: "https://picsum.photos/id/1012/400/250", fact: "Madrid hosts the oldest restaurant in the world."},
    {name: "London", img: "https://picsum.photos/id/1013/400/250", fact: "London has the largest number of free museums."}
  ];

  let currentCity = {};
  let score = 0;

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function newCity() {
    const randomIndex = Math.floor(Math.random() * cities.length);
    currentCity = cities[randomIndex];

    $("#cityImage").attr("src", currentCity.img);
    $("#feedback").hide();
    $("#fact").hide();

    const options = [currentCity.name];
    while (options.length < 4) {
      const randomOption = cities[Math.floor(Math.random() * cities.length)].name;
      if (!options.includes(randomOption)) options.push(randomOption);
    }

    shuffle(options);

    $(".choice-btn").each((i, btn) => {
      $(btn).text(options[i]).prop("disabled", false).css("background", "#3b82f6");
    });
  }

  $(".choice-btn").click(function() {
    const guess = $(this).text();
    if (guess === currentCity.name) {
      $("#feedback").text("Correct! 🎉").fadeIn(400).delay(800).fadeOut(400);
      $("#fact").text(currentCity.fact).slideDown(500);

      score++;
      $("#points").fadeOut(100, function() {
        $(this).text(score).fadeIn(300);
      });

      $(".choice-btn").prop("disabled", true);
      $(this).css("background", "#10b981");

      setTimeout(newCity, 2000);

    } else {
      $("#feedback").text("Try again! ❌").fadeIn(400).delay(800).fadeOut(400);
      $(this).prop("disabled", true).css("background", "#ef4444");
    }
  });

 $("nav a").click(function(e) {
  const target = $(this).attr("href");

  if (target.startsWith("#")) {
    e.preventDefault();
    $("html, body").animate({scrollTop: $(target).offset().top}, 600);
  }
});


  newCity();
});
