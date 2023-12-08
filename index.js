const express = require("express")
const app = express()
const db = require("./db")
const { json } = require("body-parser");
const cors = require("cors")
const path = require("path") 

app.use(cors())


app.post("/loginByUser", json(), async (req, res) => {
    const {user, pass} = req.body

    const response = await db.loginByUser(user, pass)

    res.send(response)
})

app.post("/loginByToken", json(), async(req, res) => {
    const {token } = req.body

    const response = await db.loginByToken(token)
    res.send(response)
})

app.get("/getInfo/:type", async(req, res) => {
    const infoType = req.params.type;

    const data = await db.getInfosByType(infoType)

    res.send(data)
})

app.post("/sendInfo/:type", json(), async(req, res) => {
    const infoType = req.params.type;
    const infos = req.body

    console.log(infos);

    const response = await db.sendInfosByType(infoType, infos)

    res.send(response)
})

app.post("/removeInfo/:type", json(), async(req, res) => {
    const infoType = req.params.type;
    const num = req.body.num;

    const response = await db.removeInfoByType(infoType, num)

    res.send(response)

})

app.use(express.static(path.join(__dirname, "build")))


app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"))
    // res.sendFile(path.join(__dirname, "build", "index.html"));

})

app.listen("5000", () => {
    console.log("on")
})
