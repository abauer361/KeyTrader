
const userSchema = {
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
};

module.exports = userSchema;