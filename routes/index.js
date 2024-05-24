const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const mongoose = require('mongoose');
const Music = mongoose.model('Music');
const axios = require('axios');

router.get('/form', (req, res) => {
  res.render('form');
});

router.post('/', [
  check('name').isLength({ min: 1 }).withMessage('Please enter a Song Name'),
  check('artist').isLength({ min: 1 }).withMessage('Please enter an Artist'),
  check('rating').isLength({ min: 1 }).withMessage('Please select a rating'),
], (req, res) => {
  const errors = validationResult(req);
  let selectedRating = 0;

  if (errors.isEmpty()) {
    // Aggregate the highest rating value
    if (Array.isArray(req.body.rating)) {
      req.body.rating.forEach((value) => {
        if (parseInt(value) > selectedRating) {
          selectedRating = parseInt(value);
        }
      });
    }

    // Saving the data to the database
    saveData(req.body, selectedRating)
     .then((savedId) => {
        res.json(savedId);
      })
     .catch((err) => {
        console.error(err);
        res.status(500).send('Something went wrong!');
      });
  } else {
    res.render('form', {
      title: 'Music Form',
      errors: errors.array(),
      data: req.body,
    });
  }
});

router.get('/', (req, res) => {
  Music.find()
    .then((songs) => {
      res.render('index', { title: 'Listing Favorite Music', songs });
    })
    .catch(() => { res.send('Something went wrong.'); });
})

router.get('/:id', async (req, res) => {
  try {

    // Find the music entry by its ID
    const musicEntry = await Music.findById(req.params.id);

    // Check if the music entry exists
    if (!musicEntry) {
      return res.status(404).send('Music entry not found.');
    }

    // Return the single page
    res.render('single', {
      title: 'Music Entry',
      song: musicEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
});

router.get('/findLyrics/:songId', async (req, res) => {
  try {
    // Find the music entry by its ID
    const musicEntry = await Music.findById(req.params.songId);

    // Check if the music entry exists
    if (!musicEntry) {
      return res.status(404).send('Song not found.');
    }

    // Extract song name and artist
    const { name, artist } = musicEntry;
    console.log(musicEntry);

    fetchLyrics(name, artist)
     .then(response => {
        Music.find()
        .then((songs) => {
          res.render('index', { title: 'Listing Favorite Music', songs: songs, lyrics: response.lyrics });
        })
        .catch(() => {         
          Music.find()
          .then((songs) => {
            res.render('index', { title: 'Listing Favorite Music', songs: songs, lyrics: "No Lyrics Found!" });
          }) });
      })
     .catch(error => {
        console.error('Error fetching lyrics:', error.message);
        res.status(500).send('Failed to fetch lyrics.');
      });

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
});

async function saveData(data, selectedRating) {
  try {
    const musicRegistration = new Music(data);
    await musicRegistration.save();
    console.log(data, selectedRating);
    return musicRegistration._id;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function fetchLyrics(songName, artist) {
  try {
    // console.log(`https://api.lyrics.ovh/v1/${artist}/${songName}`);
    const response = await axios.get(`https://api.lyrics.ovh/v1/${artist}/${songName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lyrics:', error.message);
  }
}

module.exports = router;
