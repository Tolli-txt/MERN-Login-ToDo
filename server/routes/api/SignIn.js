const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

module.exports = app => {
  app.post("/api/account/signup",
    (req, res, next) => {
      const { body } = req;
      console.log('body', body);
      const { firstName, lastName, password } = body;
      let { email } = body;

      if (!firstName) {
        return res.send({
          sucess: false,
          message: "Error: Please write in a name."
        });
      }
      if (!lastName) {
        return res.send({
          sucess: false,
          message: "Error: Please write in a last name."
        });
      }
      if (!email) {
        return res.send({
          sucess: false,
          message: "Error: Email must be filled in."
        });
      }
      if (!password) {
        return res.send({
          sucess: false,
          message: "Error: Password error."
        });
      }

      console.log("If you see this, stuff is working.");

      email = email.toLowerCase();
      User.find(
        {
          email: email
        },
        (err, previousUser) => {
          if (err) {
            return res.send({
              sucess: false,
              message: "Error: Server Error"
            });
          } else if (previousUser.length > 0) {
            return res.send({
              sucess: false,
              message: "Error: Account already exists"
            });
          }

          const newUser = new User();
          newUser.email = email;
          newUser.firstName = firstName;
          newUser.lastName = lastName;
          newUser.password = newUser.generateHash(password);
          newUser.save((err, user) => {
            if (err) {
              return res.send({
                sucess: false,
                message: "Error: Server Error"
              });
            }
            return res.send({
              sucess: true,
              message: "Congrats! You have been registered!"
            });
          });
        });
    });
  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const {
      password
    } = body;
    let {
      email
    } = body;

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }

    email = email.toLowerCase();
    email = email.trim();

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        console.log('err 2:', err);
        return res.send({
          success: false,
          message: 'Error: User does not exist.'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }

      // Otherwise correct user
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: User does not exist.'
          });
        }
        return res.send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        });
      });
    });
  });
  app.get("/api/account/verify", (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.find({
      _id: token,
      isRemoved: false
    }, (err, seassion) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      };
      if (seassion.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        return res.send({
          success: true,
          message: 'Good'
        });
      }
    });
  });
  app.get('/api/account/logout', (req, res, next) => {
    const { query } = req;
    const { token } = query;
    UserSession.findOneAndUpdate({
      _id: token,
      isRemoved: false
    }, {
      $set: {
        isRemoved: true
      }
    }, null, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
        success: true,
        message: 'Good'
      });
    });
  });
};
