const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM messages;` in SQL
		const messages = await db.select("*").from("messages")
		res.json(messages)
	} catch (err) {
		next(err)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		// translates to `SELECT * FROM messages WHERE id = ? LIMIT 1;` in SQL
		const [message] = await db
			.select("*")
			.from("messages")
			.where("id", req.params.id)
			.limit(1)

		res.json(message)
	} catch (err) {
		next(err)
	}
})

router.post("/", async (req, res, next) => {
	try {
		// specify each value being sent to the database as a security precaution
		const payload = {
			title: req.body.title,
			contents: req.body.contents,
		}

		// translates to `INSERT INTO messages (title, contents) VALUES (?, ?);` in SQL
		const [id] = await db.insert(payload).into("messages")
		const message = await db("messages").where("id", id).first()
		
		res.status(201).json(message)
	} catch (err) {
		next(err)
	}
})

router.put("/:id", async (req, res, next) => {
	try {
		const payload = {
			title: req.body.title,
			contents: req.body.contents,
		}

		// translates to `UPDATE messages SET title = ? AND contents = ? WHERE id = ?;` in SQL
		await db("messages").update(payload).where("id", req.params.id)
		const message = await db("messages").where("id", req.params.id).first()

		res.json(message)
	} catch (err) {
		next(err)
	}
})

router.delete("/:id", async (req, res, next) => {
	try {
		// translates to `DELETE FROM messages WHERE id = ?;` in SQL
		await db("messages").where("id", req.params.id).del()

		// since we no longer have a resource to return, just send a 204
		// (which means success, but no response data is being sent back)
		res.status(204).end()
	} catch (err) {
		next(err)
	}
})

module.exports = router
