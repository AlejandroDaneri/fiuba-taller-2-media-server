var knex = require('./knex.js')

function Videos () {
  return knex('videos')
}

// *** queries *** //

function getAll () {
  return Videos().select()
}

function addVideo (content) {
  return Videos().insert(content, 'video_id')
}

function getSingleVideo (videoID) {
  return Videos().where('video_id', parseInt(videoID))
}

module.exports = {
  getAll: getAll,
  addVideo: addVideo,
  getSingleVideo: getSingleVideo
}
