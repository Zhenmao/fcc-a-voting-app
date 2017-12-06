const mongoose = require("mongoose"),
      User = require("./models/user"),
      Poll = require("./models/poll");
      
const data = [
    {
        username: "potato",
        password: "password",
        polls: [
            {
                pollText: "What's your favorite kind of chocolate?", 
                options: [
                    {
                        optionText: "Milk chocolate",
                        count: 5
                    },
                    {
                        optionText: "Dark chocolate",
                        count: 7
                    },
                    {
                        optionText: "White chocolate",
                        count: 2
                    }
                ]
            },
            {
                pollText: "What's your favorite season?",
                options: [
                    {
                        optionText: "Spring",
                        count: 3
                    },
                    {
                        optionText: "Summer",
                        count: 2
                    },
                    {
                        optionText: "Fall",
                        count: 10
                    },
                    {
                        optionText: "Winter",
                        count: 6
                    }
                ]
            }
        ]
    },
    {
        username: "tomato",
        password: "password",
        polls: [
            {
                pollText: "Coffee or tea?", 
                options: [
                    {
                        optionText: "Coffee",
                        count: 15
                    },
                    {
                        optionText: "Tea",
                        count: 12
                    },
                ]
            },
            {
                pollText: "Do you think you are a dog person or a cat person?",
                options: [
                    {
                        optionText: "Cat person, meow.",
                        count: 7
                    },
                    {
                        optionText: "Dog person, woof.",
                        count: 10
                    },
                    {
                        optionText: "I can't decide. They're both so cute.",
                        count: 3
                    }
                ]
            },
            {
                pollText: "What's your favorite day of the week?",
                options: [
                    {
                        optionText: "Monday",
                        count: 2
                    },
                    {
                        optionText: "Tuesday",
                        count: 1
                    },
                    {
                        optionText: "Wednesday",
                        count: 4
                    },
                    {
                        optionText: "Thursday",
                        count: 2
                    },
                    {
                        optionText: "Friday",
                        count: 6
                    },
                    {
                        optionText: "Saturday",
                        count: 10
                    },
                    {
                        optionText: "Sunday",
                        count: 6
                    }
                ]
            }
        ]
    }
];

function seedDB() {
    // Remove all users
    User.remove({}).exec()
    .then(Poll.remove({}).exec())
    .then(data.forEach(function(datum) {
        User.register( new User({ username: datum.username }), datum.password, function(err, user) {
            if (err) throw err;
            datum.polls.forEach(function(poll) {
                const newPoll = new Poll({
                    pollText: poll.pollText,
                    creator: { id: user._id, username: user.username },
                    options: []
                });
                poll.options.forEach(function(option) {
                    newPoll.options.push({
                        optionText: option.optionText,
                        count: option.count
                    })
                });
                newPoll.save();
            });
        });
    }))
    .catch(function(err) {
        console.log(err);
    });
}

module.exports = seedDB;