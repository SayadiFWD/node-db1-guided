const express = require("express")
const welcomeRouter = require("./welcome/welcome-router")
const messagesRouter = require("./messages/messages-router")

const server = express()

server.use(express.json())
server.use("/", welcomeRouter)
server.use("/messages", messagesRouter)

server.use((err, req, res, next) => {
	console.log(err)

	res.status(500).json({
		message: "Something went wrong",
	})
})

module.exports = server
