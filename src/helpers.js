var queries = require('../db/queries')

module.exports = {
  async getVideos (id) {
    var result
    var message
    if (id) {
      result = await queries.getSingleVideo(id)
      message = 'GET /videos: Getting single video'
    } else {
      result = await queries.getAll()
      message = 'GET /videos: Getting all videos'
    }
    return [message, result]
  },

  async checkDuplicate (id) {
    return await queries
      .getSingleVideo(id)
      .then(result => result.length > 0)
      .catch(err => console.error(err))
  },

  empty (input) {
    if (input === undefined || input === '') {
      return true
    }
  },

  isMalformed (payload) {
    return (
      this.empty(payload.video_id) ||
      this.empty(payload.name) ||
      this.empty(payload.date_created) ||
      this.empty(payload.type) ||
      this.empty(payload.size)
    )
  }
}
