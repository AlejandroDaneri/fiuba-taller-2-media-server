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

function getSingleVideo (videoID, callback = r => r) {
  return Videos()
    .where('video_id', videoID)
    .then(r => {
      callback(r)
      return r
    })
    .catch(e => {
      // eslint-disable-next-line standard/no-callback-literal
      callback('', e)
    })
}

async function deleteVideo (id) {
  const deleted = await Videos()
    .select('name')
    .where('video_id', id)
    .first()
  await Videos()
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
