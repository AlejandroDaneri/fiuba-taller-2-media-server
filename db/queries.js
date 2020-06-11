var knex = require('./knex.js')

function Videos () {
  return knex('videos')
}

function Pictures () {
  return knex('pictures')
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

function getPicture (userID, callback = r => r) {
  return Pictures()
    .where('user_id', userID)
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
async function deletePicture (id) {
  const deleted = await Pictures()
    .select('name')
    .where('user_id', id)
    .first()
  await Videos()
    .where('user_id', id)
    .del()
  return deleted
}

function addPicture (content) {
  return Pictures().insert(content, 'user_id')
}

function updatePicture (userID, name, url) {
  return Pictures()
    .where({ user_id: userID })
    .update({ name: name, url: url })
}

module.exports = {
  getAll: getAll,
  addVideo: addVideo,
  getSingleVideo: getSingleVideo,
  deleteVideo: deleteVideo,
  addPicture: addPicture,
  getPicture: getPicture,
  deletePicture: deletePicture,
  updatePicture: updatePicture
}
