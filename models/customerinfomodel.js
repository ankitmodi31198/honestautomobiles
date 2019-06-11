var mongoose = require('mongoose')
var Schema = require('mongoose').Schema

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
       company: {
           companyId: String,
           name: String
       },
       model: {
            modelId: String,
            name: String
       },
       varient: {
           varientId: String,
           name: String
       },
       engineNumber: String, //optional
       fuelType: String,
       vehicleType: String,
       interiorColor: String,
       exteriorColor: String,       
    },
    jobcardInfo: {     
        jobcardNumber: String,        
        workType: String,
        arrival: {
            // date: Date,
            date: String,
            time: String
        },
        delivery: {
            // date: Date,
            date: String,
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
            serviceBook: String,
            toolKit: String,
            spareWheel: String,
            jack: String,
            jackHandle: String,
            carPerfume: String,
            clock: String,
            stereo: String,
            CDPlayer: String,
            mouthPieces: String,
            CDChanger: String,
            idols: Number,
            wheelCover: Number,
            wheelCap: Number,
            mudFlaps: Number,
            dickyMat: Number,
            cigaretteLighter: String,
            speakerRR: Number,
            speakerFR: Number,
            tweeters: Number,
            exlWarranty: String
        },
    
        parts: {
            type: Array,
            name: String,
            partId: String,            
            price: String,
            quantity: Number,
            repairFlag: Boolean,
            labour: Number,
            status: String
        },
        services: {
            type: Array,
            name: String,
            serviceId: String,
            details: String,
            price: Number,
            labour: Number,
            status: String
        },
        lubricants: {
            type: Array,
            name: String,
            lubricantId: String,
            price: String,
            labour: Number,
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
    },
    history: {
        type: Array,
        jobcardNumber: String,        
        workType: String,
        arrival: {
            // date: Date,
            date: String,
            time: String
        },
        delivery: {
            // date: Date,
            date: String,
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
            serviceBook: String,
            toolKit: String,
            spareWheel: String,
            jack: String,
            jackHandle: String,
            carPerfume: String,
            clock: String,
            stereo: String,
            CDPlayer: String,
            mouthPieces: String,
            CDChanger: String,
            idols: Number,
            wheelCover: Number,
            wheelCap: Number,
            mudFlaps: Number,
            dickyMat: Number,
            cigaretteLighter: String,
            speakerRR: Number,
            speakerFR: Number,
            tweeters: Number,
            exlWarranty: String
        },
    
        parts: {
            type: Array,
            name: String,
            partId: String,            
            price: String,
            quantity: Number,
            repairFlag: Boolean,
            labour: Number,
            status: String
        },
        services: {
            type: Array,
            name: String,
            serviceId: String,
            details: String,
            price: Number,
            labour: Number,
            status: String
        },
        lubricants: {
            type: Array,
            name: String,
            lubricantId: String,
            price: String,
            labour: Number,
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
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('CustomerInfo', CustomerInfo)