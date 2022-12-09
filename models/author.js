const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// Make dates looks pretty
AuthorSchema.virtual("birth_date_formatted").get(function(){
  return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth, {zone: 'utc'}).toLocaleString(DateTime.DATE_MED) : '';
})

AuthorSchema.virtual("death_date_formatted").get(function(){
  return this.date_of_death ? DateTime.fromJSDate(this.date_of_death, {zone: 'utc'}).toLocaleString(DateTime.DATE_MED) : '';
})

// Format the date to ISO format
AuthorSchema.virtual("birth_iso").get(function () {
  return DateTime.fromJSDate(this.date_of_birth, {zone: 'utc'}).toISO().substring(0, 10).toLocaleString(DateTime.DATE_MED);
});

AuthorSchema.virtual("death_iso").get(function () {
  if(this.date_of_death){
    return DateTime.fromJSDate(this.date_of_death, {zone: 'utc'}).toISO().substring(0, 10).toLocaleString(DateTime.DATE_MED);
  }else{
    return('')
  }
});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
