const mongoose = require('mongoose')
const Schema = mongoose.Schema
const TicketSchema = new Schema({
    name: String,
    ticket: String,
    expires_in: Number,
    meta: {
        createAt: {
            type: Date,
            default: Date.now
        },
        updateAt: {
            type: Date,
            default: Date.now
        }
    }
})


TicketSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = Date.now()
    }
    this.meta.updateAt == Date.now()
    next()
})


TicketSchema.statics = {
    async getTicket() {
        let ticket = await this.findOne({
            name: 'ticket'
        })
        return ticket
    },

    async setTicket(data) {
        let ticket = await this.findOne({
            name: 'ticket'
        })
        if (ticket) {
            ticket.ticket = data.ticket
            ticket.expires_in = data.expires_in
        } else {
            ticket = new Ticket({
                name: 'ticket',
                ticket: data.ticket,
                expires_in: data.expires_in,
            })
        }
        await ticket.save()
        return ticket
    }
}

module.exports = Ticket = mongoose.model('Ticket', TicketSchema)