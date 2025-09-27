const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
require("dotenv").config();


app.use(express.static(path.join(__dirname)));

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


const notesSchema = {
    content: String,
    name: String
}

const Note = mongoose.model("Note", notesSchema);



app.get("/", function(req,res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
    let newNote = new Note({
        content: req.body.content,
         name: req.body.name || " " 
    });

    newNote.save()
        .then(() => {
            res.redirect("/?success=true");
        })
        .catch((err) => {
            console.error(err);
            res.redirect("/?success=false");
        });
});



app.get("/messages", async function(req, res) {
        res.sendFile(path.join(__dirname, 'messages.html'));

    try {
        const allNotes = await Note.find({});
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});

app.get("/api/notes", async function(req, res) {
    try {
        const allNotes = await Note.find({});
        res.json(allNotes);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Erreur serveur"});
    }
});



app.listen(process.env.PORT, function () {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});


