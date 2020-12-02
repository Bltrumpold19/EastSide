const express = require('express')
const hbs = require('hbs')
const AWS = require('aws-sdk')
const { CodeBuild } = require('aws-sdk')
const fetch = require("node-fetch"); 
const fs = require('fs-extra')

const app = express()
app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/views/images'))
hbs.registerPartials(__dirname + '/views/partials')
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended:false}))
let data = fs.readFileSync(__dirname + '/menu.json')
let menu = JSON.parse(data)

hbs.registerHelper("getMenuDataPizza", (id,cb)=>{

    var str = ''

    str += '<div id="pizzaCont">'
    str += '<div id="pizzaContHead">'
    str += '<h2 id="pizzaHead">Pizza</h2>'
    //str += '<hr id="hrHeadPizza">'
    str += '</div>' //  end pizzaContHead
    str += '<div id="pizzaTopCont">'
    str += '<h2 id="topHead">Toppings</h2>'
    str += '<hr id="pizzaTopHead">'
    str += '<p id="paraTopping">'
    for (var i = 0; i < menu.pizza.pizzaToppings.length; i++)
    {
        str += menu.pizza.pizzaToppings[i] + " "
        if (i == 6 || i == 12){
            str += '<br>'
        }
    }
    str += '</p>'
    str += '</div>' // end pizzaTopCont
    str += '<div class="table-responsive pizzaTableCont">'
    str += '<table class="table table-sm table-borderless pizzaTable">'
    str += '<thead>'
    str += '<tr>'
    str += '<th scope="col"></th>'
    for (var i = 0; i < menu.pizza.sizes.length; i++)
    {
        str += '<th scope="col" class="sizes">' + menu.pizza.sizes[i] + '</th>'
    }
    str += '</tr>'
    str += '</thead>'
    str += '<tbody>'
    for (var i = 0; i < menu.pizza.toppingAmounts.length; i++)
    {
        str += '<tr>'
        str += '<th scope="row" class="toppingAmount">' + menu.pizza.toppingAmounts[i] + '</th>'
        str += '<td>' + menu.pizza.prices.small[i] + '</td>'
        str += '<td>' +  menu.pizza.prices.medium[i] + '</td>'
        str += '<td>' + menu.pizza.prices.large[i] + '</td>'
        str += '</tr>'
    }
    str += '</tbody>'
    str += '</table>'
    str += '</div>' // end tableDiv
    str += '<div id="specialCont">'
    str += '<h2 id="specialTopHead">Special Toppings</h2>'
    str += '<hr id="specialTopHR">'
    str += '<p class="specialPara">'
    for(var i = 0; i < menu.pizza.specialPizzaToppings.length; i++)
    {
        str += menu.pizza.specialPizzaToppings[i] + ' '
    }
    str += '</p>'
    str += '<p class="specialPara">'
    for(var i = 0; i < menu.pizza.prices.specialTop.length; i++)
    {
        str += menu.pizza.prices.specialTop[i] + ' '
    }
    str += '</p>'
    str += '</div>'
    str += '</div>'

    //str += '<div id="pizzaTopCont">'
    /*str += '<p id="paraTopping">'
    for (var i = 0; i < menu.pizza.pizzaToppings.length; i++)
    {
        str += menu.pizza.pizzaToppings[i] + " "
        if (i == 6 || i == 12){
            str += '<br>'
        }
    }
    str += '</p>'
    str += '</div>' // end pizzaTopCont
    str += '<div id="sizesCont">'*/

    /*str += '<p id="pizzaSizes">'
    for (var i = 0; i < menu.pizza.sizes.length; i++)
    {
        str += menu.pizza.sizes[i] + ' '
    }
    str += '</p>'
    str += '</div>' // end sizesCont
    str += '<div id="toppingAmountCont">'
    for (var i = 0; i < menu.pizza.toppingAmounts.length; i++)
    {
        str += '<li class="toppingAmount">' + menu.pizza.toppingAmounts[i] + '</li>'
    }
    str += '</div>' // end toppingAmountCont
    str += '<div id="pizzaPriceCont">'
    for (var i = 0; i < menu.pizza.prices.small.length; i++)
    {
        str += '<p class="pizzaPrices">'
        str += menu.pizza.prices.small[i] + ' '
        str += menu.pizza.prices.medium[i] + ' '
        str += menu.pizza.prices.large[i] + ' '
        str += '</p>'
    }
    for(var i = 0; i < menu.pizza.prices.specialTop.length; i++)
    {
        str += '<li class="specialPrices">' + menu.pizza.prices.specialTop[i] + '</li>'
    }
    str += '</div>' // end pizzaPriceCont*/
    //str += '</div>' // end pizzaCont
    return new hbs.handlebars.SafeString(str)
})

hbs.registerHelper("getMenuDataGrinder", (id,cb)=>{
    var str = ''
    str += '<div id="grinderCont">'
    str += '<div id="grinderHeader">'
    str += '<h2 id="grinderHead">Grinders</h2>'
    str += '</div>' // end grinderHeader
    str += '<div class="table-responsive grinderTableCont">'
    str += '<table class="table table-sm table-borderless grinderTable">'
    str += '<thead>'
    str += '<tr>'
    str += '<th scope="col"></th>'
    for(var i = 0; i < menu.grinders.sizes.length; i++)
    {
        str += '<th scope="col" class="grinderSizes">' +  menu.grinders.sizes[i] + '</th>'
    }
    str += '</tr>'
    str += '</thead>'
    str += '<tbody>'
    for (var i = 0; i < menu.grinders.grinderTypes.length; i++)
    {
        str += '<tr>'
        str += '<th scope="row" class="grinderTypes">' + menu.grinders.grinderTypes[i].itemName + '</th>'
        for(var x = 0; x < menu.grinders.grinderTypes[i].price.length; x++)
        {
            str += '<td>' + menu.grinders.grinderTypes[i].price[x] + '</td>'
        }
    }
    str += '</tbody>'
    str += '</table>' // end grinderTable
    str += '</div>' // end grinderTableCont
    str += '<div id="grinderToppings">'
    str += '<h2 id="toppingHeader">Toppings</h2>'
    str += '<hr class="grinderHR">'
    for (var i = 0; i < menu.grinders.toppings.length; i++)
    {
        str += menu.grinders.toppings[i] + ' '
    }
    str += '</div>' // end grinderToppings
    str += '<div id="grinderCheeseTypes">'
    str += '<h2 id="cheeseHeader">Cheese</h2>'
    str += '<hr class="grinderHR">'
    for(var i = 0; i < menu.grinders.cheeseTypes.length; i++)
    {
        str += menu.grinders.cheeseTypes[i] + ' '
    }
    str += '</div>'// end grinderCheeseTypes
    str += '<div id="grinderCondiments">'
    str += '<h2 id="condimentsHeader">Condiments</h2>'
    str += '<hr class="grinderHR">'
    for (var i = 0; i < menu.grinders.condiments.length; i++)
    {
        str += menu.grinders.condiments[i] + ' '
    }
    str += '</div>' // end grinderCondiments
    str += '<div id="grinderExtras">'
    str += '<h2 id="extrasHeader">Extras</h2>'
    str += '<hr class="grinderHR">'
    for(var i = 0; i < menu.grinders.extras.length; i++)
    {
        str += menu.grinders.extras[i].itemName + ' '
        str += menu.grinders.extras[i].price
        str += '<br>'
    }
    str += '</div>'
    str += '</div>' // end grinderCont
    
    
    
    
    
    
    
    
    
    
    
    /*str += '<div id="grinderTypes">'
    for (var i = 0; i < menu.grinders.grinderTypes.length; i++)
    {
        str += menu.grinders.grinderTypes[i].itemName
        for(var x = 0; x < menu.grinders.grinderTypes[i].price.length; x++)
        {
            str += menu.grinders.grinderTypes[i].price[x]
        }
    }
    str += '</div>' // end grinderTypes
    str += '<div id="grinderToppings">'
    for(var i = 0; i < menu.grinders.toppings.length; i++)
    {
        str += menu.grinders.toppings[i]
    }
    str += '</div>' // end grinderToppings
    str += '<div id="grinderCheese">'
    for(var i = 0; i < menu.grinders.cheeseTypes.length; i++)
    {
        str += menu.grinders.cheeseTypes[i]
    }
    str += '</div>' // end grinderCheese
    str += '<div id="grinderCondiments">'
    for (var i = 0; i < menu.grinders.condiments.length; i++)
    {
        str += menu.grinders.condiments[i]
    }
    str += '</div>' // end condiments
    str += '<div id="grinderExtras">'
    for(var i = 0; i < menu.grinders.extras.length; i++)
    {
        str += menu.grinders.extras[i].itemName
        str += menu.grinders.extras[i].price
    }
    str += '</div>' // end grinderExtras
    str += '</div>' // end grinderCont*/
    return new hbs.handlebars.SafeString(str)
})

hbs.registerHelper("getDinnerData", ()=>{
    var str = ''

    str += '<div id="dinnerCont">'
    str += '<div id="dinnerHeader">'
    str += '<h2 id="dinnerHead">Dinners</h2>'
    str += '</div>' // end dinnerHeader
    str += '<div id="pastaDinnerCont">'
    str += '<div class="pastaDinner">'
    str += '<h2 id="pastDinnerHead">Pasta Dinners</h2>'
    for (var i = 0; i < menu.dinners.pastaDinners.pastaTypes.length; i++){
        str += menu.dinners.pastaDinners.pastaTypes[i] + ' '
    }
    str += '<br>'
    str += menu.dinners.pastaDinners.pastaPrices.basePrice
    str += '</div>' // end pastaDinner
    str += '<div class="pastaDinner">'
    for (var i = 0; i < menu.dinners.pastaDinners.toppings.length; i++){
        str += menu.dinners.pastaDinners.toppings[i] + ' '
    }
    str += '<br>'
    str += menu.dinners.pastaDinners.pastaPrices.withTopping
    str += '<br>'
    str += 'w/Mozz ' + menu.dinners.pastaDinners.pastaPrices.withMozz
    str += '</div>' // end pastaDinner
    str += '</div>' // end pastaDinnerCont
    str += '<div id="otherDinnersCont">'
    str += '<h2 id="otherDinHead">Other Dinners</h2>'
    for(var i = 0; i < menu.dinners.otherDinners.length; i++)
    {
        str += menu.dinners.otherDinners[i].itemName + ' '
        str += menu.dinners.otherDinners[i].price
        str += '<br>'
    }
    str += '</div>' // end otherDinnersCont
    str += '</div>' // end dinnerCont
    return new hbs.handlebars.SafeString(str)

})

hbs.registerHelper("getBreadData", ()=>{
    var str = ''
    str += '<div id="breadCont">'
    str += '<div id="breadHeader">'
    str += '<h2 id="breadHead">Breads</h2>'
    str += '</div>' // end breadHeader
    str += '<div id="breads">'
    str += '<h2>Calzones</h2>'
    for(var i = 0; i < menu.breads.breadType.length; i++)
    {
        str += menu.breads.breadType[i].itemName + ' '
        str += '<br>'
        str += menu.breads.breadType[i].price.small + ' '
        str += menu.breads.breadType[i].price.large + ''
        str += '<br>'
    }
    str += '</div>' // end breads
    str += '</div>' // end breadCont
    return new hbs.handlebars.SafeString(str)
})

hbs.registerHelper("getDataApps", ()=>{
    var str = ''
    str += '<div id="appsCont">'
    str += '<div id="appsHeader">'
    str += '<h2 id="appHead">Appetizers</h2>'
    str += '</div>' // end appsHeader
    str += '<div class="table-responsive appsNumTableCont">'
    str += '<table class="table table-sm table-borderless appsNumTable">'
    str += '<thead>'
    str += '<tr>'
    str += '<th scope="col"></th>'
    str += '<th scope="col"></th>'
    for(var i = 0; i < menu.appetizers.itemSizesNumeric.length; i++)
    {
        str += '<th scope="col" class="appSizesNum">' + menu.appetizers.itemSizesNumeric[i] + '</th>'
    }
    str += '</tr>'
    str += '</thead>'
    str += '<tbody>'
    for (var i = 0; i < menu.appetizers.appItems.length; i++)
    {
        str += '<tr>'
        str += '<th scope="col"></th>'
        str += '<th scope="row" class="appItemName">' + menu.appetizers.appItems[i].itemName + '</th>'
        for(var x = 0; x < menu.appetizers.appItems[i].price[x]; x++)
        {
            str += '<td>' + menu.appetizers.appItems[i].price[x] + '</td>'
        }
    }
    str += '</tbody>'
    str += '</table>' // end appsNumTable
    str += '</div>' // end appsNumTableCont
    str += '<div class="table-responsive appsTextTableCont">'
    str += '<table class="table table-sm table-borderless appsTextTable">'
    str += '<thead>'
    str += '<tr>'
    str += '<th scope="col"></th>'
    for(var i = 0; i < menu.appetizers.itemSizesSize.length; i++)
    {
        str += '<th scope="col" class="appSizesText">' +  menu.appetizers.itemSizesSize[i] + '</th>'
    }
    str += '</tr>'
    str += '</thead>'
    str += '<tbody>'
    for(var i = 0; i < menu.appetizers.appsNonNumericSizes.length; i++)
    {
        str += '<tr>'
        str +=  '<th scope="row" class="appItemName">' + menu.appetizers.appsNonNumericSizes[i].itemName + '</th>'
        for(var x = 0; x < menu.appetizers.appsNonNumericSizes[i].price.length; x++){
            str += '<td>' + menu.appetizers.appsNonNumericSizes[i].price[x] + '</td>'
        }
    }
    str += '</table>' // end appsTextTable
    str += '</div>'// end appsTextTableCont
    str += '</div>' // end appsCont
    /*str += '<div id="itemSizesNum">'
    for (var i = 0; i < menu.appetizers.itemSizesNumeric.length; i++)
    {
        str += menu.appetizers.itemSizesNumeric[i]
    }
    str += '</div>' // end itemSizesNum
    str += '<div id="appItems">'
    for(var i = 0; i < menu.appetizers.appItems.length; i++)
    {
        str += menu.appetizers.appItems[i].itemName
        for(var x = 0; x < menu.appetizers.appItems[i].price[x]; x++)
        {
            str += menu.appetizers.appItems[i].price[x]
        }
    }
    str += '</div>' // end appItems
    str += '<div id="appItemsNonNum">'
    for(var i = 0; i < menu.appetizers.itemSizesSize.length; i++)
    {
        str += menu.appetizers.itemSizesSize[i]
    }
    for(var i = 0; i < menu.appetizers.appsNonNumericSizes.length; i++)
    {
        str += menu.appetizers.appsNonNumericSizes[i].itemName
        for(var x = 0; x < menu.appetizers.appsNonNumericSizes[i].price.length; x++){
            str += menu.appetizers.appsNonNumericSizes[i].price[x]
        }
    }
    str += '</div>' // end appItemsNonNum
    str += '</div>' // end appsCont*/
    return new hbs.handlebars.SafeString(str)
})

hbs.registerHelper("getDataSalads", ()=>{
    var str = ''
    str += '<div id="saladsCont">'
    str += '<div id="saladsHead">'
    str += '<h2 id="saladHead">Salads</h2>'
    str += '</div>' // end saladsHead
    str += '<div id="saladSizes">'
    for(var i = 0; i < menu.salads.itemSizes.length; i++){
        str += menu.salads.itemSizes[i]
    }
    str += '</div>' // end saladSizes
    str += '<div id="salads">'
    for(var i = 0; i < menu.salads.items.length; i++)
    {
        str += menu.salads.items[i].itemName
        for(var x = 0; x < menu.salads.items[i].price.length; x++)
        {
            str += menu.salads.items[i].price[x]
        }      
    }
    str += '</div>' // end salads
    str += '</div>' // end saladsCont
    return new hbs.handlebars.SafeString(str)
})

app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/index', (req,res)=>{
    res.render('index')
})

app.get('/contact', (req,res)=>{
    res.render('contact')
})

app.get('/menu', (req,res)=>{
    res.render('menu')
})

app.get('/*', (req,res)=>{
    res.render('404')
})

const port = process.env.PORT || 80
app.listen(port, ()=>{console.log("Server running on port " + port)})