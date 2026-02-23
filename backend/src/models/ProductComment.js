const mongoose = require('mongoose');

const productCommentSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    comment: { type: String, required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductComment', default: null },
    isApproved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ProductComment', productCommentSchema);
