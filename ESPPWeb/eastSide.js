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
    str += '</div>' //  end pizzaContHead
    str += '<div id="pizzaTopCont">'
    for (var i = 0; i < menu.pizza.pizzaToppings.length; i++)
    {
        str += menu.pizza.pizzaToppings[i]
    }
    str += '</div>' // end pizzaTopCont
    str += '<div id="sizesCont">'
    for (var i = 0; i < menu.pizza.sizes.length; i++)
    {
        str += '<li class="pizzaSize">' + menu.pizza.sizes[i] + '</li>'
    }
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
        /*str += '<li class="smallPrices">' + menu.pizza.prices.small[i] + '</li>'
        str += '<li class="mediumPrices">' + menu.pizza.prices.medium[i] + '</li>'
        str += '<li class="largePrices">' + menu.pizza.prices.large[i] + '</li>'*/
    }
    for(var i = 0; i < menu.pizza.prices.specialTop.length; i++)
    {
        str += '<li class="specialPrices">' + menu.pizza.prices.specialTop[i] + '</li>'
    }
    str += '</div>' // end pizzaPriceCont
    str += '</div>' // end pizzaCont
    return new hbs.handlebars.SafeString(str)
})

hbs.registerHelper("getMenuDataGrinder", (id,cb)=>{
    var str = ''
    str += '<div id="grinderCont">'
    str += '<div id="grinderHeader">'
    str += '</div>' // end grinderHeader
    str += '<div id="grinderSizes">'
    for(var i = 0; i < menu.grinders.sizes.length; i++)
    {
        str += menu.grinders.sizes[i]
    }
    str += '</div>' // end grinderSizes
    str += '<div id="grinderTypes">'
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
    str += '</div>' // end grinderCont
    return new hbs.handlebars.SafeString(str)
})

hbs.registerHelper("getDinnerData", ()=>{
    var str = ''

    str += '<div id="dinnerCont">'
    str += '<div id="dinnerHeader">'
    str += '</div>' // end dinnerHeader
    str += '<div id="pastaDinnerCont">'
    str += '<div class="pastaDinner">'
    for (var i = 0; i < menu.dinners.pastaDinners.pastaTypes.length; i++){
        str += menu.dinners.pastaDinners.pastaTypes[i]
    }
    str += menu.dinners.pastaDinners.pastaPrices.basePrice
    str += '</div>' // end pastaDinner
    str += '<div class="pastaDinner">'
    for (var i = 0; i < menu.dinners.pastaDinners.toppings.length; i++){
        str += menu.dinners.pastaDinners.toppings[i]
    }
    str += menu.dinners.pastaDinners.pastaPrices.withTopping
    str += menu.dinners.pastaDinners.pastaPrices.withMozz
    str += '</div>' // end pastaDinner
    str += '</div>' // end pastaDinnerCont
    str += '<div id="otherDinnersCont">'
    for(var i = 0; i < menu.dinners.otherDinners.length; i++)
    {
        str += menu.dinners.otherDinners[i].itemName
        str += menu.dinners.otherDinners[i].price
    }
    str += '</div>' // end otherDinnersCont
    str += '</div>' // end dinnerCont
    return new hbs.handlebars.SafeString(str)

})

hbs.registerHelper("getBreadData", ()=>{
    var str = ''
    str += '<div id="breadCont">'
    str += '<div id="breadHeader">'
    str += '</div>' // end breadHeader
    str += '<div id="breads">'
    for(var i = 0; i < menu.breads.breadType.length; i++)
    {
        str += menu.breads.sizes[i]
        str += menu.breads.breadType[i].itemName
        str += menu.breads.breadType[i].price.small
        str += menu.breads.breadType[i].price.large
    }
    str += '</div>' // end breads
    str += '</div>' // end breadCont
    return new hbs.handlebars.SafeString(str)
})

hbs.registerHelper("getDataApps", ()=>{
    var str = ''
    str += '<div id="appsCont">'
    str += '<div id="appsHeader">'
    str += '</div>' // end appsHeader
    str += '<div id="itemSizesNum">'
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
    str += '</div>' // end appsCont
    return new hbs.handlebars.SafeString(str)
})

hbs.registerHelper("getDataSalads", ()=>{
    var str = ''
    str += '<div id="saladsCont">'
    str += '<div id="saladsHead">'
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