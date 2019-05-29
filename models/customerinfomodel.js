var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

var jobcardInfoSchema = new Schema({
    workType: String,
    arrival: {
        date: Date,
        time: String
    },
    delivery: {
        date: Date,
        time: String
    },
    availableFuel: Number,
    runningKM: Number,
    status: String,
    customerComplain: {
        type: Array,
        complain: String
    },
    advisorSolution: {
        type: Array,
        description: String,
        price: Number
    },
    accessories: {
        serviceBook: Boolean,
        toolKit: Boolean,
        spareWheel: Boolean,
        jack: Boolean,
        jackHandle: Boolean,
        carPerfume: Boolean,
        clock: Boolean,
        stereo: Boolean,
        CDPlayer: Boolean,
        mouthPieces: Boolean,
        CDChanger: Boolean,
        idols: Number,
        wheelCover: Number,
        wheelCap: Number,
        mudFlaps: Number,
        dickyMat: Number,
        cigaretteLighter: Boolean,
        speakerRR: Number,
        speakerFR: Number,
        tweeters: Number,
        exlWarranty: Boolean
    },

    parts: {
        type: Array,
        partId: String,
        price: String,
        quantity: Number,
        repairFlag: Boolean,
        status: String
    },
    services: {
        type: Array,
        serviceId: String,
        details: String,
        price: Number,
        status: String
    },
    lubricants: {
        type: Array,
        lubricantId: String,
        price: String,
        status: String
    },

    payment: {
        total: Number,
        discount: {
            type: String,
            amount: Number
        },
        final: Number,
        pending: {
            amount: Number
        }
    }
}, {
    timestamps: true
})

var CustomerInfo = new Schema({
   name: String,
   contact: {
       phone: Number,
       email: String
   },
   address: {
       address: String,
       city: String,
       state: String,
       pincode: Number
   },
   documents: {
       aadhaarNumber: Number,
       rcNumber: String,
       licenseNumber: String
   },
   customerType: String,

   vehicleInfo: {
       vehicleNumber: String,
       VIN: String, //optional
       companyId: String,
       modelId: String,
       varientId: String,
       engineNumber: String, //optional
       fuelType: String,
       vehicleType: String,
       interiorColor: String,
       exteriorColor: String,

       jobcardInfo: [jobcardInfoSchema],
   }
}, {
    timestamps: true
})

module.exports = mongoose.model('CustomerInfo', CustomerInfo)