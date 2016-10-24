window.onload = function () {

  // Create layer selector
  function createSelector(layer) {
    var condition = ""; // SQL or CartoCSS string
    var $options = $(".layer_selector").find("li");
    $options.click(function(e) {
      var $li = $(e.target);
      var selected = $li.attr('data');
      var type = $li.data('type'); // 'sql' or 'cartocss'

      if (type === "cartocss") { // if a CartoCSS selector is chosen, set the style
        $options.removeClass('cartocss_selected');
        if (selected !== "simple") {
          $li.addClass('cartocss_selected');
        }

        condition = $('#'+selected).text();
        layer.setCartoCSS(condition);
      } else { // if a SQL selector is chosen, re-query the data
        $options.removeClass('sql_selected');
        if (selected !== "") {
          $li.addClass('sql_selected');
        }

        layer.setSQL("SELECT * FROM " + tableName + selected);
      }
    });
  }

  // this is the table where the data lives
  var tableName = "powerplants_us_201603";

  // it is a public layer in mishmashmaps' account
  var layerSource = {
    user_name: 'mishmashmaps',
    type: 'cartodb',
    sublayers: [{
      sql: "SELECT * FROM " + tableName, // All power plants in dataset
      cartocss: $("#simple").text() // Simple visualization
    }]
  }

  // For storing the sublayer
  var sublayer;

  // Instantiate new map object, place it in 'map' element
  var map_object = new L.Map('map', {
    center: [42.6526,-73.7562], // Albany
    // center: [37.0902,-84.4437914], // U.S.
    zoom: 7
    // zoom: 5
  });

  // Set basemap as Dark Matter Lite
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map_object);

  // Add data layer to your map
  cartodb.createLayer(map_object,layerSource)
    .addTo(map_object)
    .done(function(layer) {
      sublayer = layer.getSubLayer(0);
      createSelector(sublayer);
    })
    .error(function(err) {
      console.log("error: " + err);
    });
}
