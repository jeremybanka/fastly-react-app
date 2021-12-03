import { Model } from "miragejs"
// import moment from 'moment'

export default Model.extend({
  save() {
    if (this.attrs.createdAt == null) {
      this.attrs.createdAt = new Date()
      // this.attrs.createdAt = moment.utc().toDate()
    }
    this.attrs.updatedAt = new Date()
    // this.attrs.updatedAt = moment.utc().toDate()
    Model.prototype.save.apply(this, arguments) // eslint-disable-line
    return this
  },
})
