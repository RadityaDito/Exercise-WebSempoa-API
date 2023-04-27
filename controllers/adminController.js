import Admin from "../models/adminSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const getAllAdmin = async (req, res) => {
  try {
    //Find All Admin
    const admins = await Admin.find();

    //Response
    res.status(200).json({ data: admins });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const Register = async (req, res) => {
  try {
    //Take data from request body
    const { username, password, role } = req.body;

    //Error Handling
    if (
      role.toUpperCase() !== "ADMIN_CABANG" &&
      role.toUpperCase() !== "IBO" &&
      role.toUpperCase() !== "ADMIN_IBO"
    ) {
      res.status(404).json({ message: "Invalid role" });
      return;
    }

    //Hash The Password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create New Admin and Add it to the database
    const admin = new Admin({
      username: username,
      password: hashedPassword,
      role: role.toUpperCase(),
    });
    const newAdmin = await admin.save();

    //Response
    res
      .status(200)
      .json({ data: newAdmin, message: "Success Registering New Admin" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    //Take data from req.body
    const { username, password } = req.body;

    //Find Admin with the username
    const admin = await Admin.findOne({ username: username });

    //If Admin is not found
    if (!admin) {
      res.status(404).json({ message: "Admin Not Found" });
      return;
    }

    //Check the Password
    const match = await bcrypt.compare(password, admin.password);

    //If password is not match
    if (!match) {
      res.status(404).json({ message: "Wrong Password" });
      return;
    }

    //Generate Token
    const accessToken = generateAccessToken(admin);
    // const refreshToken = generateRefreshToken(admin);

    //Add refreshToken to the admin database
    // admin.refresh_token = refreshToken;
    // await admin.save();

    //Create Cookie
    res.cookie("authorization", accessToken, {
      httpOnly: true,
      maxAge: 24 * 1000 * 60 * 60, //24 jam = 60 * 60 * 24 * 1 * 1000
    });

    //Response
    res.status(200).json({ data: admin });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const Logout = async (req, res) => {
  try {
    //Delete Cookie
    res.clearCookie("authorization");
    res.status(200).json({ message: "Logout successfull" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role, username: admin.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
};
