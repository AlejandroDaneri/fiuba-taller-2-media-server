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
  return Videos().where('video_id', videoID)
}

function deleteVideo (id) {
  const deleted = Videos.select('name').where('video_id', id)
  Videos()
    .where('video_id', id)
    .del()
  return deleted
}

module.exports = {
  getAll: getAll,
  addVideo: addVideo,
  getSingleVideo: getSingleVideo,
  deleteVideo: deleteVideo
}
