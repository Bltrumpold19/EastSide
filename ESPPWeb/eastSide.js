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


hbs.registerHelper("getMenuDataPizza", (id,cb)=>{

    var str = ''

    let data = fs.readFileSync(__dirname + '/menu.json')
    let menu = JSON.parse(data)

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
        str += '<li class="smallPrices">' + menu.pizza.prices.small[i] + '</li>'
        str += '<li class="mediumPrices">' + menu.pizza.prices.medium[i] + '</li>'
        str += '<li class="largePrices">' + menu.pizza.prices.large[i] + '</li>'
    }
    for(var i = 0; i < menu.pizza.prices.specialTop.length; i++)
    {
        str += '<li class="specialPrices">' + menu.pizza.prices.specialTop[i] + '</li>'
    }
    str += '</div>' // end pizzaPriceCont
    str += '</div>' // end pizzaCont
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