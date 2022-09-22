const UserController = {
  createUser: async (req, res) => {
    return res.status(201).json({ status: "SUCCESS", message: "user created", data: req.body });
  }
};

module.exports = UserController;