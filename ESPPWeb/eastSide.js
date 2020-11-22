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


app.get('/', (req,res)=>{
    res.render('index')
})

app.get('/index', (req,res)=>{
    res.render('index')
})

app.get('/contact', (req,res)=>{
    res.render('about')
})

app.get('/menu', (req,res)=>{
    res.render('menu')
})

app.get('/*', (req,res)=>{
    res.render('404')
})

const port = process.env.PORT || 80
app.listen(port, ()=>{console.log("Server running on port " + port)})