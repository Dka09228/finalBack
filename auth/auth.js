const User = require("/Users/kima/finalBack/models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret =
  "a0272a903219d701138f13626afb46ec7dce5bfb59565b16f3749b6d378b7ba0837444";
  exports.register = async (req, res, next) => {
    const { username, password, firstName, lastName, age, country, gender } = req.body;
    
    try {
      // Validate password length
      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
    
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
    
      // Create the user with all the provided fields
      const user = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        age,
        country,
        gender,
      });
    
      // Generate JWT token
      const maxAge = 3 * 60 * 60; // 3 hours
      const token = jwt.sign(
        { id: user._id, username, role: user.role },
        jwtSecret,
        { expiresIn: maxAge }
      );
    
      // Set JWT token in cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000, // Convert to milliseconds
      });
    
      // Respond with success message and user details
      res.status(201).json({
        message: "User successfully created",
        user: {
          _id: user._id,
          username: user.username,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          age: user.age,
          country: user.country,
          gender: user.gender,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        // Username is already taken
        res.status(400).json({ message: "Username is already taken" });
      } else {
        // Other error occurred
        res.status(400).json({ message: "User not created", error: error.message });
      }
    }
  };
  
  

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      res.status(400).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      // comparing given password with hashed password
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
            role: user.role,
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

exports.update = async (req, res, next) => {
    const { role, id } = req.body;
    // Verifying if role and id is present
    if (role && id) {
        // Verifying if the value of role is admin
        if (role === "admin") {
            try {
                // Finds the user with the id
                const user = await User.findById(id);
                
                // Verifies the user is not an admin
                if (user.role !== "admin") {
                    user.role = role;
                    const updatedUser = await user.save();
                    res.status(201).json({ message: "Update successful", user: updatedUser });
                } else {
                    res.status(400).json({ message: "User is already an Admin" });
                }
            } catch (error) {
                res.status(400).json({ message: "An error occurred", error: error.message });
            }
        } else {
            res.status(400).json({
                message: "Role is not admin",
            });
        }
    } else {
        res.status(400).json({ message: "Role or Id not present" });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ message: "_id is required" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        return res.status(204).json({ message: "User successfully deleted" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};


exports.getUsers = async (req, res, next) => {
  await User.find({})
    .then((users) => {
      const userFunction = users.map((user) => {
        const container = {};
        container.username = user.username;
        container.role = user.role;
        container.id = user._id;

        return container;
      });
      res.status(200).json({ user: userFunction });
    })
    .catch((err) =>
      res.status(401).json({ message: "Not successful", error: err.message })
    );
};