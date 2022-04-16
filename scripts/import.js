'use strict';

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const fs = require('fs');
const _  = require('lodash');
const moment = require('moment');

const firebaseConfig = {
  apiKey: "AIzaSyC8GCF_rrFY_rg5eejwb6nBShlc00Z91_8",
  authDomain: "all-my-love-to-long-ago.firebaseapp.com",
  projectId: "all-my-love-to-long-ago",
  storageBucket: "all-my-love-to-long-ago.appspot.com",
  messagingSenderId: "935149629673",
  appId: "1:935149629673:web:fb8280d5341a439596c078",
  measurementId: "G-2QCMX5EX1N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

(async () => {
  try {
    const data = JSON.parse(fs.readFileSync('data.json'));

    for (let i = 0; i < data.length; i++) {
      const record = data[i];
      if (!record.created_on && record.updated_on) {
        record.created_on = record.updated_on;
      }
      if (!record.updated_on && record.created_on) {
        record.updated_on = record.created_on;
      }

      record.created_on = moment.utc(record.created_on.slice(0, -4)).toDate();
      record.updated_on = moment.utc(record.updated_on.slice(0, -4)).toDate();
    }

    const records = _.sortBy(data, ['created_on', 'updated_on']);
    for (let i = 0; i < records.length; i++) {
      await addDoc(collection(db, 'notes'), records[i]);
    }
  }
  catch (error) {
    console.log(error);
  }
})();
