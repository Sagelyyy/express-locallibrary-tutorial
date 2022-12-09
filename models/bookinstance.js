const mongoose = require("mongoose");
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Available", "Maintenance", "Loaned", "Reserved"],
    default: "Maintenance",
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

// Format the dates to make the look pretty
BookInstanceSchema.virtual("due_back_formatted").get(function () {
  return DateTime.fromJSDate(this.due_back, {zone: 'utc'}).toLocaleString(DateTime.DATE_MED);
});

// Format the date to ISO format
BookInstanceSchema.virtual("due_back_iso").get(function () {
  if(this.due_back){
    return DateTime.fromJSDate(this.due_back, {zone: 'utc'}).toISO().substring(0, 10).toLocaleString(DateTime.DATE_MED);
  }else{
    return ''
  }
});


// Export model
module.exports = mongoose.model("BookInstance", BookInstanceSchema);
