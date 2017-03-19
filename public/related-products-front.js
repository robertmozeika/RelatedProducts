console.log('is active')
// if (location.pathname.substring(1,9) == "products"){
if (location.pathname.indexOf("/products/") > -1){

var prevstorename = location.host.replace(".myshopify.com","");
var storename = prevstorename.replace('.com', "");
var productIndex = location.pathname.indexOf('/products/') + 10;
var handle = location.pathname.substring(productIndex);
console.log(handle)
    if(handle){
        console.log('is handle')
        jQuery.ajax({
            type: "GET",
            url: "https://simple-related-products.herokuapp.com/getJSON/client?handle=" + handle + "&shop=" + storename,
            contentType: "application/json; charset=utf-8",
            async: true,
            dataType: "json",
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                var datastring = "";
                var noBlanks = [];
                data.products.forEach(function(element){
                    if (element.title !== "blank"){
                        noBlanks.push(element)
                    }
                })
                if (noBlanks.length){
                    var width = (1 / noBlanks.length);
                    noBlanks.forEach(function(element){
                        console.log('happened')
                        var titleLink = element.handle; 

                        if (element.image){
                           datastring = datastring.concat("<a style='display:block' href='" + titleLink + "'><div class='related-product'> <img src=" + element.image + "><div class='rpTitle'>"+ element.title + "</div><div class='rpPrice'>$" + element.price + "</div></div></a>")
                        } else {
                            datastring = datastring.concat("<a style='display:block' href='" + titleLink + "'><div class='related-product'><div class='rpTitle'>" + element.title + "</div><div class='rpPrice'>$" + element.price + "</div></div></a>")
                        }

                    })
                    console.log(datastring)

                    jQuery('main').append("<div id='relatedProducts' class='row' style='display:flex; justify-content: space-around'></div>");
                    jQuery('#relatedProducts').append('<div id="rpHeader"><h4 id="rpHeadText"><span>' + data.header + '</span></h4></div>')
                    jQuery('#relatedProducts').append(datastring);


                    $('head').append('<style>\
                        #relatedProducts{\
                            padding-top: 100px;\
                            flex-wrap: wrap;\
                            padding-bottom: 50px;\
                        }\
                        .related-product{\
                            text-align:center;\
                            font-size: 20px;\
                        }\
                        #rpHeader {\
                            flex-grow: 1;\
                            flex-basis: 100%;\
                            text-align: center;\
                        }\
                        #rpHeadText{\
                            border-bottom: 1px solid #e5e5e5;\
                            line-height: 0;\
                            margin-bottom: 50px;\
                        }\
                        #rpHeadText span {\
                            background-color: white;\
                        }\
                        .rpPrice{\
                            font-size: 15px;\
                            height: 18px;\
                        }\
                        .rpTitle{\
                            height: 23px;\
                        }\
                        </style>')

                }

           }
         })
        }

}
    jQuery.fn.cleanWhitespace = function() {
    textNodes = this.contents().filter(
        function() { return (this.nodeType == 3 && !/\S/.test(this.nodeValue)); })
        .remove();
    return this;
}



    