<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn.shopify.com/s/assets/external/app.js"></script>
	<script type="text/javascript">
	ShopifyApp.init({
		apiKey: '55512454cd904b56d38a12c8573aa27a',
		shopOrigin: 'https://test-store-1994-1994.myshopify.com'
	});
	</script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>



  <link rel='stylesheet' href='/stylesheets/bootstrap.min.css' />
	<link rel='stylesheet' href='/stylesheets/style.css' />
	<title><%= title %></title>

  </head>
  <body>

    <div class="row">
  <div class="large-6 columns">
  	<h1><%= title %></h1>
    <div class="row collapse">
      <div class="small-12 columns">
        <a href="/addLiquid">Add Liquid</a>
      </div>
      <div class="small-12 columns">
        <a href="/addProduct">Add A Product</a>
      </div>
    </div>
  </div>
</div>
    <h2>Products</h2>
    <p>

    </p>
    <div id="insert-products">
      <% var stringProducts =  JSON.stringify(products);
      var parsedProducts = JSON.parse(products);

      parsedProducts.forEach(function(element){ %>
        <div class="well">


        <%- element.title %>
        <form class="numRelForm">
          Number of Related Items:
            <select name="numOfRel">
              <option value="1">
                1
              </option>
              <option value="2">
                2
              </option>
              <option value="3">
                3
              </option>
              <option value="4">
                4
              </option>
              <option value="5">
                5
              </option>
              <option value="6">
                6
              </option>
            </select>
        </form>

        </div>
    <%  })
      %>

    </div>

    <script type="text/javascript">
	ShopifyApp.ready(function(){
		ShopifyApp.Bar.initialize({
			title: '<%= title %>',
			buttons: {
				primary: {
					label: "Save",
					message: 'bar_save'
				},
			}
		});
		ShopifyApp.Bar.loadingOff();
	});

  // var stringProducts = <%- JSON.stringify(products) %>
  // var parsedProducts = JSON.parse(stringProducts);
  //   parsedProducts.forEach(function(element){
  //     $('#insert-products').append("<p>" +
  //     element.title + "</p>")
  //   });
	</script>

  </body>
</html>
