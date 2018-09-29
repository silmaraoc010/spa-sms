
'use strict';

let dataDetail=[];

Vue.component('product', {
    props: ['image','title','price','id'],
    template: `
    <div class="col s4 m2" >
        <div  class="card card-height" >
            <div class="card-image">
                <img :src="image">
                <span class="card-title"></span>
                <a id="btn"class="btn-floating halfway-fab waves-effect waves-light red" href="#"><i v-on:click="detailsProductos(id)" class="material-icons">add</i></a>
            </div>
        <div id="product-card" class="card-content">
            <p id="pro-title" >{{ title }}</p>
            <p class="price">R$ {{ price }}</p>
        </div>
        </div>
    </div>
    `,
    methods: {
        detailsProductos: function (id){
            console.log(id);
            

                $.ajax({
                    url:`https://api.mercadolibre.com/items/${id}`,
                    type: 'GET',
                    datatype: 'json',
                })
                .done((response)=>{
                    // console.log(response);
                    printingDetails(response);
                })
                .fail(()=>{
                    console.log("error");
                })
            
        }
    }
})


const app = new Vue ({
    el: '#vue',
    data: {
        products:[],
    },
    methods: {
        
        ajaxProducts: function (endpoint){

            $.ajax({
                url:`https://api.mercadolibre.com/sites/MLB/search?q=${endpoint}`,
                type: 'GET',
                datatype: 'json',
            })
            .done((response)=>{
                console.log(response);
                this.products = response.results;
            })
            .fail(()=>{
                console.log("error");
            })
        }
    }
})


function printingDetails(element){
    // console.log(element);
    let productName = element.title;
    // console.log(productName);
    let productPrice = element.price;
    let image1= element.pictures[0].url;
    console.log(image1);

    let template = `
    <div id="content-template">
        <div class="row">
            <div class="slider offset-m1 offset-l1 col s12 m6 l6">
                <img src="${image1}">
            </div>
            <div id="data-product" class="col s12 m3">
              <h4>${productName}</h4>
              <h5>R$${productPrice}</h5>
              <div id="paypal-detail"></div> 
            </div>
            <a href="#" onClick="cleanAreaOfProductsDetails()"><i class="material-icons close col m1" >close</i></a>
        </div>
    </div>`;

 
  $('#detail-product').append(template);
  paypal.Button.render({
    // Configure environment
    env: 'sandbox',
    client: {
      sandbox: 'AgVp3S42ue1sslkh-skgWYaRnX6sAt8zHjaFes-E1qAKLOkIaZzC7tgZ',
      production: 'demo_production_client_id'
    },
    // Customize button (optional)
    locale: 'en_US',
    style: {
      size: 'small',
      color: 'gold',
      shape: 'pill',
    },
    // Set up a payment
    // Set up a payment
  payment: function (data, actions) {
    return actions.payment.create({
      transactions: [{
        amount: {
          total: productPrice,
          currency: 'R$',
          
        },
        description: 'The payment transaction description.',
        custom: '7YYYDVDVNRR4K2JB',
     
        payment_options: {
          allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
        },
        soft_descriptor: 'ECHI5786786',
        item_list: {
          items: [
            {
              name: productName,
              quantity: '1',
              price: productPrice,
              currency: 'R$'
            },
            
          ],
         
        }
      }],
      note_to_payer: 'Contact us for any questions on your order.'
    });
  },
    // Execute the payment
    onAuthorize: function (data, actions) {
      return actions.payment.execute()
        .then(function () {
          // Show a confirmation message to the buyer
          window.alert('Thank you for your purchase!');
        });
    }
  }, '#paypal-detail');
}

  
function cleanAreaOfProductsDetails (){
    $("#detail-product").empty();
}


