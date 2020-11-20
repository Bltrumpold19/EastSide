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


hbs.registerHelper("getMenuData", (id,cb)=>{

    var str = ''

    let data = fs.readFileSync(__dirname + '/menu.json')
    let menu = JSON.parse(data)

    for (var i = 0; i < menu.pizza.pizzaToppings.length; i++)
    {
        console.log(menu.pizza.pizzaToppings[i])
    }

    //console.log(menu.appetizers.itemSizesSize[0])
    //console.log(menu)
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